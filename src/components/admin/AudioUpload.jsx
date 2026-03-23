import React, { useState } from 'react';
import { FaMusic, FaSpinner } from 'react-icons/fa';
import { fetchWithAuth } from '../../utils/apiAuth';

export default function AudioUpload({ onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploading(true);
      
      const formData = new FormData();
      // NOTE: backend `multer` middleware is currently configured to accept a field named 'image'
      // It does not restrict file types, so we can upload audio using this same field name.
      formData.append('image', file);

      try {
        const response = await fetchWithAuth('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.url) {
          onUploadSuccess(data.url);
        }
      } catch (err) {
        console.error("Upload error", err);
        alert("Gagal mengunggah file musik!");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="relative inline-block">
      <label className={`flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer transition text-sm ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {isUploading ? <FaSpinner className="animate-spin" /> : <FaMusic />} 
        <span>{isUploading ? 'Mengunggah...' : 'Upload File Audio'}</span>
        <input type="file" accept="audio/*" className="hidden" onChange={onFileChange} disabled={isUploading} />
      </label>
    </div>
  );
}
