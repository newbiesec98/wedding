import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaSave, FaTimes, FaEdit } from 'react-icons/fa';
import ImageUploadAndCrop from './ImageUploadAndCrop';
import { fetchWithAuth } from '../../utils/apiAuth';

export default function GalleryTab() {
  const [galleries, setGalleries] = useState([]);
  const [newImage, setNewImage] = useState({ imageUrl: '', caption: '', orderIndex: 0 });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const fetchGalleries = async () => {
    try {
      const res = await fetch('/api/galleries');
      const data = await res.json();
      setGalleries(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    if (!newImage.imageUrl) return;
    try {
      if (editingId) {
        await fetchWithAuth(`/api/galleries/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newImage)
        });
      } else {
        await fetchWithAuth('/api/galleries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newImage)
        });
      }
      setNewImage({ imageUrl: '', caption: '', orderIndex: 0 });
      setEditingId(null);
      fetchGalleries();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus foto ini?")) return;
    try {
      await fetchWithAuth(`/api/galleries/${id}`, { method: 'DELETE' });
      fetchGalleries();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="text-center p-8">Memuat Galeri...</div>;

  return (
    <div className="space-y-8 bg-white p-8 rounded-xl shadow-md border-t-4 border-gold">
      <div>
        <h2 className="text-2xl font-playfair text-dark-green mb-4 border-b pb-2">Manajemen Galeri Foto</h2>
        
        {/* Form Tambah/Edit Foto */}
        <form onSubmit={handleAddOrEdit} className="bg-gray-50 p-6 rounded-lg border border-gray-100 mb-8 space-y-4">
          <h3 className="font-semibold text-gray-700">{editingId ? 'Edit Foto' : 'Tambah Foto Baru'}</h3>
          
          <div className="mb-4">
            <ImageUploadAndCrop aspect={4/3} onUploadSuccess={(url) => setNewImage({...newImage, imageUrl: url})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">URL Foto</label>
              <input type="text" value={newImage.imageUrl} onChange={e => setNewImage({...newImage, imageUrl: e.target.value})} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none bg-white" placeholder="https://... atau gunakan Upload File di atas" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Caption (Opsional)</label>
              <input type="text" value={newImage.caption} onChange={e => setNewImage({...newImage, caption: e.target.value})} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none bg-white" />
            </div>
          </div>
          <div className="flex space-x-2 pt-2">
            <button type="submit" className="flex items-center space-x-2 bg-dark-green hover:bg-[#11261b] text-white px-4 py-2 rounded-md transition shadow text-sm">
              {editingId ? <><FaSave /> <span>Simpan Perubahan</span></> : <><FaPlus /> <span>Tambah ke Galeri</span></>}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setNewImage({ imageUrl: '', caption: '', orderIndex: 0 }); }} className="flex items-center space-x-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition shadow text-sm">
                <FaTimes /> <span>Batal</span>
              </button>
            )}
          </div>
        </form>

        {/* List Foto */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleries.map(item => (
            <div key={item.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
              <img src={item.imageUrl} alt={item.caption || 'Gallery'} className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                <button onClick={() => { setEditingId(item.id); setNewImage({ imageUrl: item.imageUrl, caption: item.caption || '', orderIndex: item.orderIndex || 0 }); }} className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          {galleries.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-8 italic text-sm">Belum ada foto di galeri.</div>
          )}
        </div>
      </div>
    </div>
  );
}
