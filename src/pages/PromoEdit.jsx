import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PromoForm from '../components/PromoForm';
import { getPromoById, updatePromo } from '../data/PromoEndpoint';

export default function PromoEdit() {
  const { id_promo } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    getPromoById(id_promo)
      .then((data) => {
        if (!data) setNotFound(true);
        else {
          // Pastikan field yang dipakai form selalu terisi (default '')
          setInitialData({
            ...data,
            kode_promo: data.kode_promo ?? data.kodePromo ?? data.kode ?? '',
            potongan_harga: data.potongan_harga ?? data.potonganHarga ?? '',
            tanggal_berakhir: data.tanggal_berakhir ?? data.tanggalBerakhir ?? '',
            status_promo: data.status_promo ?? data.statusPromo ?? '',
            deskripsi_layanan:
              data.deskripsi_layanan ?? data.deskripsiLayanan ?? data.deskripsi ?? '',
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id_promo]);

  async function handleSubmit(data) {
    setSubmitting(true);
    try {
      await updatePromo(id_promo, data);
      navigate('/promo');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="promo-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Promo</h1>
          <p className="page-subtitle">Perbarui data promo</p>
        </div>
      </div>

      {loading ? (
        <p className="empty-state">Memuat data...</p>
      ) : notFound ? (
        <p className="empty-state">Promo tidak ditemukan.</p>
      ) : (
        <PromoForm
          mode="edit"
          initialData={initialData}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </div>
  );
}

