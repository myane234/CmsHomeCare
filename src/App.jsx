import { Routes, Route, Navigate } from 'react-router-dom';
import LoginAdminCms from './pages/LoginAdminCms';
import Dashboard from './pages/Dashboard';
import PageLayanan from './pages/PageLayanan';
import FormTambah from './pages/FormTambah';
import FormEdit from './pages/FormEdit';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginAdminCms />} />

      {/* Protected admin routes, all wrapped in AdminLayout (sidebar + topbar) */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/layanan" element={<PageLayanan />} />
        <Route path="/layanan/tambah" element={<FormTambah />} />
        <Route path="/layanan/:id/edit" element={<FormEdit />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
