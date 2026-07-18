import { useEffect, useState } from 'react';
import './PromoForm.css';

const emptyForm = {
  kode_promo: '',
  potongan_harga: '', // persen
  tanggal_berakhir: '', // string
  status_promo: 'Tidak Aktif',
  deskripsi_layanan: '',
};

export default function PromoForm({ initialData, onSubmit, submitting, mode }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // normalize tanggal agar bisa masuk ke input[type=date] (YYYY-MM-DD)
      let normalizedTanggal = initialData.tanggal_berakhir ?? initialData.tanggalBerakhir ?? '';
      if (typeof normalizedTanggal === 'string' && normalizedTanggal.includes(':')) {
        // konversi YY:M:D -> YYYY-MM-DD (asumsi tahun 20YY)
        const [yy, mm, dd] = normalizedTanggal.split(':');
        const yyyy = `20${yy}`;
        const pad = (n) => String(n).padStart(2, '0');
        normalizedTanggal = `${yyyy}-${pad(mm)}-${pad(dd)}`;
      }

      setForm({
        ...emptyForm,
        ...initialData,
        tanggal_berakhir: normalizedTanggal,
        // normalize status
        status_promo:
          initialData.status_promo ?? initialData.statusPromo ?? emptyForm.status_promo,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const newErrors = {};
    if (!String(form.kode_promo).trim()) newErrors.kode_promo = 'Kode promo wajib diisi';
    const persen = Number(form.potongan_harga);
    if (!form.potongan_harga || Number.isNaN(persen) || persen <= 0)
      newErrors.potongan_harga = 'Potongan harga (persen) harus lebih dari 0';
    if (!String(form.tanggal_berakhir).trim())
      newErrors.tanggal_berakhir = 'Tanggal berakhir wajib diisi';
    if (!String(form.status_promo).trim())
      newErrors.status_promo = 'Status promo wajib dipilih';

    // backend minta deskripsi_layanan wajib
    if (!String(form.deskripsi_layanan).trim())
      newErrors.deskripsi_layanan = 'Deskripsi layanan wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    // tidak dipakai karena submit inline di render
  }

  const todayLocal = (() => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  })();

  // Input date hanya simpan value DATE (YYYY-MM-DD)
  // saat submit akan dikonversi ke format backend: YY:M:D (atau string as-is jika backend menunggu format lain)
  function formatDateToYYMD(isoYmd) {
    // Backend mengharapkan tanggal_berakhir valid date.
    // Ubah kembali ke YYYY-MM-DD agar lolos validator tanggal.
    // (Error backend: tanggal berakhir field must be a valid date)
    if (!isoYmd) return '';
    return isoYmd; // YYYY-MM-DD
  }

  const tanggalInput = form.tanggal_berakhir
    ? (() => {
        // jika sudah dalam format YYYY-MM-DD, pakai langsung
        if (/^\d{4}-\d{2}-\d{2}$/.test(form.tanggal_berakhir)) return form.tanggal_berakhir;
        // jika format YY:M:D, ubah perkiraan ke YYYY-MM-DD (butuh asumsi tahun 20XX)
        if (/^\d{2}:\d+:\d+$/.test(form.tanggal_berakhir)) {
          const [yy, mm, dd] = form.tanggal_berakhir.split(':');
          const yyyy = `20${yy}`;
          const pad = (n) => String(n).padStart(2, '0');
          return `${yyyy}-${pad(mm)}-${pad(dd)}`;
        }
        return '';
      })()
    : '';

  return (
    <form
      className="promo-form"
      onSubmit={(e) => {
        // konversi tanggal sebelum submit
        e.preventDefault();
        if (!validate()) return;

        const payload = {
          ...form,
          potongan_harga: Number(form.potongan_harga),
          // kirim apa adanya (YYYY-MM-DD) agar lolos validasi tanggal backend
          tanggal_berakhir: form.tanggal_berakhir,
        };

        // onSubmit async; tampilkan error biar bisa tahu penyebab 422
        Promise.resolve(onSubmit(payload)).catch((err) => {
          const msg = err?.message || 'Gagal menyimpan promo';
          // eslint-disable-next-line no-alert
          alert(msg);
        });
      }}
    >
      <div className="promo-form-grid">
        <div className="promo-form-col">
          <label className="form-label">Kode Promo</label>
          <input
            type="text"
            name="kode_promo"
            value={form.kode_promo}
            onChange={handleChange}
            className="form-input"
            placeholder="Contoh: PROMO10"
          />
          {errors.kode_promo && <span className="field-error">{errors.kode_promo}</span>}

          <div className="promo-row-2">
            <div>
              <label className="form-label">Potongan Harga (%)</label>
              <input
                type="number"
                name="potongan_harga"
                value={form.potongan_harga}
                onChange={handleChange}
                className="form-input"
                placeholder="10"
                min="0"
              />
              {errors.potongan_harga && (
                <span className="field-error">{errors.potongan_harga}</span>
              )}
            </div>
            <div>
              <label className="form-label">Tanggal Berakhir</label>
              <input
                type="date"
                name="tanggal_berakhir"
                value={tanggalInput}
                onChange={(e) => {
                  const iso = e.target.value; // YYYY-MM-DD
                  setForm((prev) => ({ ...prev, tanggal_berakhir: iso }));
                  setErrors((prev) => ({ ...prev, tanggal_berakhir: '' }));
                }}
                min={todayLocal}
                className="form-input"
              />
              {errors.tanggal_berakhir && (
                <span className="field-error">{errors.tanggal_berakhir}</span>
              )}
            </div>
          </div>

          <label className="form-label">Deskripsi (deskripsi_layanan)</label>
          <textarea
            name="deskripsi_layanan"
            value={form.deskripsi_layanan}
            onChange={handleChange}
            className="form-input form-textarea"
            placeholder="Deskripsi promo..."
            rows={5}
          />
          {errors.deskripsi_layanan && (
            <span className="field-error">{errors.deskripsi_layanan}</span>
          )}

          <label className="form-label">Status Promo</label>
          <div className="status-toggle">
            <button
              type="button"
              className={
                form.status_promo === 'Aktif'
                  ? 'status-btn active-on'
                  : 'status-btn'
              }
              onClick={() => setForm((prev) => ({ ...prev, status_promo: 'Aktif' }))}
            >
              Aktif
            </button>
            <button
              type="button"
              className={
                form.status_promo === 'Tidak Aktif'
                  ? 'status-btn active-off'
                  : 'status-btn'
              }
              onClick={() =>
                setForm((prev) => ({ ...prev, status_promo: 'Tidak Aktif' }))
              }
            >
              Tidak Aktif
            </button>
          </div>
          {errors.status_promo && (
            <span className="field-error">{errors.status_promo}</span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <a href="/promo" className="btn btn-outline">
          Batal
        </a>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting
            ? 'Menyimpan...'
            : mode === 'edit'
            ? 'Simpan Perubahan'
            : 'Tambah Promo'}
        </button>
      </div>
    </form>
  );
}

