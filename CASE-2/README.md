# Ürün Yönetim Sistemi

Modern React ve Node.js teknolojileri ile geliştirilmiş full stack ürün yönetim sistemi.

## İçindekiler

- [Teknoloji Stack'i](#teknoloji-stacki)
- [Test Edilen Sistemler](#test-edilen-sistemler)
- [Kurulum](#kurulum)
- [API Dokümantasyonu](#api-dokümantasyonu)
- [Ortam Değişkenleri](#ortam-değişkenleri)
- [Kullanılabilir Script'ler](#kullanılabilir-scriptler)

## Teknoloji Stack'i

### Backend

- **Node.js** v22.15.1
- **Express.js** ^4.16.1
- **TypeScript** (tsx ^4.19.4)
- **MongoDB** ^6.16.0
- **Mongoose** ^8.15.0

### Frontend

- **React** ^19.1.0
- **Vite** ^7.0.0
- **Axios** ^1.10.0
- **SWR** ^2.3.3
- **Tailwind CSS** ^4.1.11

## Test Edilen Sistemler

- **Node.js**: v22.15.1
- **npm**: v10+
- **Port'lar**:
  - Backend: `3000`
  - Frontend(dev): `5173`
  - Frontend(prev): `4173`

## Kurulum

### 1. MongoDB Atlas Konfigürasyonu

- `MONGO_URI` ortam değişkeni teknik ekiple paylaşılacaktır.

### 2. Projeyi klonlayın

```bash
git clone <repository-url>
cd cuhadaroglu/CASE-2
```

### 3. Bağımlılıkları yükleyin (Terminalde CASE-2 klasörüne konumlandıktan sonra)

```bash
npm run install:all
```

Bu komut hem client hem server için gerekli paketleri yükleyecektir.

### 4. Projeyi başlatın (Terminalde CASE-2 klasörüne konumlandıktan sonra)

#### Hem backend hem frontend'i birlikte başlatın (önerilen):

```bash
npm run dev
```

Bu komut her iki serveri de paralel olarak başlatır:

- **Backend**: `http://localhost:3000`
- **Frontend**: `http://localhost:5173`

#### Alternatif: Ayrı ayrı başlatma

**Sadece backend için:**

```bash
npm run dev:server
```

**Sadece frontend için:**

```bash
npm run dev:client
```

### 5. Production build (opsiyonel)

```bash
npm run build
```

### 6. Preview modunda çalıştırma (opsiyonel)

```bash
npm run preview
```

Bu komut client'i preview modunda (`http://localhost:4173`) ve server'ı production modunda başlatır:

- **Backend**: `http://localhost:3000`
- **Frontend**: `http://localhost:4173`

## API Dokümantasyonu

### Base URL

```
http://localhost:3000/api/v1
```

### Kategori Endpoints

- `GET /categories` - Tüm kategorileri getir
- `POST /categories` - Yeni kategori oluştur

### Ürün Endpoints

- `GET /products` - Ürünleri getir (pagination, search, filter)
- `POST /products` - Yeni ürün oluştur

### Query Parameters (Products)

- `page` - Sayfa numarası (varsayılan: 1)
- `limit` - Sayfa başına öğe sayısı (varsayılan: 5)
- `search` - Ürün adında arama
- `category` - Kategori ID'sine göre filtreleme

## Ortam Değişkenleri

### Server (.env)

`CASE-2/server/` klasörüne konumlandıktan sonra `.env` dosyası oluşturun.

```env
MONGO_URI=<ekip_ile_paylasilan_adres>
PORT=3000
```

## Kullanılabilir Scriptler

### Kurulum ve Başlatma

- `npm run install:all` - Hem client hem server bağımlılıklarını yükler
- `npm run dev` - Her iki serveri paralel başlatır
- `npm run dev:client` - Sadece frontend'i başlatır
- `npm run dev:server` - Sadece backend'i başlatır

### Build ve Production

- `npm run build` - Client build'ini oluşturur (Server için gerekli değil.)

### Preview

- `npm run preview` - Client preview + server production modunu başlatır
- `npm run preview:client` - Sadece client production modunu başlatır
- `npm run preview:server` - Sadece server production modunu başlatır
