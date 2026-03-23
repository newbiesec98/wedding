import React from 'react';
import { FaSave } from 'react-icons/fa';
import ImageUploadAndCrop from './ImageUploadAndCrop';

export default function ConfigTab({ formData, handleChange, handleSave, isSaved }) {
  return (
    <form onSubmit={handleSave} className="space-y-8 bg-white p-8 rounded-xl shadow-md border-t-4 border-gold">
      {/* Mempelai */}
      <div>
        <h2 className="text-2xl font-playfair text-dark-green mb-4 border-b pb-2">Data Mempelai</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wanita */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 className="font-semibold text-gray-700">Mempelai Wanita</h3>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nama Panggilan</label>
              <input type="text" name="brideShort" value={formData.brideShort || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nama Lengkap</label>
              <input type="text" name="brideFull" value={formData.brideFull || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nama Orang Tua</label>
              <input type="text" name="parentBride" value={formData.parentBride || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none" required />
            </div>
            <div>
                <label className="block text-sm text-gray-600 mb-1">Username IG</label>
                <input type="text" name="igBride" value={formData.igBride || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Foto Mempelai Wanita - Upload File</label>
              <div className="mb-2">
                 <ImageUploadAndCrop aspect={3/4} onUploadSuccess={(url) => handleChange({ target: { name: 'bridePhoto', value: url } })} />
              </div>
              <input type="text" name="bridePhoto" value={formData.bridePhoto || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm bg-white focus:ring-gold focus:border-gold outline-none placeholder-gray-300" placeholder="https://... atau gunakan Upload File" />
            </div>
          </div>

          {/* Pria */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 className="font-semibold text-gray-700">Mempelai Pria</h3>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nama Panggilan</label>
              <input type="text" name="groomShort" value={formData.groomShort || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nama Lengkap</label>
              <input type="text" name="groomFull" value={formData.groomFull || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nama Orang Tua</label>
              <input type="text" name="parentGroom" value={formData.parentGroom || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none" required />
            </div>
            <div>
                <label className="block text-sm text-gray-600 mb-1">Username IG</label>
                <input type="text" name="igGroom" value={formData.igGroom || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Foto Mempelai Pria - Upload File</label>
               <div className="mb-2">
                 <ImageUploadAndCrop aspect={3/4} onUploadSuccess={(url) => handleChange({ target: { name: 'groomPhoto', value: url } })} />
              </div>
              <input type="text" name="groomPhoto" value={formData.groomPhoto || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm bg-white focus:ring-gold focus:border-gold outline-none placeholder-gray-300" placeholder="https://... atau gunakan Upload File" />
            </div>
          </div>
        </div>
      </div>

      {/* Tampilan Umum */}
      <div>
        <h2 className="text-2xl font-playfair text-dark-green mb-4 border-b pb-2 mt-8">Tampilan Utama (Cover & Quote)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Foto Latar Belakang Cover (Hero) - Upload File</label>
            <div className="mb-2">
                 <ImageUploadAndCrop aspect={9/16} onUploadSuccess={(url) => handleChange({ target: { name: 'coverImage', value: url } })} />
            </div>
            <input type="text" name="coverImage" value={formData.coverImage || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm bg-white focus:ring-gold focus:border-gold outline-none" placeholder="https://... atau gunakan Upload File" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Ayat / Kutipan Kitab Suci</label>
            <textarea name="heroQuranVerse" value={formData.heroQuranVerse || ''} onChange={handleChange} rows="3" className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none" placeholder="Tulisan Arab / Ayat" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Terjemahan Kutipan</label>
            <textarea name="heroQuote" value={formData.heroQuote || ''} onChange={handleChange} rows="2" className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none" placeholder="Artinya..." />
          </div>
        </div>
      </div>

      {/* Tema Visual */}
      <div>
        <h2 className="text-2xl font-playfair text-dark-green mb-4 border-b pb-2 mt-8">Tema & Warna</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Aksen Emas (Gold)</label>
            <div className="flex space-x-2">
              <input type="color" name="themeGold" value={formData.themeGold || '#C9A84C'} onChange={handleChange} className="h-10 w-8 border rounded cursor-pointer p-0" />
              <input type="text" name="themeGold" value={formData.themeGold || '#C9A84C'} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold outline-none uppercase font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Hijau Gelap (Primer)</label>
            <div className="flex space-x-2">
              <input type="color" name="themeDarkGreen" value={formData.themeDarkGreen || '#1A3A2A'} onChange={handleChange} className="h-10 w-8 border rounded cursor-pointer p-0" />
              <input type="text" name="themeDarkGreen" value={formData.themeDarkGreen || '#1A3A2A'} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold outline-none uppercase font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Latar Utama (Cream)</label>
            <div className="flex space-x-2">
              <input type="color" name="themeCream" value={formData.themeCream || '#FDF6EC'} onChange={handleChange} className="h-10 w-8 border rounded cursor-pointer p-0" />
              <input type="text" name="themeCream" value={formData.themeCream || '#FDF6EC'} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold outline-none uppercase font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Aksen (Rose)</label>
            <div className="flex space-x-2">
              <input type="color" name="themeRose" value={formData.themeRose || '#B76E79'} onChange={handleChange} className="h-10 w-8 border rounded cursor-pointer p-0" />
              <input type="text" name="themeRose" value={formData.themeRose || '#B76E79'} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold outline-none uppercase font-mono" />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 italic">*Perubahan warna akan langsung terlihat (preview) untuk Anda sebelum disimpan.</p>
      </div>

      {/* Waktu & Lokasi */}
      <div>
        <h2 className="text-2xl font-playfair text-dark-green mb-4 border-b pb-2 mt-8">Detail Acara & Lokasi</h2>
        
        <div className="mb-6 bg-gold/10 p-4 rounded-lg border border-gold/30">
          <label className="block text-sm font-semibold text-dark-green mb-2">Tipe Penyelenggaraan Acara</label>
          <select name="eventMode" value={formData.eventMode || 'same_day'} onChange={handleChange} className="w-full border p-2 rounded-md bg-white focus:ring-gold outline-none text-sm">
            <option value="same_day">Akad Nikah & Resepsi (Hari yang Sama)</option>
            <option value="akad_only">Akad Nikah Saja</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tanggal Acara (Date Picker) & Waktu Hitung Mundur</label>
              <input type="datetime-local" name="weddingDate" value={formData.weddingDate || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none bg-white" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Teks Tanggal Utama (Untuk Tampilan)</label>
              <input type="text" name="dateString" value={formData.dateString || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none" placeholder="Sabtu, 12 Desember 2026" required />
            </div>
        </div>

        <div className={`grid grid-cols-1 ${formData.eventMode === 'akad_only' ? '' : 'md:grid-cols-2'} gap-6 mt-6`}>
          {/* Akad */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 className="font-semibold text-gray-700">Akad Nikah</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Pukul Mulai</label>
                <input type="time" name="akadTimeStart" value={formData.akadTimeStart || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold outline-none bg-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Pukul Selesai</label>
                <input type="time" name="akadTimeEnd" value={formData.akadTimeEnd || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold outline-none bg-white" />
                <p className="text-[10px] text-gray-400 mt-1">Atau biarkan kosong untuk "Selesai"</p>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nama Tempat</label>
              <input type="text" name="akadLocation" value={formData.akadLocation || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Alamat Lengkap</label>
              <textarea name="akadAddress" value={formData.akadAddress || ''} onChange={handleChange} rows="2" className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none resize-none" />
            </div>
          </div>

          {/* Resepsi (Hanya Tampil Jika Bukan "Akad Saja") */}
          {formData.eventMode !== 'akad_only' && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-gray-700">Resepsi</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Pukul Mulai</label>
                  <input type="time" name="resepsiTimeStart" value={formData.resepsiTimeStart || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold outline-none bg-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Pukul Selesai</label>
                  <input type="time" name="resepsiTimeEnd" value={formData.resepsiTimeEnd || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold outline-none bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nama Tempat</label>
                <input type="text" name="resepsiLocation" value={formData.resepsiLocation || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Alamat Lengkap</label>
                <textarea name="resepsiAddress" value={formData.resepsiAddress || ''} onChange={handleChange} rows="2" className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none resize-none" />
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-600 mb-1">Google Maps Iframe URL</label>
          <textarea name="mapUrl" value={formData.mapUrl || ''} onChange={handleChange} rows="3" className="w-full border rounded-md p-2 text-sm text-gray-500 font-mono focus:ring-gold focus:border-gold outline-none resize-none" />
          <p className="text-xs text-gray-400 mt-1">Copy "src" url from Google Maps Embed</p>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm text-gray-600 mb-1">URL Musik Latar (MP3)</label>
          <input type="text" name="musicUrl" value={formData.musicUrl || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none" />
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-600 mb-1">URL Live Streaming (YouTube/Zoom)</label>
          <input type="text" name="liveStreamUrl" value={formData.liveStreamUrl || ''} onChange={handleChange} className="w-full border rounded-md p-2 text-sm focus:ring-gold focus:border-gold outline-none" placeholder="https://youtube.com/..." />
        </div>
      </div>

      <div className="pt-6 border-t flex items-center justify-between">
        {isSaved && <span className="text-green-600 font-semibold animate-pulse">Berhasil disimpan!</span>}
        <button 
          type="submit"
          className="flex items-center space-x-2 bg-gold hover:bg-[#b09340] text-white px-8 py-3 rounded-lg font-medium transition shadow-lg transform hover:-translate-y-1 ml-auto"
        >
          <FaSave size={18} /> <span>Simpan Perubahan</span>
        </button>
      </div>
    </form>
  )
}
