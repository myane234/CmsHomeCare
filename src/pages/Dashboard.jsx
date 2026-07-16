import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllLayanan } from '../data/layananData';
import { getSession } from '../utils/auth';

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
    { label: 'Total Layanan', value: totalLayanan, icon: '🩺' },
    { label: 'Layanan Aktif', value: totalAktif, icon: '✅' },
    { label: 'Layanan Nonaktif', value: totalNonaktif, icon: '⏸️' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Selamat datang kembali, {session?.name || 'Admin'} 👋
        </p>
      </div>

      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <div className="card flex items-center gap-3.5 p-5" key={card.label}>
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light text-xl">
              {card.icon}
            </div>
            <div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-[13px] text-slate-500">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold">Layanan Terbaru</h2>
          <Link to="/layanan" className="btn-outline">
            Lihat Semua
          </Link>
        </div>

        {loading ? (
          <p className="p-10 text-center text-sm text-slate-500">Memuat data...</p>
        ) : layanan.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">Belum ada data layanan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Nama Layanan
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Kategori
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Harga
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {layanan.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="border-b border-slate-200 px-4 py-3.5 text-sm">{item.nama}</td>
                    <td className="border-b border-slate-200 px-4 py-3.5 text-sm">{item.kategori}</td>
                    <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                      Rp {Number(item.harga).toLocaleString('id-ID')}
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                      <span className={`badge badge-${item.status}`}>
                        {item.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
