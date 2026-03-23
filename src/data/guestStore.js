import { fetchWithAuth } from '../utils/apiAuth';

const API_URL = '/api/guests';

export const getGuests = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch guests:", e);
    return [];
  }
};

export const addGuest = async (guestData) => {
  const newGuest = {
    name: guestData.name,
    message: guestData.message,
    timestamp: new Date().toISOString()
  };
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newGuest)
  });
  return await res.json();
};

export const updateGuestStatus = async (id, status, guestsCount) => {
  const res = await fetchWithAuth(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, guestsCount })
  });
  return await res.json();
};

export const deleteGuest = async (id) => {
  const res = await fetchWithAuth(`${API_URL}/${id}`, { method: 'DELETE' });
  return res.ok;
};

// RSVP Form specific handler
export const submitRSVP = async (data) => {
  const guests = await getGuests();
  // Find guest by name (case insensitive)
  const existing = guests.find(g => g.name.toLowerCase() === data.name.toLowerCase());
  
  if (existing) {
    return await fetch(`${API_URL}/${existing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: existing.name, 
        status: data.status, 
        guestsCount: data.guestsCount,
        message: existing.message || data.message
      })
    }).then(res => res.json());
  } else {
    // Treat as new guest RSVP
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        status: data.status,
        guestsCount: data.guestsCount,
        message: data.message || '',
        timestamp: new Date().toISOString()
      })
    });
    return await res.json();
  }
};

export const exportToCSV = async () => {
  const guests = await getGuests();
  if (guests.length === 0) return alert("Belum ada data tamu.");

  const headers = ["ID", "Nama", "Status RSVP", "Jumlah Hadir", "Pesan", "Waktu"];
  
  const csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(",") + "\n"
    + guests.map(e => [
        e.id,
        `"${e.name || ''}"`,
        `"${e.status || 'Belum RSVP'}"`,
        e.guestsCount || 0,
        `"${(e.message || '').replace(/"/g, '""')}"`,
        `"${e.timestamp || ''}"`
      ].join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "data_tamu_undangan.csv");
  document.body.appendChild(link);
  link.click();
  document.body.appendChild(link);
};
