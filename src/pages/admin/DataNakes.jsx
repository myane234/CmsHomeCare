import { useState } from 'react';
import { FaSearch, FaUserMd } from 'react-icons/fa';

const nakesData = [
  { id: 1, foto: '👩‍⚕️', nama: 'Dr. Anisa Rahma', jenis: 'Perawat', nomorStr: 'STR-2024001', lulusan: 'Poltekkes Kemenkes Jakarta', status: 'Aktif' },
  { id: 2, foto: '👩', nama: 'Siti Nurhaliza', jenis: 'Bidan', nomorStr: 'STR-2024002', lulusan: 'Akademi Kebidanan Citra', status: 'Aktif' },
  { id: 3, foto: '🧑‍⚕️', nama: 'Rizki Pratama', jenis: 'Fisioterapis', nomorStr: 'STR-2024003', lulusan: 'Universitas Brawijaya', status: 'Pending' },
  { id: 4, foto: '👩‍🔬', nama: 'Dewi Sartika', jenis: 'Perawat', nomorStr: 'STR-2024004', lulusan: 'STIKES Harapan Bangsa', status: 'Ditolak' },
  { id: 5, foto: '🧑', nama: 'Muhammad Farid', jenis: 'Bidan', nomorStr: 'STR-2024005', lulusan: 'Poltekkes Kemenkes Surabaya', status: 'Aktif' },
];

const filterOptions = ['Semua', 'Perawat', 'Bidan', 'Fisioterapis'];

export default function DataNakes() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Semua');

  const filteredNakes = nakesData.filter((item) => {
    const matchesSearch = `${item.nama} ${item.jenis} ${item.nomorStr}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'Semua' || item.jenis === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Data Nakes</h1>
        <p className="page-subtitle">Kelola data tenaga medis yang terdaftar di SmartHomeCare.</p>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-card border border-slate-200 bg-white p-4 shadow-card md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
          <FaSearch />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau jenis nakes"
            className="w-full bg-transparent outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                filter === option
                  ? 'bg-primary text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold">Daftar Nakes</h2>
          <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
            {filteredNakes.length} data
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Foto</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Nama Lengkap</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Jenis Nakes</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Nomor STR</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Lulusan</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Detail</th>
              </tr>
            </thead>
            <tbody>
              {filteredNakes.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="border-b border-slate-200 px-4 py-3 text-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-lg">
                      {item.foto}
                    </div>
                  </td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm">{item.nama}</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm">{item.jenis}</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm">{item.nomorStr}</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm">{item.lulusan}</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm">
                    <span className={`badge ${item.status === 'Aktif' ? 'badge-aktif' : item.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm">
                    <button type="button" className="btn-outline btn-sm">
                      Lihat
                    </button>
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
