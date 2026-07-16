import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ArticleForm.css";

export default function FormEditArtikel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [isi, setIsi] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    getArtikel();
  }, []);

  const getArtikel = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/artikel/${id}`);

      setJudul(res.data.judul);
      setPenulis(res.data.penulis);
      setIsi(res.data.isi);
    } catch (err) {
      console.log(err);
    }
  };

  const updateArtikel = async (e) => {
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
        `http://localhost:8000/api/artikel/${id}?_method=PUT`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Artikel berhasil diupdate");
      navigate("/admin/artikel");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h2>Edit Artikel</h2>

      <form onSubmit={updateArtikel}>

        <label>Judul</label>
        <input
          type="text"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
        />

        <label>Penulis</label>
        <input
          type="text"
          value={penulis}
          onChange={(e) => setPenulis(e.target.value)}
        />

        <label>Thumbnail</label>
        <input
          type="file"
          onChange={(e) => setThumbnail(e.target.files[0])}
        />

        <label>Isi Artikel</label>
        <textarea
          rows="8"
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
        />

        <button type="submit">
          Update Artikel
        </button>

      </form>
    </div>
  );
}