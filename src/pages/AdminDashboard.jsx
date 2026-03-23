import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGuests, addGuest, deleteGuest, exportToCSV } from '../data/guestStore';
import { getConfig } from '../data/configStore';
import { FaTrash as FaTrashSolid, FaCopy as FaCopySolid, FaDownload as FaDownloadSolid, FaSignOutAlt as FaSignOutAltSolid, FaPlus as FaPlusSolid, FaWhatsapp, FaQrcode } from 'react-icons/fa';
import QRScannerModal from '../components/admin/QRScannerModal';

export default function AdminDashboard() {
  const [guests, setGuests] = useState([]);
  const [newGuestName, setNewGuestName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth
    if (!sessionStorage.getItem('isAdmin')) {
      navigate('/admin');
      return;
    }
    loadGuests();
  }, [navigate]);

  const loadGuests = async () => {
    const data = await getGuests();
    setGuests(data);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    if (newGuestName.trim() === '') return;
    
    await addGuest({ name: newGuestName, status: '-', rsvpStatus: false, message: '' });
    setNewGuestName('');
    setIsModalOpen(false);
    loadGuests();
  };

  const copyLink = (name) => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/?to=${encodeURIComponent(name)}`;
    navigator.clipboard.writeText(url)
      .then(() => alert(`Link untuk ${name} disalin!`));
  };

  const shareWhatsApp = async (name) => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/?to=${encodeURIComponent(name)}`;
    const config = await import('../data/configStore').then(m => m.fetchConfig());
    
    const message = `Assalamu'alaikum Warahmatullahi Wabarakatuh.

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *${name}* untuk menghadiri acara pernikahan kami:
*${config.brideShort} & ${config.groomShort}*

Berikut link undangan untuk info lengkap mengenai acara serta konfirmasi kehadiran:
${url}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di acara pernikahan kami.
Terima kasih.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus tamu ini?')) {
      await deleteGuest(id);
      loadGuests();
    }
  };

  // Stats
  const totalGuests = guests.length;
  const hadirCount = guests.filter(g => g.status === 'hadir').length;
  const tidakHadirCount = guests.filter(g => g.status === 'tidak').length;

  const filteredGuests = guests.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase());
    const filterState = 
      filterStatus === 'all' ? true :
      filterStatus === 'hadir' ? g.status === 'hadir' :
      filterStatus === 'tidak' ? g.status === 'tidak' :
      (g.status !== 'hadir' && g.status !== 'tidak');
    return matchesSearch && filterState;
  });

  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / itemsPerPage));
  const paginatedGuests = filteredGuests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold font-playfair text-dark-green">Dashboard Undangan Admin</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition"
              >
                <FaSignOutAltSolid />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8 px-4 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Tamu</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalGuests}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Hadir</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">{hadirCount}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Tidak Hadir</dt>
              <dd className="mt-1 text-3xl font-semibold text-red-600">{tidakHadirCount}</dd>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 px-4 sm:px-0 gap-4">
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-gold hover:bg-[#b09340] text-white px-4 py-2 rounded-md transition shadow"
            >
              <FaPlusSolid /> <span>Tambah Tamu</span>
            </button>
            <button 
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition shadow"
            >
              <FaQrcode /> <span>Scan E-Ticket</span>
            </button>
            <button 
              onClick={exportToCSV}
              className="flex items-center space-x-2 bg-dark-green hover:bg-[#11261b] text-white px-4 py-2 rounded-md transition shadow hidden sm:flex"
            >
              <FaDownloadSolid /> <span>Export CSV</span>
            </button>
          </div>
          <button 
            onClick={() => navigate('/admin/editor')}
            className="flex items-center justify-center space-x-2 bg-white border border-gold hover:bg-gold/10 text-gold px-4 py-2 rounded-md transition shadow font-medium"
          >
            <span>Editor Konten</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between mb-4 px-4 sm:px-0 gap-4">
          <input 
            type="text" 
            placeholder="Cari nama tamu..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-xs border border-gray-300 rounded-md p-2 focus:ring-gold focus:border-gold outline-none font-poppins text-sm"
          />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:max-w-[200px] border border-gray-300 rounded-md p-2 focus:ring-gold outline-none font-poppins text-sm"
          >
            <option value="all">Semua Status</option>
            <option value="hadir">Hadir</option>
            <option value="tidak">Tidak Hadir</option>
            <option value="pending">Belum Konfirmasi</option>
          </select>
        </div>

        {/* Guest List Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama / Pesan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status RSVP</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedGuests.map((guest) => (
                  <tr key={guest.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                      <div className="text-sm text-gray-500 italic truncate max-w-xs">{guest.message || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${guest.status === 'hadir' ? 'bg-green-100 text-green-800' : 
                          guest.status === 'tidak' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                        {guest.status === 'hadir' ? `Hadir (${guest.count || 1} org)` : guest.status === 'tidak' ? 'Tidak Hadir' : 'Belum Konfirmasi'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex space-x-3">
                      <button onClick={() => shareWhatsApp(guest.name)} className="text-green-500 hover:text-green-700" title="Kirim via WhatsApp">
                        <FaWhatsapp size={18} />
                      </button>
                      <button onClick={() => copyLink(guest.name)} className="text-gold hover:text-yellow-600" title="Copy Link Undangan">
                        <FaCopySolid size={18} />
                      </button>
                      <button onClick={() => handleDelete(guest.id)} className="text-red-500 hover:text-red-700" title="Hapus">
                        <FaTrashSolid size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedGuests.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">Belum ada data tamu.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 mb-8 px-4 sm:px-0">
            <span className="text-sm text-gray-500">Halaman {currentPage} dari {totalPages} ({filteredGuests.length} Data)</span>
            <div className="flex space-x-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition text-sm font-medium"
              >
                Sebelumnya
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition text-sm font-medium"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
               <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Tambah Tamu Undangan</h3>
               <form onSubmit={handleAddGuest} className="mt-4">
                 <input 
                   type="text" 
                   value={newGuestName}
                   onChange={(e) => setNewGuestName(e.target.value)}
                   className="shadow-sm focus:ring-gold focus:border-gold block w-full sm:text-sm border-gray-300 rounded-md p-2 border" 
                   placeholder="Nama Tamu (mis: Bp. Budi & Keluarga)"
                   required
                 />
                 <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                   <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gold text-base font-medium text-white hover:bg-[#b09340] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold sm:ml-3 sm:w-auto sm:text-sm">
                     Simpan
                   </button>
                   <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold sm:mt-0 sm:w-auto sm:text-sm">
                     Batal
                   </button>
                 </div>
               </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {isScannerOpen && (
        <QRScannerModal 
          onClose={() => setIsScannerOpen(false)} 
          onScanSuccess={(data) => {
            // Optional: You could update the guest status in the DB automatically here
            // e.g: await fetchWithAuth(`/api/guests/${data.id}`, { method: 'PUT', ... })
            console.log('Scanned check-in:', data);
          }} 
        />
      )}
    </div>
  );
}
