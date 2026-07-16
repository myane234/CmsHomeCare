import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ArticleForm.css";

export default function FormTambahArtikel() {
  const navigate = useNavigate();

  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [isi, setIsi] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const simpanArtikel = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("penulis", penulis);
    formData.append("isi", isi);

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      await axios.post(
        "http://localhost:8000/api/artikel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Artikel berhasil ditambahkan!");
      navigate("/admin/artikel");
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan artikel");
    }
  };

  return (
    <div className="container">
      <h2>Tambah Artikel</h2>

      <form onSubmit={simpanArtikel}>

        <div className="form-group">
          <label>Judul Artikel</label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Masukkan judul artikel"
            required
          />
        </div>

        <div className="form-group">
          <label>Penulis</label>
          <input
            type="text"
            value={penulis}
            onChange={(e) => setPenulis(e.target.value)}
            placeholder="Nama penulis"
            required
          />
        </div>

        <div className="form-group">
          <label>Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label>Isi Artikel</label>
          <textarea
            rows="8"
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            placeholder="Tulis isi artikel..."
            required
          />
        </div>

        <button type="submit">
          Simpan Artikel
        </button>

      </form>
    </div>
  );
}