import { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaGlobeAmericas, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import Pagination from '../../components/pagination';
import { getAllProvinsi, createProvinsi, updateProvinsi, deleteProvinsi, toggleStatusProvinsi } from '../../data/provinsiData';
import Swal from 'sweetalert2';

export default function AdminMasterProvinsi() {
  const [provinsiList, setProvinsiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvinsi, setSelectedProvinsi] = useState(null); // null = Tambah, object = Edit

  // Form State
  const [formNama, setFormNama] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setErrorMsg('');
    getAllProvinsi()
      .then((data) => {
        setProvinsiList(data);
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Gagal memuat data provinsi');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      setLoading(true);
      fetchData();
    });
  }, []);

  const handleAddClick = () => {
    setSelectedProvinsi(null);
    setFormNama('');
    setFormActive(true);
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    setSelectedProvinsi(item);
    setFormNama(item.nama_provinsi || '');
    setFormActive(Boolean(item.is_active));
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProvinsi(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      nama_provinsi: formNama,
      is_active: formActive ? 1 : 0,
    };

    try {
      if (selectedProvinsi) {
        await updateProvinsi(selectedProvinsi.id_provinsi, payload);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data provinsi diperbarui!' });
      } else {
        await createProvinsi(payload);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Provinsi baru ditambahkan!' });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.message || 'Terjadi kesalahan saat menyimpan data' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (item) => {
    const newStatus = item.is_active ? 'nonaktifkan' : 'aktifkan';
    const confirmText = `Anda yakin ingin ${newStatus} provinsi "${item.nama_provinsi}"?`;

    Swal.fire({
      title: `${newStatus === 'aktifkan' ? 'Aktifkan' : 'Nonaktifkan'} Provinsi?`,
      text: confirmText,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: item.is_active ? '#ef4444' : '#22c55e',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Ya, ${newStatus === 'aktifkan' ? 'Aktifkan' : 'Nonaktifkan'}!`,
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await toggleStatusProvinsi(item.id_provinsi);
          Swal.fire('Berhasil!', `Provinsi "${item.nama_provinsi}" berhasil di${newStatus}.`, 'success');
          fetchData();
        } catch (err) {
          Swal.fire('Gagal!', err.message || 'Gagal mengubah status provinsi.', 'error');
        }
      }
    });
  };

  const handleDeleteClick = (item) => {
    Swal.fire({
      title: 'Hapus Provinsi?',
      text: `Anda yakin ingin menghapus "${item.nama_provinsi}"? Tindakan ini tidak dapat dibatalkan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProvinsi(item.id_provinsi);
          Swal.fire('Terhapus!', 'Provinsi berhasil dihapus.', 'success');
          fetchData();
        } catch (err) {
          Swal.fire('Gagal!', err.message || 'Gagal menghapus provinsi.', 'error');
        }
      }
    });
  };

  const filteredProvinsi = provinsiList.filter((item) => {
    const matchesSearch = item.nama_provinsi?.toLowerCase().includes(search.toLowerCase());

    let matchesStatus = true;
    if (filterStatus === 'aktif') matchesStatus = Boolean(item.is_active) === true;
    if (filterStatus === 'nonaktif') matchesStatus = Boolean(item.is_active) === false;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(Math.ceil(filteredProvinsi.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredProvinsi.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      {/* Header Section */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Master Provinsi</h1>
          <p className="page-subtitle">Kelola daftar provinsi untuk wilayah layanan operasional.</p>
        </div>
        <button onClick={handleAddClick} className="btn-primary flex items-center justify-center gap-2">
          <FaPlus />
          <span>Tambah Provinsi</span>
        </button>
      </div>

      {/* Filter Section */}
      <div className="mb-5 flex flex-col gap-4 rounded-card border border-slate-200 bg-white p-4 shadow-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 flex-grow">
            <FaSearch />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nama provinsi..."
              className="w-full bg-transparent outline-none"
            />
          </div>

          <select
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-lg bg-danger-bg px-3.5 py-3 text-sm text-danger">
          {errorMsg}
        </div>
      )}

      {/* Table Section */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-10 text-center text-sm text-slate-500">Memuat data provinsi...</p>
          ) : (
            <table className="w-full min-w-180 border-collapse">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="border-b border-slate-200 px-4 py-3 text-left">Nama Provinsi</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-center">Status</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-sm text-slate-500">
                      Tidak ada data provinsi yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.id_provinsi} className="hover:bg-slate-50">
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
                            <FaGlobeAmericas className="text-base" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{item.nama_provinsi}</div>
                            <div className="text-xs text-slate-400">ID: #{item.id_provinsi}</div>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm text-center">
                        {item.is_active ? (
                          <span className="badge badge-aktif">Aktif</span>
                        ) : (
                          <span className="badge badge-nonaktif">Nonaktif</span>
                        )}
                      </td>
                      <td className="border-b border-slate-200 px-4 py-3.5 text-sm text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Tombol Toggle Status */}
                          <button
                            onClick={() => handleToggleStatus(item)}
                            className={`p-1.5 rounded border transition-colors ${
                              item.is_active
                                ? 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100'
                                : 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100'
                            }`}
                            title={item.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                          >
                            {item.is_active ? <FaToggleOff /> : <FaToggleOn />}
                          </button>

                          {/* Tombol Edit */}
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-1.5 text-slate-600 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 transition-colors"
                            title="Edit Provinsi"
                          >
                            <FaEdit />
                          </button>

                          {/* Tombol Hapus */}
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="p-1.5 text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
                            title="Hapus Provinsi"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filteredProvinsi.length > 0 && (
          <div className="border-t border-slate-200 bg-white px-4 py-3.5 sm:px-6">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      {/* Modal Form (Tambah / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl transform scale-100 transition-transform">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {selectedProvinsi ? 'Edit Provinsi' : 'Tambah Provinsi Baru'}
              </h3>
              <button onClick={handleModalClose} className="text-slate-400 hover:text-slate-600 font-semibold text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="form-label">
                    Nama Provinsi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: JAWA BARAT"
                    className="form-input uppercase"
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value.toUpperCase())}
                  />
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    id="provinsi-status-checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                  />
                  <label htmlFor="provinsi-status-checkbox" className="text-sm font-semibold text-slate-800 cursor-pointer">
                    Aktif (Provinsi tersedia untuk wilayah layanan)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                <button type="button" onClick={handleModalClose} className="btn-outline btn-sm">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary btn-sm">
                  {isSubmitting ? 'Menyimpan...' : selectedProvinsi ? 'Simpan Perubahan' : 'Tambah Provinsi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
