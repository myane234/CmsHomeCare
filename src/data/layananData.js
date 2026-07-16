// Mock "database" for Layanan (services), persisted in localStorage.
// Replace these functions with real fetch()/axios calls to your API later —
// the function signatures are already shaped like an async API client.

const STORAGE_KEY = 'cmsHomeCare_layanan';

const initialData = [
  {
    id: 1,
    nama: 'Ibu & Anak',
    kategori: 'Ibu & Anak',
    deskripsi: 'Layanan kesehatan untuk ibu hamil, menyusui, dan bayi langsung di rumah.',
    harga: 250000,
    durasi: 60,
    status: 'aktif',
    gambar: '',
  },
  {
    id: 2,
    nama: 'Perawatan Luka',
    kategori: 'Perawatan Luka',
    deskripsi: 'Perawatan luka diabetes, luka bakar, dan luka pasca operasi oleh tenaga profesional.',
    harga: 200000,
    durasi: 45,
    status: 'aktif',
    gambar: '',
  },
  {
    id: 3,
    nama: 'Medical Checkup',
    kategori: 'Medical Checkup',
    deskripsi: 'Pemeriksaan kesehatan rutin (MCU) langsung di rumah Anda.',
    harga: 350000,
    durasi: 90,
    status: 'aktif',
    gambar: '',
  },
  {
    id: 4,
    nama: 'Fisioterapi',
    kategori: 'Fisioterapi',
    deskripsi: 'Fisioterapi muskuloskeletal, ortopedi, geriatri, dan pasca operasi.',
    harga: 275000,
    durasi: 60,
    status: 'nonaktif',
    gambar: '',
  },
];

function readAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(raw);
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Simulate network latency so loading states are visible
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAllLayanan() {
  await delay();
  return readAll();
}

export async function getLayananById(id) {
  await delay();
  const data = readAll();
  return data.find((item) => String(item.id) === String(id)) || null;
}

export async function createLayanan(payload) {
  await delay();
  const data = readAll();
  const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
  const newItem = { id: newId, ...payload };
  const updated = [...data, newItem];
  writeAll(updated);
  return newItem;
}

export async function updateLayanan(id, payload) {
  await delay();
  const data = readAll();
  const updated = data.map((item) =>
    String(item.id) === String(id) ? { ...item, ...payload, id: item.id } : item
  );
  writeAll(updated);
  return updated.find((item) => String(item.id) === String(id));
}

export async function deleteLayanan(id) {
  await delay();
  const data = readAll();
  const updated = data.filter((item) => String(item.id) !== String(id));
  writeAll(updated);
  return true;
}
