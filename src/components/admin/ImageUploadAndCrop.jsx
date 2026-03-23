import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';
import { FaImage, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { fetchWithAuth } from '../../utils/apiAuth';

export default function ImageUploadAndCrop({ onUploadSuccess, aspect = 1 }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result));
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const uploadCroppedImage = async () => {
    try {
      setIsUploading(true);
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      const formData = new FormData();
      formData.append('image', croppedImageBlob, 'cropped_image.jpg');

      const response = await fetchWithAuth('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        onUploadSuccess(data.url);
        setImageSrc(null); // Close modal
      }
    } catch (e) {
      console.error("Upload error", e);
      alert("Gagal mengunggah gambar!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="relative">
        <label className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer transition text-sm">
          <FaImage /> <span>Upload File Foto</span>
          <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        </label>
      </div>

      {imageSrc && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-2xl h-[60vh] bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          
          <div className="w-full max-w-2xl bg-white p-4 rounded-b-xl flex justify-between items-center z-50">
             <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              className="w-1/2"
            />
            <div className="flex space-x-2">
              <button 
                onClick={() => setImageSrc(null)}
                className="flex items-center space-x-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                <FaTimes /> <span>Batal</span>
              </button>
              <button 
                onClick={uploadCroppedImage}
                disabled={isUploading}
                className="flex items-center space-x-1 px-4 py-2 bg-gold text-white rounded-md hover:bg-[#b09340] transition disabled:opacity-50"
              >
                {isUploading ? <FaSpinner className="animate-spin" /> : <FaCheck />} 
                <span>{isUploading ? 'Menyimpan...' : 'Crop & Upload'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
