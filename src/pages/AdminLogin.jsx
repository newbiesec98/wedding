import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('adminToken', data.token);
        sessionStorage.setItem('isAdmin', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Password salah!');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('/assets/pattern.png')] bg-opacity-10 bg-blend-multiply">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border-2 border-gold/20">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center text-gold mb-4">
            <FaLock size={20} />
          </div>
          <h2 className="text-center text-3xl font-playfair font-bold text-dark-green">
            Admin Panel
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-poppins">
            Manajemen Daftar Tamu Undangan
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gold focus:border-gold focus:z-10 sm:text-sm font-poppins"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-poppins">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gold hover:bg-[#b09340] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition font-poppins"
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
