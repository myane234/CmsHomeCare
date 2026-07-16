import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllLayanan, deleteLayanan } from '../data/layananData';
import './PageLayanan.css';

export default function PageLayanan() {
  const [layanan, setLayanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function loadData() {
    setLoading(true);
    getAllLayanan().then((data) => {
      setLayanan(data);
      setLoading(false);
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = layanan.filter((item) =>
    (item.nama + item.kategori).toLowerCase().includes(search.toLowerCase())
  );

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await deleteLayanan(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    loadData();
  }

  return (
    <div className="layanan-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Layanan</h1>
          <p className="page-subtitle">Kelola semua layanan HomeCare di sini</p>
        </div>
        <Link to="/layanan/tambah" className="btn btn-primary">
          + Tambah Layanan
        </Link>
      </div>

      <div className="layanan-toolbar">
        <input
          type="text"
          placeholder="Cari nama atau kategori layanan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input layanan-search"
        />
      </div>

      <div className="layanan-table-wrapper">
        {loading ? (
          <p className="empty-state">Memuat data...</p>
        ) : filtered.length === 0 ? (
          <p className="empty-state">Tidak ada layanan ditemukan.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama Layanan</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Durasi</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.nama}</td>
                  <td>{item.kategori}</td>
                  <td>Rp {Number(item.harga).toLocaleString('id-ID')}</td>
                  <td>{item.durasi} menit</td>
                  <td>
                    <span className={`badge badge-${item.status}`}>
                      {item.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/layanan/${item.id}/edit`} className="btn btn-outline btn-sm">
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteTarget(item)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Hapus Layanan?</h3>
            <p>
              Yakin ingin menghapus <strong>{deleteTarget.nama}</strong>? Tindakan ini
              tidak dapat dibatalkan.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-outline"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Batal
              </button>
              <button className="btn btn-danger" onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
