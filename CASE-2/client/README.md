# Frontend Client - React + Vite

## Teknoloji Stack'i

- **React**: ^19.1.0
- **Vite**: ^7.0.0
- **Axios**: ^1.10.0
- **SWR**: ^2.3.3
- **Tailwind CSS**: ^4.1.11

## Kurulum

### 1. Bağımlılıkları yükleyin

```bash
cd client
npm install
```

### 2. Backend'in çalıştığından emin olun

Backend uygulamasının `http://localhost:3000` adresinde çalıştığından emin olun.

## Çalıştırma

### Geliştirme Modu

```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacak.

### Production Build

```bash
npm run build
```

### Build Önizleme

```bash
npm run preview
```

Uygulama `http://localhost:4173` adresinde çalışacak.

## Proje Yapısı

```
client/
├── public/                   # Statik dosyalar
│   ├── vite.svg             # Vite logo
├── src/
│   ├── components/          # React bileşenleri
│   │   ├── Layout.jsx           # Ana sayfa layout'u
│   │   ├── CategoryManagement.jsx  # Kategori yönetimi
│   │   ├── ProductForm.jsx         # Ürün ekleme formu
│   │   ├── ProductFilters.jsx      # Arama ve filtreleme
│   │   └── ProductList.jsx         # Ürün listesi ve pagination
│   ├── hooks/               # Custom React hooks
│   │   ├── useCategories.js     # Kategori data hook'u
│   │   └── useProducts.js       # Ürün data hook'u
│   ├── services/            # API servis katmanı
│   │   └── api.js              # Axios konfigürasyonu ve API calls
│   ├── App.jsx              # Ana uygulama bileşeni
│   ├── main.jsx             # React render noktası
│   └── index.css            # Tailwind CSS imports
├── package.json             # Proje bağımlılıkları
├── vite.config.js           # Vite konfigürasyonu
├── postcss.config.js        # PostCSS konfigürasyonu
└── eslint.config.js         # ESLint konfigürasyonu
```

## Sorun Giderme

### Bağımlılık Kurulum Sorunu

```bash
# Paketleri kaldır ve yeniden kur
rm -rf node_modules package-lock.json
npm install
```
