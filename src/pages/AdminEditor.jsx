import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchConfig, saveConfig, applyTheme } from '../data/configStore';
import { FaArrowLeft, FaCog, FaImages, FaHeart, FaGift } from 'react-icons/fa';

import ConfigTab from '../components/admin/ConfigTab';
import GalleryTab from '../components/admin/GalleryTab';
import LoveStoryTab from '../components/admin/LoveStoryTab';
import GiftTab from '../components/admin/GiftTab';

export default function AdminEditor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('config'); // 'config', 'gallery', 'story', 'gift'

  useEffect(() => {
    // Check auth
    if (!sessionStorage.getItem('isAdmin')) {
      navigate('/admin');
      return;
    }
    const loadData = async () => {
      const data = await fetchConfig();
      setFormData(data);
      setIsLoading(false);
    };
    loadData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    if (name.startsWith('theme')) {
      applyTheme(newFormData);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await saveConfig(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500 mt-20 font-poppins">Memuat konfigurasi...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-poppins pb-10">
      {/* Header */}
      <nav className="bg-white shadow z-10 sticky top-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/admin/dashboard')}
                className="text-gray-500 hover:text-gold transition"
              >
                <FaArrowLeft size={18} />
              </button>
              <h1 className="text-xl font-bold font-playfair text-dark-green">Editor Undangan</h1>
            </div>
            {isSaved && <span className="text-green-600 text-sm font-semibold animate-pulse">Disimpan! ✓</span>}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-8 px-4 sm:px-6">
        
        {/* Tabs Navigation */}
        <div className="flex space-x-2 border-b border-gray-200 mb-6 overflow-x-auto custom-scrollbar pb-2">
          <button 
            onClick={() => setActiveTab('config')}
            className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-t-lg transition ${activeTab === 'config' ? 'bg-gold text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gold'}`}
          >
            <FaCog /> <span>Utama</span>
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-t-lg transition ${activeTab === 'gallery' ? 'bg-gold text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gold'}`}
          >
            <FaImages /> <span>Galeri Foto</span>
          </button>
          <button 
            onClick={() => setActiveTab('story')}
            className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-t-lg transition ${activeTab === 'story' ? 'bg-gold text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gold'}`}
          >
            <FaHeart /> <span>Cerita Cinta</span>
          </button>
          <button 
            onClick={() => setActiveTab('gift')}
            className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-t-lg transition ${activeTab === 'gift' ? 'bg-gold text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gold'}`}
          >
            <FaGift /> <span>Kado Digital</span>
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'config' && (
            <ConfigTab 
              formData={formData} 
              handleChange={handleChange} 
              handleSave={handleSave} 
              isSaved={isSaved} 
            />
          )}
          {activeTab === 'gallery' && <GalleryTab />}
          {activeTab === 'story' && <LoveStoryTab />}
          {activeTab === 'gift' && <GiftTab />}
        </div>
      </main>
    </div>
  );
}
