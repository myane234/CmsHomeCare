import { Link } from "react-router-dom";

export default function PageArtikel() {
  return (
    <div className="container">
      <h2>Daftar Artikel</h2>

      <Link to="/admin/artikel/tambah">
        <button>Tambah Artikel</button>
      </Link>

      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Judul</th>
            <th>Penulis</th>
            <th>Tanggal</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {/* nanti mapping dari API */}
        </tbody>
      </table>
    </div>
  );
}