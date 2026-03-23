# Undangan Digital Premium 💌

Aplikasi Undangan Digital full-stack yang modern, interaktif, dan premium. Dibangun menggunakan React (Vite) untuk frontend dan Express.js (SQLite) untuk backend, dilengkapi dengan animasi indah, fitur E-Ticket (QR Code), dukungan bilingual (ID/EN), serta kapabilitas Admin Dashboard yang sangat fungsional.

## ✨ Fitur Utama

### 1. Halaman Undangan Publik (Frontend)
- **Desain Premium Elegan:** Tata letak estetik dengan animasi *scroll* halus menggunakan `framer-motion` dan interaksi mikro layaknya undangan premium kelas atas.
- **Terproteksi dengan Amplop Sampul (Cover):** Halaman awal undangan mengunci gulir layar (*scroll-lock*) hingga tamu menekan "Buka Undangan", yang juga memicu rotasi *background music*.
- **Dukungan Multi-Bahasa (Bilingual):** Fitur *toggle* ID/EN instan yang menerjemahkan UI statis secara *real-time*.
- **Integrasi "Add to Calendar":** Undangan mendukung sinkronisasi ke Google Calendar milik tamu sekali klik.
- **RSVP Cerdas & E-Ticket QR Code:** Formulir kehadiran memunculkan pop-up keberhasilan dan otomatis memberikan E-Ticket unik (QR Code) jika tamu menyanggupi untuk hadir.
- **Kado Digital Cepat (Cashless):** Mudahkan transfer hadiah menggunakan UI modern berfitur penyalinan nomor rekening sekali ketuk.

### 2. Dashboard Admin & Keamanan Kuat (Backend)
- **Otentikasi Aman (JWT):** Tidak hanya terproteksi di klien, seluruh proses pengunggahan maupun pengeditan di API Backend kami di-*cover* oleh *JSON Web Token* middleware.
- **Scanner E-Ticket Langsung:** Layar admin menyediakan fitur `QR Scanner` kamera hidup untuk memvalidasi *QR Code* E-Ticket dari gawai tamu di meja resepsionis (*check-in*).
- **Tema Kostumisasi Instan (Theme Customizer):** Ubah palet warna (*Gold, Dark Green, Cream, Rose*) langsung dari *Admin Editor* tanpa harus merombak kode. Menggunakan injeksi CSS Variables, sehingga pratinjau instan (*live preview*).
- **Manajemen Tabel Tamu Modern:** Ekspor data kehadiran ke berkas CSV. Mudah dalam penyortiran berkat kotak Pencarian (Search), Filter by Status, dan Paginasi.

## 🛠 Tech Stack

**Frontend:**
- **Framework:** React.js dengan Vite
- **Styling:** Tailwind CSS (dengan dukungan CSS Variables tema dinamis)
- **Animasi:** Framer Motion
- **Sistem Route:** React Router DOM
- **Interaksi Utama:** `qrcode.react`, `@yudiel/react-qr-scanner`, `react-easy-crop`, `react-icons`

**Backend:**
- **Server:** Node.js, Express.js (dengan konfigurasi CORS penuh ke frontend)
- **Database:** SQLite3 (`better-sqlite3`)
- **ORM:** Drizzle ORM
- **Proteksi API:** `jsonwebtoken` (Pembuatan & Validasi Token)
- **File Upload:** Multer

## 📂 Struktur Direktori Penting

```text
Undangan-Digital/
├── server/
│   ├── db/                 # Skema Drizzle ORM (schema.js) & DB File Logik
│   ├── index.js            # Inti RestAPI (App Server, Middleware Auth JWT, Multer)
│   └── uploads/            # Direktori fisik untuk foto cover / galeri yang di-upload
├── src/
│   ├── components/         # Komponen Modular (Countdown, AdminTabs, RSVP, GuestBook)
│   ├── data/               # Store Logika Eksternal (API Client guestStore.js, configStore.js)
│   ├── pages/              # Halaman Induk Visual (InvitationPage, AdminDashboard, AdminEditor, dll.)
│   ├── utils/              # Alat Bantu (apiAuth.js, LanguageContext.jsx, translations.js)
│   ├── App.jsx             # Penghubung React Router Dom
│   └── main.jsx            # Index Vite React
├── tailwind.config.js      # Konfigurasi Tema Utama (berbasis Var)
└── package.json            # Daftar script ('dev') & Dependensi
```

## 🚀 Instalasi & Penjalankan Lokal

### 1. Konfigurasi Awal
Buka terminal Anda di repositori yang ini. Lalu, instal dependensi NPM untuk kedua lingkungan (*frontend* & *backend* dijalankan bersama).
```bash
npm install
```

### 2. Variabel Lingkungan (Opsional)
Jika ingin meng-*override* konfigurasi keamanan otomatis, silakan buat file `.env` di struktur utama dengan format:
```env
PORT=3001
ADMIN_PASSWORD=rahasia123
JWT_SECRET=token_rahasia_saya_123
```
*(Bila tidak ada `.env`, sandi masuk Admin bawaan adalah `admin123` dengan JWT statis bawaan).*

### 3. Eksekusi `Concurrent` Server
Gunakan *script* tunggal yang akan otomatis menyalakan server lokal Vite frontend dan Express backend secara asinkronus (bersamaan):
```bash
npm run dev
```

Akses yang terbuka:
- **Tampilan Undangan Utama:** `http://localhost:5173/`
- **Dashboard Admin:** `http://localhost:5173/admin`
- **Tautan Tamu Khusus:** `http://localhost:5173/?to=Nama+Tamu` (Untuk menampilkan 'Kepada Yth. Nama Tamu' pada *Cover*)
- **Endpoint API (Backend):** `http://localhost:3001/api/...`

## 🔐 Panduan Menggunakan Panel Admin
1. Pergi ke halaman `http://localhost:5173/admin`.
2. Masukkan kata sandi (Default: `admin123`).
3. Tekan **Scan E-Ticket** pada **Admin Dashboard** jika Anda sedang berada di pos satpam/resepsionis pernikahan untuk memindai kedatangan masuk tamu Anda secara otomatis (Akan memakan izin kamera perangkat Anda).
4. Tekan **Editor Konten** dan klik salah satu tab di sana (*Utama, Galeri, Cerita Cinta, Kado Digital*) guna memodifikasi konten secara leluasa tanpa risiko kebocoran data.

---
Dikembangkan dengan ❤️. Semoga acara pernikahannya berjalan lancar!
