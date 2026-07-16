import { Routes, Route, Navigate } from 'react-router-dom';
import LoginAdminCms from './pages/LoginAdminCms';
import Dashboard from './pages/Dashboard';
import PageLayanan from './pages/PageLayanan';
import FormTambah from './pages/FormTambah';
import FormEdit from './pages/FormEdit';

// IMPORT BARU
import PageArtikel from './pages/PageArtikel';
import FormTambahArtikel from './pages/FormTambahArtikel';
import FormEditArtikel from './pages/FormEditArtikel';

import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginAdminCms />} />

      {/* Protected admin routes */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Layanan */}
        <Route path="/layanan" element={<PageLayanan />} />
        <Route path="/layanan/tambah" element={<FormTambah />} />
        <Route path="/layanan/:id/edit" element={<FormEdit />} />

        {/* Artikel */}
        <Route path="/artikel" element={<PageArtikel />} />
        <Route path="/artikel/tambah" element={<FormTambahArtikel />} />
        <Route path="/artikel/:id/edit" element={<FormEditArtikel />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
