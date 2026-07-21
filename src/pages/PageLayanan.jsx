import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllLayanan, deleteLayanan } from '../data/layananData';

export default function PageLayanan() {
  const [layanan, setLayanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  function loadData() {
    setLoading(true);
    getAllLayanan().then((data) => {
      setLayanan(data);
      setLoading(false);
    });
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [search]);

  const filtered = layanan.filter((item) =>
    (item.nama + item.kategori).toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Layanan</h1>
          <p className="page-subtitle">Kelola semua layanan HomeCare di sini</p>
        </div>
        <Link to="/layanan/tambah" className="btn-primary">
          + Tambah Layanan
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari nama atau kategori layanan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input max-w-full sm:max-w-[340px]"
        />
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-10 text-center text-sm text-slate-500">Memuat data...</p>
        ) : filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">Tidak ada layanan ditemukan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 w-12">No.</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Gambar</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Nama Layanan</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Kategori</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Harga</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Tipe Layanan</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Durasi</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Transport</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => {
                  const itemNumber = (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      {/* Kolom Nomor */}
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-500">{itemNumber}</td>
                      {/* Kolom Gambar */}
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                        {item.gambar ? (
                          <img
                            src={item.gambar}
                            alt={item.nama}
                            className="h-14 w-20 rounded-lg border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-20 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-[11px] text-slate-400">
                            No img
                          </div>
                        )}
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">{item.nama}</td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">{item.kategori}</td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                        Rp {Number(item.harga).toLocaleString('id-ID')}
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm capitalize">
                        {item.tipe_layanan || 'Tindakan'}
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                        {item.tipe_layanan === 'durasi' ? `${item.durasi} menit` : '-'}
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                        {item.transport ? 'Ya' : 'Tidak'}
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                        <div className="flex justify-end gap-2">
                          <Link to={`/layanan/${item.id}/edit`} className="btn-outline btn-sm">
                            Edit
                          </Link>
                          <button
                            className="btn-danger btn-sm"
                            onClick={() => setDeleteTarget(item)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && filtered.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3.5 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn-outline btn-sm"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn-outline btn-sm"
              >
                Selanjutnya
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Menampilkan <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> sampai{' '}
                  <span className="font-semibold">
                    {Math.min(currentPage * itemsPerPage, filtered.length)}
                  </span>{' '}
                  dari <span className="font-semibold">{filtered.length}</span> data
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2.5 py-1.5 text-sm font-semibold text-slate-500 border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sebelumnya
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => {
                    const pageNum = idx + 1;
                    const isCurrent = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-3 py-1.5 text-sm font-semibold border ${
                          isCurrent
                            ? 'z-10 bg-primary text-white border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                            : 'text-slate-950 border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2.5 py-1.5 text-sm font-semibold text-slate-500 border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Selanjutnya
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-5"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-[380px] rounded-card bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2.5 text-lg font-bold">Hapus Layanan?</h3>
            <p className="mb-5 text-sm text-slate-500">
              Yakin ingin menghapus <strong>{deleteTarget.nama}</strong>? Tindakan ini
              tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                className="btn-outline"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Batal
              </button>
              <button className="btn-danger" onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
