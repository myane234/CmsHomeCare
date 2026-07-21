import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deletePromo, getAllPromo } from '../data/PromoEndpoint';
import { getImageUrl } from '../data/imageHelper.js';

export default function PagePromo() {
  const [promo, setPromo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  function loadData() {
    setLoading(true);
    getAllPromo()
      .then((data) => {
        setPromo(data);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [search]);

  // Logika Filter
  const filtered = promo.filter((item) => {
    const query = search.toLowerCase();
    const nama = String(item.nama_paket ?? '').toLowerCase();
    const layanan = String(
      Array.isArray(item.layanans)
        ? item.layanans.map((l) => l.nama_layanan ?? l.nama ?? '').join(' ')
        : ''
    ).toLowerCase();
    return nama.includes(query) || layanan.includes(query);
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Logika Hapus
  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePromo(deleteTarget.id ?? deleteTarget.id_promo);
      loadData();
      setDeleteTarget(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Promo</h1>
          <p className="page-subtitle">Kelola semua paket promo HomeCare di sini</p>
        </div>
        <Link to="/promo/tambah" className="btn-primary">
          + Tambah Promo
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari nama paket atau layanan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input max-w-full sm:max-w-[340px]"
        />
      </div>

      {/* Table Card */}
      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-10 text-center text-sm text-slate-500">Memuat data...</p>
        ) : filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">Tidak ada promo ditemukan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 w-12">No.</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Gambar</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Nama Paket</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Diskon</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Layanan</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => {
                  const promoId = item.id_promo ?? item.id;
                  const itemNumber = (currentPage - 1) * itemsPerPage + index + 1;
                  const layananLabel = Array.isArray(item.layanans)
                    ? item.layanans.map((l) => l.nama_layanan ?? l.nama ?? l.id).join(', ')
                    : '-';

                  return (
                    <tr key={promoId} className="hover:bg-slate-50">
                      {/* Kolom Nomor */}
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-500">{itemNumber}</td>
                      {/* Kolom Gambar */}
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                        {item.gambar_promo ? (
                            <img
                              src={getImageUrl(item.gambar_promo)}
                              alt={item.nama_paket}
                              className="h-14 w-20 rounded-lg border border-slate-200 object-cover"
                            />
                        ) : (
                          <div className="flex h-14 w-20 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-[11px] text-slate-400">
                            No img
                          </div>
                        )}
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm font-medium">{item.nama_paket ?? '-'}</td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">{item.diskon_persen ?? item.potongan_harga ?? '-'}%</td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">{layananLabel}</td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${item.status_promo === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                           {item.status_promo ?? '-'}
                        </span>
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                        <div className="flex justify-end gap-2">
                          <Link to={`/promo/${promoId}/edit`} className="btn-outline btn-sm">Edit</Link>
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
                  dari <span className="font-medium">{filtered.length}</span> data
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

      {/* Modal Delete */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-5"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-[380px] rounded-card bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2.5 text-lg font-bold">Hapus Promo?</h3>
            <p className="mb-5 text-sm text-slate-500">
              Yakin ingin menghapus <strong>{deleteTarget.nama_paket ?? '-'}</strong>? Tindakan ini tidak dapat dibatalkan.
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