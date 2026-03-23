import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaSave, FaTimes, FaEdit } from 'react-icons/fa';
import ImageUploadAndCrop from './ImageUploadAndCrop';
import { fetchWithAuth } from '../../utils/apiAuth';

export default function LoveStoryTab() {
  const [stories, setStories] = useState([]);
  const [newItem, setNewItem] = useState({ date: '', title: '', description: '', imageUrl: '', orderIndex: 0 });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/love_stories');
      const data = await res.json();
      setStories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    if (!newItem.title || !newItem.description) return;
    try {
      if (editingId) {
        await fetchWithAuth(`/api/love_stories/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
      } else {
        await fetchWithAuth('/api/love_stories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
      }
      setNewItem({ date: '', title: '', description: '', imageUrl: '', orderIndex: 0 });
      setEditingId(null);
      fetchStories();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus cerita ini?")) return;
    try {
      await fetchWithAuth(`/api/love_stories/${id}`, { method: 'DELETE' });
      fetchStories();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="text-center p-8">Memuat Data...</div>;

  return (
    <div className="space-y-8 bg-white p-8 rounded-xl shadow-md border-t-4 border-gold">
      <div>
        <h2 className="text-2xl font-playfair text-dark-green mb-4 border-b pb-2">Kisah Cinta & Perjalanan</h2>
        
        {/* Form Tambah/Edit */}
        <form onSubmit={handleAddOrEdit} className="bg-gray-50 p-6 rounded-lg border border-gray-100 mb-8 space-y-4">
          <h3 className="font-semibold text-gray-700">{editingId ? 'Edit Kisah/Momen' : 'Tambah Kisah/Momen Baru'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tanggal/Waktu (Misal: 2021)</label>
              <input type="text" value={newItem.date} onChange={e => setNewItem({...newItem, date: e.target.value})} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none bg-white" placeholder="Juli 2021" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Judul Momen</label>
              <input type="text" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none bg-white" placeholder="Pertama Bertemu" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Cerita Singkat</label>
              <textarea value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} rows="3" className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none resize-none bg-white" placeholder="Kami bertemu di..." required></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Foto Ilustrasi (Opsional) - Bisa Upload Gambar File</label>
              <div className="mb-2">
                 <ImageUploadAndCrop aspect={16/9} onUploadSuccess={(url) => setNewItem({...newItem, imageUrl: url})} />
              </div>
              <input type="text" value={newItem.imageUrl} onChange={e => setNewItem({...newItem, imageUrl: e.target.value})} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none bg-white" placeholder="https://... atau gunakan Upload File di atas" />
            </div>
          </div>
          <div className="flex space-x-2 pt-2">
            <button type="submit" className="flex items-center space-x-2 bg-dark-green hover:bg-[#11261b] text-white px-4 py-2 rounded-md transition shadow text-sm">
              {editingId ? <><FaSave /> <span>Simpan Perubahan</span></> : <><FaPlus /> <span>Simpan Momen</span></>}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setNewItem({ date: '', title: '', description: '', imageUrl: '', orderIndex: 0 }); }} className="flex items-center space-x-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition shadow text-sm">
                <FaTimes /> <span>Batal</span>
              </button>
            )}
          </div>
        </form>

        {/* List Cerita */}
        <div className="space-y-4">
          {stories.map(item => (
            <div key={item.id} className="flex bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative group">
              <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                  <h4 className="font-bold text-dark-green font-playfair">{item.title}</h4>
                  <span className="text-xs text-gold">({item.date})</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                {item.imageUrl && <a href={item.imageUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-2 inline-block">Lihat Lampiran Foto</a>}
              </div>
              <div className="flex bg-gray-50 rounded-r-lg border-l border-gray-200">
                <button onClick={() => { setEditingId(item.id); setNewItem({ date: item.date, title: item.title, description: item.description, imageUrl: item.imageUrl || '', orderIndex: item.orderIndex || 0 }); }} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-3 transition-colors opacity-0 group-hover:opacity-100">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 rounded-r-lg transition-colors opacity-0 group-hover:opacity-100">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          {stories.length === 0 && (
            <div className="text-center text-gray-400 py-8 italic text-sm">Belum ada kisah cinta yang ditambahkan.</div>
          )}
        </div>
      </div>
    </div>
  );
}
