import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './utils/LanguageContext';

const InvitationPage = lazy(() => import('./pages/InvitationPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminEditor = lazy(() => import('./pages/AdminEditor'));

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-cream">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold text-gold"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<InvitationPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/editor" element={<AdminEditor />} />
          </Routes>
        </Suspense>
      </Router>
    </LanguageProvider>
  );
}

export default App;
