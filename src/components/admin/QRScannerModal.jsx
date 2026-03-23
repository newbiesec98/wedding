import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function QRScannerModal({ onClose, onScanSuccess }) {
  const [scanResult, setScanResult] = useState(null);

  const handleScan = (result) => {
    if (result && result.length > 0) {
      try {
        const data = JSON.parse(result[0].rawValue);
        if (data.id && data.name) {
          setScanResult({ success: true, data });
          if (onScanSuccess) onScanSuccess(data);
        } else {
          setScanResult({ success: false, error: 'QR Code tidak valid atau bukan E-Ticket undangan.' });
        }
      } catch (e) {
        setScanResult({ success: false, error: 'Format QR Code salah.' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
          <FaTimes size={24} />
        </button>
        
        <h3 className="text-2xl font-playfair text-dark-green mb-6 text-center border-b pb-4 border-gold/20">
          Scan E-Ticket
        </h3>

        {!scanResult ? (
          <div className="rounded-xl overflow-hidden border-4 border-gold/40 mb-6 relative">
            <Scanner onScan={handleScan} onError={(e) => console.log(e)} components={{ audio: false }} />
            <div className="absolute bottom-0 w-full bg-black/50 text-white text-center py-2 text-sm font-poppins">Arahkan kamera ke QR Code Tamu</div>
          </div>
        ) : (
          <div className="text-center py-8">
            {scanResult.success ? (
              <div className="flex flex-col items-center animate-pulse">
                <FaCheckCircle className="text-green-500 text-6xl mb-4" />
                <h4 className="text-xl font-bold font-playfair text-dark-green mb-2">Tiket Valid!</h4>
                <p className="font-poppins font-bold text-gray-800 text-lg">{scanResult.data.name}</p>
                <p className="font-poppins text-sm text-gray-500 bg-green-50 py-1 px-4 rounded-full mt-2 border border-green-200">Jumlah Tamu: {scanResult.data.guestsCount} Orang</p>
                <button onClick={() => setScanResult(null)} className="mt-8 px-6 py-2 bg-dark-green text-white rounded-full font-poppins text-sm hover:bg-[#11261b]">Scan Tiket Lain</button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
                <h4 className="text-xl font-bold font-playfair text-red-600 mb-2">Tiket Tidak Valid</h4>
                <p className="font-poppins text-sm text-gray-500">{scanResult.error}</p>
                <button onClick={() => setScanResult(null)} className="mt-8 px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-poppins text-sm hover:bg-gray-300">Coba Lagi</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
