import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PromoForm from '../components/PromoForm';
import { createPromo } from '../data/PromoEndpoint';

export default function PromoTambah() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(data) {
    setSubmitting(true);
    try {
      await createPromo(data);
      navigate('/promo');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="promo-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tambah Promo</h1>
          <p className="page-subtitle">Tambahkan promo HomeCare baru</p>
        </div>
      </div>

      <PromoForm mode="tambah" onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}

