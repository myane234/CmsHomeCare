import { useState, useEffect } from 'react';
import './LayananForm.css';

const KATEGORI_OPTIONS = [
  'Ibu & Anak',
  'Perawatan Luka',
  'Medical Checkup',
  'Fisioterapi',
  'Pemasangan & Penggantian Alat Medis',
  'Caregiver',
];

const emptyForm = {
  nama: '',
  kategori: KATEGORI_OPTIONS[0],
  deskripsi: '',
  harga: '',
  durasi: '',
  status: 'aktif',
  gambar: '',
};

export default function LayananForm({ initialData, onSubmit, submitting, mode }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({ ...emptyForm, ...initialData });
      setPreview(initialData.gambar || '');
    }
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setPreview(dataUrl);
      setForm((prev) => ({ ...prev, gambar: dataUrl }));
    };
    reader.readAsDataURL(file);
  }

  function validate() {
    const newErrors = {};
    if (!form.nama.trim()) newErrors.nama = 'Nama layanan wajib diisi';
    if (!form.deskripsi.trim()) newErrors.deskripsi = 'Deskripsi wajib diisi';
    if (!form.harga || Number(form.harga) <= 0) newErrors.harga = 'Harga harus lebih dari 0';
    if (!form.durasi || Number(form.durasi) <= 0) newErrors.durasi = 'Durasi harus lebih dari 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      harga: Number(form.harga),
      durasi: Number(form.durasi),
    });
  }

  return (
    <form className="layanan-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-col">
          <label className="form-label">Nama Layanan</label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            className="form-input"
            placeholder="Contoh: Fisioterapi Ortopedi"
          />
          {errors.nama && <span className="field-error">{errors.nama}</span>}

          <label className="form-label">Kategori</label>
          <select
            name="kategori"
            value={form.kategori}
            onChange={handleChange}
            className="form-input"
          >
            {KATEGORI_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <label className="form-label">Deskripsi</label>
          <textarea
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            className="form-input form-textarea"
            placeholder="Jelaskan tentang layanan ini..."
            rows={5}
          />
          {errors.deskripsi && <span className="field-error">{errors.deskripsi}</span>}

          <div className="form-row-2">
            <div>
              <label className="form-label">Harga (Rp)</label>
              <input
                type="number"
                name="harga"
                value={form.harga}
                onChange={handleChange}
                className="form-input"
                placeholder="250000"
                min="0"
              />
              {errors.harga && <span className="field-error">{errors.harga}</span>}
            </div>
            <div>
              <label className="form-label">Durasi (menit)</label>
              <input
                type="number"
                name="durasi"
                value={form.durasi}
                onChange={handleChange}
                className="form-input"
                placeholder="60"
                min="0"
              />
              {errors.durasi && <span className="field-error">{errors.durasi}</span>}
            </div>
          </div>

          <label className="form-label">Status</label>
          <div className="status-toggle">
            <button
              type="button"
              className={form.status === 'aktif' ? 'status-btn active-on' : 'status-btn'}
              onClick={() => setForm((prev) => ({ ...prev, status: 'aktif' }))}
            >
              Aktif
            </button>
            <button
              type="button"
              className={form.status === 'nonaktif' ? 'status-btn active-off' : 'status-btn'}
              onClick={() => setForm((prev) => ({ ...prev, status: 'nonaktif' }))}
            >
              Nonaktif
            </button>
          </div>
        </div>

        <div className="form-col">
          <label className="form-label">Gambar Layanan</label>
          <div className="image-upload">
            {preview ? (
              <img src={preview} alt="Preview" className="image-preview" />
            ) : (
              <div className="image-placeholder">Belum ada gambar</div>
            )}
            <label className="btn btn-outline upload-btn">
              Pilih Gambar
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <a href="/layanan" className="btn btn-outline">
          Batal
        </a>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting
            ? 'Menyimpan...'
            : mode === 'edit'
            ? 'Simpan Perubahan'
            : 'Tambah Layanan'}
        </button>
      </div>
    </form>
  );
}
