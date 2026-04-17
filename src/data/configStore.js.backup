import { fetchWithAuth } from '../utils/apiAuth';

const API_URL = '/api/config';
// Force Vite HMR reload


const defaultConfig = {
  brideShort: 'Yanti',
  groomShort: 'Sofian',
  brideFull: 'Haryanti',
  groomFull: 'Sofian Hadi',
  parentBride: 'Bapak Fulan & Ibu Fulanah',
  parentGroom: 'Bapak Alan & Ibu Alana',
  igBride: '@instagram_nadia',
  igGroom: '@instagram_farras',
  weddingDate: '2026-12-12T09:00:00',
  dateString: 'Sabtu, 12 Desember 2026',
  timeZone: 'WIB',
  akadTime: 'Pukul 08.00 - Selesai',
  akadLocation: 'Masjid Agung Sunda Kelapa',
  akadAddress: 'Jl. Taman Sunda Kelapa No.16, Menteng, Jakarta Pusat',
  resepsiTime: 'Pukul 11.00 - 14.00',
  resepsiLocation: 'Aula Masjid Agung Sunda Kelapa',
  resepsiAddress: 'Jl. Taman Sunda Kelapa No.16, Menteng, Jakarta Pusat',
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5204482062327!2d106.83020617513511!3d-6.200188660447379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f417f54c5dc3%3A0xe5f8661df6ee4f82!2sMasjid%20Agung%20Sunda%20Kelapa!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid',
  musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  themeGold: '#C9A84C',
  themeDarkGreen: '#1A3A2A',
  themeCream: '#FDF6EC',
  themeRose: '#B76E79',
};

export const applyTheme = (configData) => {
  if (!configData) return;
  if (configData.themeGold) document.documentElement.style.setProperty('--color-gold', configData.themeGold);
  if (configData.themeDarkGreen) document.documentElement.style.setProperty('--color-dark-green', configData.themeDarkGreen);
  if (configData.themeCream) document.documentElement.style.setProperty('--color-cream', configData.themeCream);
  if (configData.themeRose) document.documentElement.style.setProperty('--color-rose', configData.themeRose);
};

// We need an async function now, but since we had `getConfig()` as sync before,
// we will fetch and return correctly. However, we'll fetch asynchronously.
let cachedConfig = null;

export const fetchConfig = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) return defaultConfig;
    const data = await res.json();
    if (Object.keys(data).length === 0) return defaultConfig;
    cachedConfig = { ...defaultConfig, ...data };
    applyTheme(cachedConfig);
    return cachedConfig;
  } catch (e) {
    console.error("Failed to fetch config:", e);
    return defaultConfig;
  }
};

export const getConfig = () => {
  return cachedConfig || defaultConfig;
};

export const saveConfig = async (newConfig) => {
  try {
    const res = await fetchWithAuth(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newConfig)
    });
    if (res.ok) {
      cachedConfig = { ...defaultConfig, ...newConfig };
      applyTheme(cachedConfig);
    }
  } catch(e) {
    console.error("Failed to save config:", e);
  }
};
