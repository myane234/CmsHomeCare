import { Routes, Route, Navigate } from 'react-router-dom';
import LoginAdminCms from './pages/LoginAdminCms';
// import LoginSuperAdmin from './pages/super-admin/loginAdmin';
import LoginSuperAdmin from './pages/LoginAdminCms';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import DataNakes from './pages/admin/DataNakes';
import PageLayanan from './pages/PageLayanan';
import PagePromo from './pages/PagePromo';
import FormTambah from './pages/FormTambah';
import FormEdit from './pages/FormEdit';
import PromoTambah from './pages/PromoTambah';
import PromoEdit from './pages/PromoEdit';
import PageArtikel from './pages/PageArtikel';
import FormTambahArtikel from './pages/FormTambahArtikel';
import FormEditArtikel from './pages/FormEditArtikel';
import PageNakesRequest from './pages/PageNakesRequest';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import KelolaAdmin from './pages/KelolaAdmin';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginAdminCms />} />
      <Route path="/super-admin/login" element={<LoginSuperAdmin />} />
      <Route path="/admindashboard" element={<Navigate to="/dashboard" replace />} />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/nakes" element={<DataNakes />} />
        <Route path="/admin/nakes/requests" element={<PageNakesRequest />} />
        <Route path="/layanan" element={<PageLayanan />} />
        <Route path="/promo" element={<PagePromo />} />
        <Route path="/promo/tambah" element={<PromoTambah />} />
        <Route path="/promo/:id_promo/edit" element={<PromoEdit />} />
        <Route path="/layanan/tambah" element={<FormTambah />} />
        <Route path="/layanan/:id/edit" element={<FormEdit />} />
        <Route path="/artikel" element={<PageArtikel />} />
        <Route path="/artikel/tambah" element={<FormTambahArtikel />} />
        <Route path="/artikel/:id/edit" element={<FormEditArtikel />} />
      </Route>

      {/* Super Admin only routes */}
      <Route
        element={
          <ProtectedRoute requiredRole="super_admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/kelola-admin" element={<KelolaAdmin />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;