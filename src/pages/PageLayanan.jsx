import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllLayanan, deleteLayanan } from '../data/layananData';

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
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Gambar</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Nama Layanan</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Kategori</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Harga</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Durasi</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
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
                    <td className="border-b border-slate-200 px-4 py-3.5 text-sm">{item.durasi} menit</td>
                    <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                      <span className={`badge badge-${item.status}`}>
                        {item.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                      </span>
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
                ))}
              </tbody>
            </table>
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
