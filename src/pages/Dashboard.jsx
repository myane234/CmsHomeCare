import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllLayanan } from '../data/layananData';
import { getSession } from '../utils/auth';
import './Dashboard.css';

export default function Dashboard() {
  const [layanan, setLayanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const session = getSession();

  useEffect(() => {
    getAllLayanan().then((data) => {
      setLayanan(data);
      setLoading(false);
    });
  }, []);

  const totalLayanan = layanan.length;
  const totalAktif = layanan.filter((l) => l.status === 'aktif').length;
  const totalNonaktif = layanan.filter((l) => l.status === 'nonaktif').length;

  const summaryCards = [
    { label: 'Total Layanan', value: totalLayanan, icon: '🩺', color: 'blue' },
    { label: 'Layanan Aktif', value: totalAktif, icon: '✅', color: 'green' },
    { label: 'Layanan Nonaktif', value: totalNonaktif, icon: '⏸️', color: 'gray' },
  ];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Selamat datang kembali, {session?.name || 'Admin'} 👋
          </p>
        </div>
      </div>

      <div className="summary-grid">
        {summaryCards.map((card) => (
          <div className={`summary-card summary-${card.color}`} key={card.label}>
            <div className="summary-icon">{card.icon}</div>
            <div>
              <div className="summary-value">{card.value}</div>
              <div className="summary-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-recent">
        <div className="dashboard-recent-header">
          <h2>Layanan Terbaru</h2>
          <Link to="/layanan" className="btn btn-outline">
            Lihat Semua
          </Link>
        </div>

        {loading ? (
          <p className="empty-state">Memuat data...</p>
        ) : layanan.length === 0 ? (
          <p className="empty-state">Belum ada data layanan.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama Layanan</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {layanan.slice(0, 5).map((item) => (
                <tr key={item.id}>
                  <td>{item.nama}</td>
                  <td>{item.kategori}</td>
                  <td>Rp {Number(item.harga).toLocaleString('id-ID')}</td>
                  <td>
                    <span className={`badge badge-${item.status}`}>
                      {item.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
