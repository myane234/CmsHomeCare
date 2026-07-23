import { useEffect, useState } from 'react';
import {
  getAllNakesRequests,
  approveNakesRequest,
  rejectNakesRequest,
} from '../data/nakesRequestData';
import { getImageUrl } from '../data/imageHelper';

export default function PageNakesRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  function loadData() {
    setLoading(true);
    setErrorMsg('');
    getAllNakesRequests()
      .then((data) => {
        setRequests(data);
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Gagal memuat data permohonan nakes');
      })
      .finally(() => {
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

  // Logika Filter
  const filtered = requests.filter((item) => {
    const query = search.toLowerCase();
    const nama = String(
      item.nama_lengkap ?? item.nama ?? item.user?.name ?? ''
    ).toLowerCase();
    const email = String(item.user?.email ?? '').toLowerCase();
    const profesi = String(
      item.jenis_tenaga_medis ?? item.spesialisasi ?? item.peran ?? ''
    ).toLowerCase();
    const nik = String(item.nik ?? '').toLowerCase();
    const noStr = String(item.no_str ?? item.str ?? '').toLowerCase();
    const status = String(item.status ?? '').toLowerCase();

    return (
      nama.includes(query) ||
      email.includes(query) ||
      profesi.includes(query) ||
      nik.includes(query) ||
      noStr.includes(query) ||
      status.includes(query)
    );
  });

  const totalPages = Math.max(Math.ceil(filtered.length / itemsPerPage), 1);
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Aksi Approve
  async function handleConfirmApprove() {
    if (!approveTarget) return;
    const targetId = approveTarget.id ?? approveTarget.id_nakes_request;
    setProcessing(true);
    try {
      await approveNakesRequest(targetId);
      setApproveTarget(null);
      loadData();
    } catch (err) {
      alert(err.message || 'Gagal menyetujui permohonan');
    } finally {
      setProcessing(false);
    }
  }

  // Aksi Reject
  async function handleConfirmReject() {
    if (!rejectTarget) return;
    const targetId = rejectTarget.id ?? rejectTarget.id_nakes_request;
    setProcessing(true);
    try {
      await rejectNakesRequest(targetId, adminNotes);
      setRejectTarget(null);
      setAdminNotes('');
      loadData();
    } catch (err) {
      alert(err.message || 'Gagal menolak permohonan');
    } finally {
      setProcessing(false);
    }
  }

  // Helper render Badge Status
  function renderStatusBadge(status) {
    const s = String(status || 'pending').toLowerCase();
    if (s === 'approved') {
      return (
        <span className="inline-block rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
          Disetujui
        </span>
      );
    }
    if (s === 'rejected') {
      return (
        <span className="inline-block rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
          Ditolak
        </span>
      );
    }
    return (
      <span className="inline-block rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
        Pending
      </span>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Request Registrasi Nakes</h1>
          <p className="page-subtitle">
            Kelola permohonan pendaftaran tenaga kesehatan baru di sini
          </p>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari nama, email, NIK, No STR, atau jenis nakes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input max-w-full sm:max-w-[360px]"
        />
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-lg bg-danger-bg px-3.5 py-3 text-sm text-danger">
          {errorMsg}
        </div>
      )}

      {/* Table Card */}
      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-10 text-center text-sm text-slate-500">Memuat data...</p>
        ) : filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">
            Tidak ada permohonan nakes ditemukan.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse">
              <thead>
                <tr>
                  <th className="w-12 border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    No.
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Foto
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Nama & Email
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    NIK
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    No. STR
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Jenis Nakes
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Lulusan
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => {
                  const reqId = item.id ?? item.id_nakes_request;
                  const itemNumber = (currentPage - 1) * itemsPerPage + index + 1;
                  const nama = item.nama_lengkap ?? item.nama ?? item.user?.name ?? '-';
                  const email = item.user?.email ?? '-';
                  const foto = item.foto_profile ?? item.foto ?? item.avatar;
                  const profesi =
                    item.jenis_tenaga_medis ?? item.spesialisasi ?? item.peran ?? '-';
                  const isPending = !item.status || item.status === 'pending';

                  return (
                    <tr key={reqId || index} className="hover:bg-slate-50">
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-500">
                        {itemNumber}
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                        {foto ? (
                          <img
                            src={getImageUrl(foto)}
                            alt={nama}
                            className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-slate-200 bg-slate-100 text-xs font-bold text-slate-400">
                            {nama.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                        <div className="font-medium text-slate-900">{nama}</div>
                        <div className="text-xs text-slate-400">{email}</div>
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                        {item.nik ?? '-'}
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                        {item.no_str ?? item.str ?? '-'}
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                        <span className="badge badge-aktif">{profesi}</span>
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                        {item.lulusan ?? '-'}
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                        {renderStatusBadge(item.status)}
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                        <div className="flex justify-end gap-2">
                          <button
                            className="btn-outline btn-sm"
                            onClick={() => setDetailTarget(item)}
                          >
                            Detail
                          </button>
                          {isPending && (
                            <>
                              <button
                                className="btn-primary btn-sm"
                                onClick={() => setApproveTarget(item)}
                              >
                                Setujui
                              </button>
                              <button
                                className="btn-danger btn-sm"
                                onClick={() => {
                                  setRejectTarget(item);
                                  setAdminNotes('');
                                }}
                              >
                                Tolak
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls - Always shown when data finishes loading */}
        {!loading && (
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
                  Menampilkan{' '}
                  <span className="font-medium">
                    {filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
                  </span>{' '}
                  sampai{' '}
                  <span className="font-semibold">
                    {Math.min(currentPage * itemsPerPage, filtered.length)}
                  </span>{' '}
                  dari <span className="font-medium">{filtered.length}</span> data
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-xs"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                        className={`relative inline-flex items-center border px-3 py-1.5 text-sm font-semibold ${
                          isCurrent
                            ? 'z-10 border-primary bg-primary text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                            : 'border-slate-200 bg-white text-slate-950 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Selanjutnya
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {detailTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-5"
          onClick={() => setDetailTarget(null)}
        >
          <div
            className="w-full max-w-lg rounded-card bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Detail Request Nakes</h3>
              {renderStatusBadge(detailTarget.status)}
            </div>

            <div className="space-y-4 text-sm">
              {/* Header Profile Nakes */}
              <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 border border-slate-200">
                {detailTarget.foto_profile ? (
                  <img
                    src={getImageUrl(detailTarget.foto_profile)}
                    alt={detailTarget.nama_lengkap}
                    className="h-16 w-16 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-xl font-bold text-slate-500">
                    {(detailTarget.nama_lengkap || 'N').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {detailTarget.nama_lengkap ?? detailTarget.nama ?? '-'}
                  </h4>
                  <p className="text-xs text-slate-500">{detailTarget.user?.email ?? '-'}</p>
                  <span className="badge badge-aktif mt-1.5">
                    {detailTarget.jenis_tenaga_medis ?? detailTarget.spesialisasi ?? '-'}
                  </span>
                </div>
              </div>

              {/* Data Nakes */}
              <div>
                <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wide mb-2">
                  Informasi Tenaga Kesehatan
                </h5>
                <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 p-3 bg-white">
                  <div>
                    <span className="text-xs text-slate-400">NIK:</span>
                    <p className="font-semibold text-slate-800">{detailTarget.nik ?? '-'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">No. STR:</span>
                    <p className="font-semibold text-slate-800">{detailTarget.no_str ?? '-'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Lulusan / Institusi:</span>
                    <p className="font-semibold text-slate-800">{detailTarget.lulusan ?? '-'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Koordinat (Lat, Long):</span>
                    <p className="font-semibold text-slate-800">
                      {detailTarget.latitude && detailTarget.longitude
                        ? `${detailTarget.latitude}, ${detailTarget.longitude}`
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Pasien Terhubung */}
              {detailTarget.pasien && (
                <div>
                  <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wide mb-2">
                    Informasi Profil Pasien Terhubung
                  </h5>
                  <div className="space-y-2 rounded-lg border border-slate-200 p-3 bg-white">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-slate-400">Nama Pasien:</span>
                        <p className="font-semibold text-slate-800">
                          {detailTarget.pasien.nama_lengkap ?? '-'}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">No. HP / Telp:</span>
                        <p className="font-semibold text-slate-800">
                          {detailTarget.pasien.no_hp ?? '-'}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Golongan Darah:</span>
                        <p className="font-semibold text-slate-800">
                          {detailTarget.pasien.golongan_darah ?? '-'}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Jenis Kelamin:</span>
                        <p className="font-semibold text-slate-800">
                          {detailTarget.pasien.jenis_kelamin === 'L'
                            ? 'Laki-laki'
                            : detailTarget.pasien.jenis_kelamin === 'P'
                            ? 'Perempuan'
                            : '-'}
                        </p>
                      </div>
                    </div>
                    {detailTarget.pasien.alamat_utama && (
                      <div className="pt-1 border-t border-slate-100">
                        <span className="text-xs text-slate-400">Alamat Utama:</span>
                        <p className="text-xs font-medium text-slate-700 whitespace-pre-line">
                          {detailTarget.pasien.alamat_utama}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Catatan Admin */}
              {detailTarget.admin_notes && (
                <div className="rounded-lg bg-red-50 p-3 border border-red-200">
                  <span className="text-xs font-bold text-red-700">Catatan Admin (Penolakan):</span>
                  <p className="text-xs text-red-800 mt-1">{detailTarget.admin_notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button className="btn-outline" onClick={() => setDetailTarget(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Approve */}
      {approveTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-5"
          onClick={() => !processing && setApproveTarget(null)}
        >
          <div
            className="w-full max-w-[400px] rounded-card bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2.5 text-lg font-bold">Setujui Permohonan Nakes?</h3>
            <p className="mb-5 text-sm text-slate-500">
              Yakin ingin menyetujui pendaftaran nakes{' '}
              <strong>{approveTarget.nama_lengkap ?? approveTarget.nama ?? '-'}</strong>?
              Pengguna ini akan resmi terdaftar sebagai Tenaga Kesehatan.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                className="btn-outline"
                onClick={() => setApproveTarget(null)}
                disabled={processing}
              >
                Batal
              </button>
              <button
                className="btn-primary"
                onClick={handleConfirmApprove}
                disabled={processing}
              >
                {processing ? 'Memproses...' : 'Ya, Setujui'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reject */}
      {rejectTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-5"
          onClick={() => !processing && setRejectTarget(null)}
        >
          <div
            className="w-full max-w-[420px] rounded-card bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2.5 text-lg font-bold">Tolak Permohonan Nakes?</h3>
            <p className="mb-3 text-sm text-slate-500">
              Menolak permohonan pendaftaran dari{' '}
              <strong>{rejectTarget.nama_lengkap ?? rejectTarget.nama ?? '-'}</strong>.
            </p>

            <div className="mb-5">
              <label className="form-label">Catatan Admin (Alasan)</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Tuliskan alasan penolakan permohonan ini..."
                className="form-input resize-y"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                className="btn-outline"
                onClick={() => setRejectTarget(null)}
                disabled={processing}
              >
                Batal
              </button>
              <button
                className="btn-danger"
                onClick={handleConfirmReject}
                disabled={processing}
              >
                {processing ? 'Memproses...' : 'Tolak Permohonan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
