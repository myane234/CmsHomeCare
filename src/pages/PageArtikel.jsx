import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllArtikel, deleteArtikel, KATEGORI_ARTIKEL_OPTIONS } from '../data/artikelData';

export default function PageArtikel() {
  const [artikel, setArtikel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [search, setSearch] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  function loadData() {
    setLoading(true);
    setErrorMsg('');
    getAllArtikel(kategoriFilter)
      .then(setArtikel)
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kategoriFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [search, kategoriFilter]);

  const filtered = artikel.filter((item) =>
    item.judul_artikel?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteArtikel(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Artikel</h1>
          <p className="page-subtitle">Kelola artikel & tips kesehatan SmartHomeCare</p>
        </div>
        <Link to="/artikel/tambah" className="btn-primary">
          + Tambah Artikel
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Cari judul artikel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input max-w-full sm:max-w-[300px]"
        />
        <select
          value={kategoriFilter}
          onChange={(e) => setKategoriFilter(e.target.value)}
          className="form-input max-w-full sm:max-w-[220px]"
        >
          <option value="">Semua Kategori</option>
          {KATEGORI_ARTIKEL_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-lg bg-danger-bg px-3.5 py-3 text-sm text-danger">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="card p-10 text-center text-sm text-slate-500">Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center text-sm text-slate-500">
            Tidak ada artikel ditemukan.
          </div>
        ) : (
          <>
            {paginatedData.map((item, index) => {
              const itemNumber = (currentPage - 1) * itemsPerPage + index + 1;
              return (
                <div
                  key={item.id}
                  className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5"
                >
                  {item.gambar_artikel ? (
                    <img
                      src={item.gambar_artikel}
                      alt={item.judul_artikel}
                      className="h-44 w-full flex-shrink-0 rounded-lg object-cover sm:h-28 sm:w-40"
                    />
                  ) : (
                    <div className="flex h-44 w-full flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400 sm:h-28 sm:w-40">
                      Tanpa gambar
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-400">
                        #{itemNumber}
                      </span>
                      <span className="badge badge-aktif inline-block">
                        {item.kategori_artikel}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{item.judul_artikel}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">
                      {item.isi_artikel}
                    </p>
                  </div>

                  <div className="flex flex-shrink-0 gap-2 sm:flex-col">
                    <Link
                      to={`/artikel/${item.id}/edit`}
                      className="btn-outline btn-sm flex-1 sm:flex-none"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn-danger btn-sm flex-1 sm:flex-none"
                      onClick={() => setDeleteTarget(item)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3.5 sm:px-6 card">
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
                      Menampilkan <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> sampai{' '}
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
          </>
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
            <h3 className="mb-2.5 text-lg font-bold">Hapus Artikel?</h3>
            <p className="mb-5 text-sm text-slate-500">
              Yakin ingin menghapus <strong>{deleteTarget.judul_artikel}</strong>? Tindakan
              ini tidak dapat dibatalkan.
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
