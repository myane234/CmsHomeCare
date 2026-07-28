import { useState, useEffect } from "react";
import { BASE_URL } from "../../utils/apiClient";
import { getAuthHeaders } from "../../utils/auth";
import Pagination from "../../components/pagination";

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

// Badge Status Booking (Persegi Panjang Rapi)
function renderStatusBadge(status) {
  const value = String(status || "pending").toLowerCase();

  if (value === "selesai" || value === "completed" || value === "success") {
    return (
      <span className="inline-flex items-center justify-center rounded-md bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
        Selesai
      </span>
    );
  }

  if (value === "dibatalkan" || value === "cancelled" || value === "canceled") {
    return (
      <span className="inline-flex items-center justify-center rounded-md bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
        Dibatalkan
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
      {status || "Pending"}
    </span>
  );
}

// Badge Status Pembayaran (Persegi Panjang Rapi)
function renderPaymentBadge(status) {
  const value = String(status || "belum bayar").toLowerCase();

  if (["settlement", "sukses", "paid", "lunas", "capture"].includes(value)) {
    return (
      <span className="inline-flex items-center justify-center rounded-md bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
        Lunas
      </span>
    );
  }

  if (["pending", "menunggu", "waiting"].includes(value)) {
    return (
      <span className="inline-flex items-center justify-center rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
        Pending
      </span>
    );
  }

  if (["expire", "failed", "gagal", "deny", "cancel"].includes(value)) {
    return (
      <span className="inline-flex items-center justify-center rounded-md bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
        Gagal
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
      Belum Bayar
    </span>
  );
}

export default function PageBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // State Filter & Search
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Batas jumlah baris data per halaman

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await fetch(`${BASE_URL}/admin/bookings`, {
          headers: getAuthHeaders({ Accept: "application/json" }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Gagal mengambil data booking");
        }

        setBookings(data.data || []);
      } catch (err) {
        console.error("Gagal mengambil data booking", err);
        setErrorMsg(err.message || "Gagal mengambil data booking");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  // Reset halaman ke 1 tiap kali filter atau kata pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  // Helper normalisasi status pembayaran
  const getNormalizedPaymentStatus = (booking) => {
    const rawStatus = String(booking.transaksi?.status_transaksi || "belum bayar").toLowerCase();
    
    if (["settlement", "sukses", "paid", "lunas", "capture"].includes(rawStatus)) return "lunas";
    if (["pending", "menunggu", "waiting"].includes(rawStatus)) return "pending";
    if (["expire", "failed", "gagal", "deny", "cancel"].includes(rawStatus)) return "gagal";
    
    return "belum_bayar";
  };

  // 1. Filter Data Berdasarkan Kategori & Search
  const filteredBookings = bookings.filter((booking) => {
    const status = getNormalizedPaymentStatus(booking);
    const matchesCategory = activeFilter === "all" || status === activeFilter;

    const bookingCode = String(booking.booking_code || `#${booking.id_booking}`).toLowerCase();
    const patientName = String(booking.pasien?.nama_lengkap || "").toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch = query === "" || bookingCode.includes(query) || patientName.includes(query);

    return matchesCategory && matchesSearch;
  });

  // 2. Kalkulasi Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  // Hitung data per kategori untuk angka badge di tombol
  const counts = {
    all: bookings.length,
    lunas: bookings.filter((b) => getNormalizedPaymentStatus(b) === "lunas").length,
    pending: bookings.filter((b) => getNormalizedPaymentStatus(b) === "pending").length,
    gagal: bookings.filter((b) => getNormalizedPaymentStatus(b) === "gagal").length,
  };

  const filterOptions = [
    { key: "all", label: "Semua", count: counts.all },
    { key: "lunas", label: "Lunas", count: counts.lunas },
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "gagal", label: "Gagal / Batal", count: counts.gagal },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Booking</h1>
          <p className="text-sm text-slate-500">Lihat daftar booking pasien dan status pembayarannya.</p>
        </div>
      </div>

      {/* Control Bar: Search Bar (Kiri), Filter Kategori (Kanan) */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Textbox Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Cari kode booking / pasien..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 pl-9 pr-8 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Tombol Filter Kategori */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => {
            const isActive = activeFilter === option.key;
            return (
              <button
                key={option.key}
                onClick={() => setActiveFilter(option.key)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{option.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {option.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {errorMsg}
        </div>
      )}

      {/* Table Section */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Memuat data booking...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          {searchQuery
            ? `Tidak ada booking yang cocok dengan kata kunci "${searchQuery}"`
            : "Belum ada data booking."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="w-12 border-b border-slate-200 px-4 py-3 text-center">No.</th>
                  <th className="border-b border-slate-200 px-4 py-3">Kode Booking</th>
                  <th className="border-b border-slate-200 px-4 py-3">Pasien</th>
                  <th className="border-b border-slate-200 px-4 py-3">Layanan</th>
                  <th className="border-b border-slate-200 px-4 py-3">Tanggal & Jam</th>
                  <th className="border-b border-slate-200 px-4 py-3">Alamat</th>
                  <th className="border-b border-slate-200 px-4 py-3">Status</th>
                  <th className="border-b border-slate-200 px-4 py-3">Pembayaran</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.map((booking, index) => (
                  <tr key={booking.id_booking} className="hover:bg-slate-50">
                    <td className="border-b border-slate-200 px-4 py-3 text-center font-medium text-slate-500">
                      {startIndex + index + 1}
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3 font-medium text-slate-900">
                      {booking.booking_code || `#${booking.id_booking}`}
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3 text-slate-700">
                      {booking.pasien?.nama_lengkap || "-"}
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3 text-slate-700">
                      {booking.layanan?.nama_layanan || "-"}
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3 text-slate-700">
                      <div>{formatDate(booking.tanggal_kunjungan)}</div>
                      <div className="text-xs text-slate-500">{booking.jam_kunjungan || "-"}</div>
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3 text-slate-700">
                      {booking.alamat_kunjungan || "-"}
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3">
                      {renderStatusBadge(booking.status_booking)}
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3">
                      {renderPaymentBadge(booking.transaksi?.status_transaksi)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Render Komponen Pagination */}
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