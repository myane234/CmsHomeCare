import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deletePromo, getAllPromo } from '../data/PromoEndpoint';
import './PagePromo.css';

export default function PagePromo() {
  const [promo, setPromo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function loadData() {
    setLoading(true);
    getAllPromo()
      .then((data) => {
        setPromo(data);
        setLoading(false);
      })
      .catch(() => {
        setPromo([]);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = promo.filter((item) => {
    const kode = item.kode_promo ?? item.kodePromo ?? item.kode ?? '';
    const persen = item.potongan_harga ?? item.potonganHarga ?? '';
    return String(kode)
      .toLowerCase()
      .includes(search.toLowerCase()) || String(persen).toLowerCase().includes(search.toLowerCase());
  });

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const id = deleteTarget.id_promo ?? deleteTarget.idPromo ?? deleteTarget.id;
      await deletePromo(id);
      setDeleteTarget(null);
      loadData();
    } finally {
      setDeleting(false);
    }
  }

  function getId(item) {
    return item.id_promo ?? item.idPromo ?? item.id;
  }

  return (
    <div className="promo-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Promo</h1>
          <p className="page-subtitle">Kelola semua promo HomeCare di sini</p>
        </div>
        <Link to="/promo/tambah" className="btn btn-primary">
          + Tambah Promo
        </Link>
      </div>

      <div className="promo-toolbar">
        <input
          type="text"
          placeholder="Cari kode promo atau potongan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input promo-search"
        />
      </div>

      <div className="promo-table-wrapper">
        {loading ? (
          <p className="empty-state">Memuat data...</p>
        ) : filtered.length === 0 ? (
          <p className="empty-state">Tidak ada promo ditemukan.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Kode Promo</th>
                <th>Potongan Harga</th>
                <th>Tanggal Berakhir</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const kode = item.kode_promo ?? item.kodePromo ?? item.kode ?? '-';
                const persen = item.potongan_harga ?? item.potonganHarga ?? '-';
                const tanggal = item.tanggal_berakhir ?? item.tanggalBerakhir ?? '-';
                const status = item.status_promo ?? item.statusPromo ?? '-';

                const statusBadge = String(status).toLowerCase().includes('aktif') ? 'aktif' : 'nonaktif';

                return (
                  <tr key={String(getId(item)) || kode}>
                    <td>{kode}</td>
                    <td>{persen} %</td>
                    <td>{tanggal}</td>
                    <td>
                      <span className={`badge badge-${statusBadge}`}>{status}</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/promo/${getId(item)}/edit`}
                          className="btn btn-outline btn-sm"
                        >
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Hapus Promo?</h3>
            <p>
              Yakin ingin menghapus <strong>{deleteTarget.kode_promo ?? deleteTarget.kodePromo ?? deleteTarget.kode ?? '-'}</strong>? Tindakan ini
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

