# Parametre Tabanlı Çizim Yönetimi Uygulaması

Çuhadaroğlu Alüminyum için geliştirilmiş, **Paper.js** tabanlı parametrik profil çizim uygulaması. Kapı ve pencere çerçeveleri için teknik çizimler oluşturan, gerçek zamanlı parametre kontrolü sağlayan modern web uygulaması.

## Proje Özellikleri

### Ana Özellikler

- **Parametrik Tasarım**: Gerçek zamanlı boyut ve profil kontrolü
- **Paper.js Entegrasyonu**: Vektörel çizim ve SVG export desteği
- **Çakışma Tespit Sistemi**: Otomatik profil çakışma uyarıları
- **Özel Profil Yönetimi**: Manuel profil ekleme ve silme
- **Türkçe Arayüz**: Tam Türkçe kullanıcı deneyimi
- **Responsive Tasarım**: Tüm ekran boyutlarında çalışma desteği

### Teknik Özellikler

- **Framework**: React 18 + TypeScript
- **Çizim Motoru**: Paper.js
- **Styling**: TailwindCSS + Brutal/Industrial tema
- **State Management**: Custom React hooks
- **Modüler Mimari**: Microfrontend prensipleri
- **Export Format**: SVG (vektörel, scalable)

## Proje Mimarisi

### Dizin Yapısı

```
src/
├── components/          # React bileşenleri
│   ├── PaperCanvas.tsx     # Paper.js canvas wrapper
│   ├── ParameterPanel.tsx  # Parametre kontrol paneli
│   ├── CustomDividersPanel.tsx # Özel profil ekleme paneli
│   ├── ControlPanel.tsx    # Kontrol butonları ve bilgi paneli
│   └── OverlapWarning.tsx  # Çakışma uyarı sistemi
├── hooks/               # Custom React hooks
│   └── useDrawingState.ts  # Merkezi state yönetimi
├── utils/               # Yardımcı sınıflar
│   └── drawingEngine.ts    # Paper.js çizim motoru
├── types/               # TypeScript tip tanımları
│   └── index.ts            # Tüm interface'ler
├── App.tsx             # Ana uygulama bileşeni
├── main.tsx            # Uygulama giriş noktası
└── index.css           # Global stil tanımları
```

### Bileşen Hiyerarşisi

```
App
├── ParameterPanel          # Sol panel - parametre kontrolleri
├── CustomDividersPanel     # Sol panel - özel profil yönetimi
├── ControlPanel           # Sol panel - kontrol butonları
├── PaperCanvas           # Sağ panel - çizim alanı
└── OverlapWarning        # Floating - uyarı sistemi
```

## Parametre Sistemi

### Ana Çizim Parametreleri

- **Boyutlar**: Çerçeve genişliği ve yüksekliği (mm)
- **Profil Sayıları**: Otomatik dikey ve yatay profil sayıları
- **Profil Ölçüleri**: Her profilin genişlik ve yükseklik değerleri (mm)
- **Profil Kalınlığı**: Profil iç çerçeve kalınlığı (0.1mm hassasiyetinde)

### Özel Profil Sistemi

- **Manuel Konumlama**: Piksel bazında hassas yerleştirme
- **Çakışma Kontrolü**: Otomatik overlap tespiti
- **Etiketleme**: Her profil için özel isim sistemi
- **Dinamik Hesaplama**: Anlık mesafe ve ölçü güncellemeleri

## Görsel Sistem

### Renk Kodlaması

- **Siyah**: Ana çerçeve konturu
- **Kırmızı**: Dikey profiller
- **Mavi**: Yatay profiller
- **Turuncu**: Özel dikey profiller
- **Mor**: Özel yatay profiller
- **Siyah kesikli**: Referans hatları (profil merkezleri)
- **Gri kesikli**: Kalınlık hatları

### Ölçüm Sistemleri

- **Mesafe Etiketleri**: Profil merkezleri arası ölçümler
- **Boyut Etiketleri**: Ana çerçeve dış ölçüleri
- **Kalınlık Etiketleri**: Malzeme kalınlığı (t:Xmm formatında)
- **Konum Gösterimi**: Sol-üst köşe (0,0) referans sistemi

## Teknoloji Detayları

### Paper.js Çizim Motoru

```typescript
class DrawingEngine {
  // Ana Paper.js projesi yönetimi
  private project: paper.Project

  // Çizim grupları organizasyonu
  private mainGroup: paper.Group // Profiller
  private labelsGroup: paper.Group // Etiketler

  // Çakışma tespit algoritması
  private detectOverlaps(): void

  // SVG export işlevi
  public exportSVG(): string
}
```

### State Yönetimi

```typescript
const useDrawingState = () => {
  // Ana parametre state'i
  const [parameters, setParameters] = useState<DrawingParameters>()

  // Özel profiller state'i
  const [customDividers, setCustomDividers] = useState<CustomDivider[]>()

  // Uyarı sistemleri state'i
  const [overlaps, setOverlaps] = useState<OverlapData>()
}
```

### TypeScript Tip Sistemi

- **DrawingParameters**: Ana çizim parametreleri
- **CustomDivider**: Özel profil tanımları
- **OverlapData**: Çakışma bilgileri
- **PaperCanvasRef**: Canvas referans yönetimi

## Geliştirme

### Kurulum

```bash
# Proje klonlama
git clone [repository-url]
cd CASE-3

# Bağımlılıkları yükleme
npm install

# Development server başlatma
npm run dev
```

### Build Process

```bash
# Production build
npm run build

# Linting
npm run lint
```

### Bağımlılıklar

```json
{
  "react": "^19.1.0",
  "paper": "^0.12.18",
  "typescript": "~5.8.3",
  "tailwindcss": "^4.1.11",
  "vite": "^7.0.0"
}
```

## Performans Optimizasyonları

### Canvas Performansı

- **Efficient Rendering**: Paper.js view update optimizasyonu
- **Group Management**: Çizim elementlerinin verimli gruplandırması
- **Memory Management**: Component cleanup ve Paper.js project disposal

### State Optimizasyonları

- **useCallback**: Event handler memoization
- **Debounced Updates**: Parametre değişikliklerinde throttling
- **Selective Re-renders**: Bileşen bazında re-render kontrolü

### Bundle Optimizasyonları

- **Tree Shaking**: Kullanılmayan kod eliminasyonu
- **Code Splitting**: Lazy loading desteği
- **Asset Optimization**: SVG ve stil optimizasyonu

## Uyarı ve Doğrulama Sistemi

### Çakışma Tespiti

- **Horizontal Overlap**: Yatay profillerin üst üste binme kontrolü
- **Vertical Overlap**: Dikey profillerin üst üste binme kontrolü
- **Real-time Detection**: Parametre değişiminde anlık tespit

### Geometrik Doğrulama

- **Boundary Checking**: Profillerin çerçeve sınırları içinde kalma kontrolü
- **Thickness Validation**: Profil kalınlık sınır kontrolleri
- **Position Validation**: Özel profil konum doğrulaması

### Kullanıcı Bildirimi

- **Non-intrusive Warnings**: Kesintisiz uyarı kartları
- **Categorized Alerts**: Uyarı türüne göre renk kodlaması
- **Actionable Messages**: Çözüm önerileri ile detaylı mesajlar

## Responsive Tasarım

### Ekran Boyutları

- **Desktop**: 1920px+ (Optimal deneyim)
- **Laptop**: 1366px-1919px (Tam özellik)
- **Tablet**: 768px-1365px (Uyarlanmış arayüz)
- **Mobile**: <768px (İşlevsiz!)

### Layout Adaptasyonu

- **Flexible Panels**: Ekran boyutuna göre panel genişlik ayarı
- **Responsive Canvas**: Çizim alanının dinamik boyutlandırması

Bu proje **Çuhadaroğlu** için özel geliştirilmiş bir uygulamadır.

---

**Geliştirici**: Ramazan ERDEM
**Tarih**: 29.06.2025  
**Versiyon**: 1.0.0  
**Framework**: React + TypeScript + Paper.js
