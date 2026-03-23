import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaSave, FaTimes, FaEdit } from 'react-icons/fa';
import ImageUploadAndCrop from './ImageUploadAndCrop';
import { fetchWithAuth } from '../../utils/apiAuth';

export default function GiftTab() {
  const [gifts, setGifts] = useState([]);
  const [newItem, setNewItem] = useState({ bankName: '', accountNumber: '', accountHolder: '', qrCodeUrl: '' });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const fetchGifts = async () => {
    try {
      const res = await fetch('/api/digital_gifts');
      const data = await res.json();
      setGifts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    if (!newItem.bankName || !newItem.accountNumber || !newItem.accountHolder) return;
    try {
      if (editingId) {
        await fetchWithAuth(`/api/digital_gifts/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
      } else {
        await fetchWithAuth('/api/digital_gifts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
      }
      setNewItem({ bankName: '', accountNumber: '', accountHolder: '', qrCodeUrl: '' });
      setEditingId(null);
      fetchGifts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus rekening ini?")) return;
    try {
      await fetchWithAuth(`/api/digital_gifts/${id}`, { method: 'DELETE' });
      fetchGifts();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="text-center p-8">Memuat Rekening...</div>;

  return (
    <div className="space-y-8 bg-white p-8 rounded-xl shadow-md border-t-4 border-gold">
      <div>
        <h2 className="text-2xl font-playfair text-dark-green mb-4 border-b pb-2">Kado Digital / Rekening Bank</h2>
        <p className="text-sm text-gray-500 mb-6">Tambahkan nomor rekening atau e-Wallet (BCA, Mandiri, OVO, Dana) untuk fitur "Kirim Ampao/Kado Digital".</p>
        
        {/* Form Tambah/Edit */}
        <form onSubmit={handleAddOrEdit} className="bg-gray-50 p-6 rounded-lg border border-gray-100 mb-8 space-y-4">
          <h3 className="font-semibold text-gray-700">{editingId ? 'Edit Rekening' : 'Tambah Rekening Baru'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nama Bank / E-Wallet</label>
              <input type="text" value={newItem.bankName} onChange={e => setNewItem({...newItem, bankName: e.target.value})} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none bg-white" placeholder="BCA / DANA / Mandiri" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nomor Rekening / No HP</label>
              <input type="text" value={newItem.accountNumber} onChange={e => setNewItem({...newItem, accountNumber: e.target.value})} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none bg-white" placeholder="1234567890" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Nama Pemilik Rekening (Atas Nama)</label>
              <input type="text" value={newItem.accountHolder} onChange={e => setNewItem({...newItem, accountHolder: e.target.value})} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none bg-white" placeholder="A.n. Nadia Salsabila" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">URL QR Code (Opsional) - Bisa Upload Gambar File</label>
              <div className="mb-2">
                 <ImageUploadAndCrop aspect={1} onUploadSuccess={(url) => setNewItem({...newItem, qrCodeUrl: url})} />
              </div>
              <input type="text" value={newItem.qrCodeUrl} onChange={e => setNewItem({...newItem, qrCodeUrl: e.target.value})} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none bg-white" placeholder="https://... atau gunakan Upload File di atas" />
            </div>
          </div>
          <div className="flex space-x-2 pt-2">
            <button type="submit" className="flex items-center space-x-2 bg-dark-green hover:bg-[#11261b] text-white px-4 py-2 rounded-md transition shadow text-sm">
              {editingId ? <><FaSave /> <span>Simpan Perubahan</span></> : <><FaPlus /> <span>Tambah Rekening</span></>}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setNewItem({ bankName: '', accountNumber: '', accountHolder: '', qrCodeUrl: '' }); }} className="flex items-center space-x-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition shadow text-sm">
                <FaTimes /> <span>Batal</span>
              </button>
            )}
          </div>
        </form>

        {/* List Rekening */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gifts.map(item => (
            <div key={item.id} className="relative group bg-gray-50 border border-gray-200 p-5 rounded-lg flex flex-col justify-between">
              <div>
                <p className="font-bold text-dark-green">{item.bankName}</p>
                <p className="text-xl font-mono text-gray-800 tracking-wider my-1">{item.accountNumber}</p>
                <p className="text-sm text-gray-600 uppercase">{item.accountHolder}</p>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingId(item.id); setNewItem({ bankName: item.bankName, accountNumber: item.accountNumber, accountHolder: item.accountHolder, qrCodeUrl: item.qrCodeUrl || '' }); }} className="text-blue-500 hover:text-blue-700 bg-white p-1 rounded-full shadow-sm">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 bg-white p-1 rounded-full shadow-sm">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          {gifts.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-8 italic text-sm">Belum ada Rekening/E-Wallet yang ditambahkan.</div>
          )}
        </div>
      </div>
    </div>
  );
}
