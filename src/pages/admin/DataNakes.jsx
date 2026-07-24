import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Pagination from '../../components/pagination'; // <- Import komponen Pagination

const nakesData = [
  { id: 1, foto: '/nakesgambar.jpg', nama: 'Dr. Anisa Rahma', jenis: 'Pergantian Alat Medis', nomorStr: 'STR-2024001', lulusan: 'Poltekkes Kemenkes Jakarta', status: 'Selesai', dokumenPdf: '/Ijazah-Jokowi.jpg' },
  { id: 2, foto: '/nakesgambar.jpg', nama: 'Siti Nurhaliza', jenis: 'Fisioterapi', nomorStr: 'STR-2024002', lulusan: 'Akademi Kebidanan Citra', status: 'Pelatihan', dokumenPdf: '/Ijazah-Jokowi.jpg' },
  { id: 3, foto: '/nakesgambar.jpg', nama: 'Rizki Pratama', jenis: 'Fisioterapi', nomorStr: 'STR-2024003', lulusan: 'Universitas Brawijaya', status: 'Pending', dokumenPdf: '/Ijazah-Jokowi.jpg' },
  { id: 4, foto: '/nakesgambar.jpg', nama: 'Dewi Sartika', jenis: 'Baby Nurse', nomorStr: 'STR-2024004', lulusan: 'STIKES Harapan Bangsa', status: 'Selesai', dokumenPdf: '/Ijazah-Jokowi.jpg' },
  { id: 5, foto: '/nakesgambar.jpg', nama: 'Muhammad Farid', jenis: 'Baby Nurse', nomorStr: 'STR-2024005', lulusan: 'Poltekkes Kemenkes Surabaya', status: 'Pelatihan', dokumenPdf: '/Ijazah-Jokowi.jpg' },
];

const filterOptions = ['Semua', 'Pending', 'Pelatihan', 'Selesai'];

export default function DataNakes() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Logika Filter & Pencarian
  const filteredNakes = nakesData.filter((item) => {
    const matchesSearch = `${item.nama} ${item.jenis} ${item.nomorStr}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'Semua' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Logika Pagination
  const totalPages = Math.max(Math.ceil(filteredNakes.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredNakes.slice(startIndex, startIndex + itemsPerPage);

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
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset ke halaman 1 saat mencari
            }}
            placeholder="Cari nama atau jenis nakes"
            className="w-full bg-transparent outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setFilter(option);
                setCurrentPage(1); // Reset ke halaman 1 saat mengubah filter
              }}
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
          <table className="w-full min-w-225 border-collapse">
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
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-sm text-slate-500">
                    Tidak ada data nakes yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="border-b border-slate-200 px-4 py-3 text-sm">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-lg">
                        <img src={item.foto} alt={item.nama} className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm">{item.nama}</td>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm">{item.jenis}</td>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm">{item.nomorStr}</td>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm">{item.lulusan}</td>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm">
                      <span className={`badge ${item.status === 'Selesai' ? 'badge-aktif' : item.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3 text-sm">
                      <a href={item.dokumenPdf} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm inline-flex items-center justify-center text-center">
                        Lihat Dokumen
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Informasi Jumlah Data */}
        {filteredNakes.length > 0 && (
          <div className="border-t border-slate-200 bg-white px-4 py-3.5 sm:px-6">
            <p className="text-sm text-slate-500">
              Menampilkan <span className="font-medium">{startIndex + 1}</span> sampai{' '}
              <span className="font-semibold">
                {Math.min(currentPage * itemsPerPage, filteredNakes.length)}
              </span>{' '}
              dari <span className="font-medium">{filteredNakes.length}</span> data
            </p>
          </div>
        )}
      </div>

      {/* Komponen Pagination Terpisah */}
      {filteredNakes.length > 0 && totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}