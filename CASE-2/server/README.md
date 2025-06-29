# 🔧 Backend Server - Node.js + Express + TypeScript

## Teknoloji Stack'i

- **Node.js**: v22.15.1
- **Express.js**: ^4.16.1
- **TypeScript**: tsx ^4.19.4
- **MongoDB**: ^6.16.0
- **Mongoose**: ^8.15.0
- **CORS**: ^2.8.5
- **Helmet**: ^8.1.0
- **Morgan**: ^1.9.1

## Kurulum

### 1. Bağımlılıkları yükleyin

```bash
cd server
npm install
```

### 2. Ortam değişkenlerini ayarlayın

`.env` dosyası oluşturun:

```env
MONGO_URI=<ekip_ile_paylasilan_adres>
PORT=3000
```

## Çalıştırma

### Geliştirme Modu

```bash
npm run dev
```

Server `http://localhost:3000` adresinde çalışacak.

### Production Modu

```bash
npm start
```

Server `http://localhost:3000` adresinde çalışacak.

## 🌐 API Endpoints

### Base URL

```
http://localhost:3000/api/v1
```

### Kategori Endpoints

#### GET /categories

Tüm kategorileri getirir.

#### POST /categories

Yeni kategori oluşturur.

**Request Body:**

```json
{
  "name": "Kategori Adı"
}
```

### Ürün Endpoints

#### GET /products

Ürünleri getirir (pagination, search, filter desteğiyle).

**Query Parameters:**

- `page` (number): Sayfa numarası (varsayılan: 1)
- `limit` (number): Sayfa başına öğe sayısı (varsayılan: 5)
- `search` (string): Ürün adında arama
- `category` (string): Kategori ID'sine göre filtreleme

#### POST /products

Yeni ürün oluşturur.

**Request Body:**

```json
{
  "name": "Ürün Adı",
  "price": 100.5,
  "categoryId": "64f1234567890abcdef12345"
}
```
