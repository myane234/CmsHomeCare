
import { Link } from 'react-router-dom';
import { getSession } from '../../utils/auth';
import { FaUserMd, FaUserCheck, FaClock, FaTimesCircle } from 'react-icons/fa';

const nakesData = [
  { id: 1, nama: 'Dr. Anisa Rahma', jenis: 'Pergantian Alat Medis', nomor_str: 'STR-2024001', lulusan: 'Poltekkes Kemenkes Jakarta', tanggal: '2026-01-15', status: 'Selesai' },
  { id: 2, nama: 'Siti Nurhaliza', jenis: 'Fisioterapi', nomor_str: 'STR-2024002', lulusan: 'Akademi Kebidanan Citra', tanggal: '2026-02-10', status: 'Pelatihan' },
  { id: 3, nama: 'Rizki Pratama', jenis: 'Fisioterapi', nomor_str: 'STR-2024003', lulusan: 'Universitas Brawijaya', tanggal: '2026-03-05', status: 'Pending' },
  { id: 4, nama: 'Dewi Sartika', jenis: 'Baby Nurse', nomor_str: 'STR-2024004', lulusan: 'STIKES Harapan Bangsa', tanggal: '2026-04-18', status: 'Selesai' },
  { id: 5, nama: 'Muhammad Farid', jenis: 'Baby Nurse', nomor_str: 'STR-2024005', lulusan: 'Poltekkes Kemenkes Surabaya', tanggal: '2026-05-22', status: 'Pelatihan' },
];

export default function AdminDashboard() {
  const session = getSession();
  const totalNakes = nakesData.length;
  const selesaiCount = nakesData.filter((item) => item.status === 'Selesai').length;
  const pendingCount = nakesData.filter((item) => item.status === 'Pending').length;
  const pelatihanCount = nakesData.filter((item) => item.status === 'Pelatihan').length;

  const summaryCards = [
    { label: 'Total Nakes', value: totalNakes, icon: <FaUserMd />, bg: 'bg-blue-100', color: 'text-blue-600' },
    { label: 'Nakes Selesai', value: selesaiCount, icon: <FaUserCheck />, bg: 'bg-emerald-100', color: 'text-emerald-600' },
    { label: 'Request Pending', value: pendingCount, icon: <FaClock />, bg: 'bg-amber-100', color: 'text-amber-600' },
    { label: 'Sedang Pelatihan', value: pelatihanCount, icon: <FaTimesCircle />, bg: 'bg-blue-100', color: 'text-blue-700' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Dashboard Admin</h1>
        <p className="page-subtitle">Kelola data tenaga medis SmartHomeCare.</p>
        <p className="mt-2 text-sm text-slate-500">
          Selamat datang kembali, {session?.name || 'Admin'} 👋
        </p>
      </div>

      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div className="card flex items-center gap-3.5 p-5" key={card.label}>
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${card.bg} text-xl ${card.color}`}>
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
          <h2 className="text-base font-bold">Nakes Terbaru</h2>
          <Link to="/admin/nakes" className="btn-outline">
            Lihat Semua
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-125 border-collapse">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Nama</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Jenis Nakes</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Tanggal Bergabung</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {nakesData.slice(0, 5).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="border-b border-slate-200 px-4 py-3 text-sm">{item.nama}</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm">{item.jenis}</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm">{item.tanggal}</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm">
                    <span className={`badge ${item.status === 'Selesai' ? 'badge-aktif' : item.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
