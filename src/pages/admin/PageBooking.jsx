import { useState, useEffect } from "react";
import { BASE_URL } from "../../utils/apiClient";

export default function PageBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch(`${BASE_URL}/booking`);
        const data = await res.json();
        if (data.success) {
          setBookings(data.data || []);
        }
      } catch (err) {
        console.error("Gagal mengambil data booking", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Booking (Admin)</h1>
      {loading ? (
        <p>Memuat data...</p>
      ) : bookings.length === 0 ? (
        <p>Belum ada booking.</p>
      ) : (
        <table className="min-w-full bg-white border border-slate-200">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-4 py-2 text-left border-b">ID</th>
              <th className="px-4 py-2 text-left border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id_booking}>
                <td className="px-4 py-2 border-b">{booking.id_booking}</td>
                <td className="px-4 py-2 border-b">{booking.status_booking}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
