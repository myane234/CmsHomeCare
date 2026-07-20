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

  useEffect(() => {
    getPromoById(id_promo).then(setInitialData).finally(() => setLoading(false));
  }, [id_promo]);

  async function handleSubmit(data) {
    setSubmitting(true);
    try {
      await updatePromo(id_promo, data);
      navigate('/promo');
    } catch (e) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-6">Memuat...</div>;

  return (
    <div>
      <div className="mb-5">
        <h1 className="page-title">Edit Promo</h1>
        <p className="page-subtitle">Perbarui paket promo dan layanan yang terhubung</p>
      </div>

      <PromoForm initialData={initialData} onSubmit={handleSubmit} submitting={submitting} mode="edit" />
    </div>
  );
}