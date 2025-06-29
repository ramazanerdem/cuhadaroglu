/**
 * UYGULAMA GİRİŞ NOKTASI (ENTRY POINT)
 *
 * React uygulamasının başlangıç dosyası. DOM'a React uygulamasını mount eder
 * ve gerekli global konfigürasyonları yapar. StrictMode ile development
 * ortamında ek kontroller sağlar.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * ROOT ELEMENT REFERANSI
 *
 * HTML dosyasında tanımlı 'root' id'li div elementini bulur.
 * Bu element, React uygulamasının DOM'a render edileceği container'dır.
 */
const rootElement = document.getElementById('root')

// Root element'in varlığını kontrol et - TypeScript type safety için
if (!rootElement) {
  throw new Error(
    'Root element bulunamadı! HTML dosyasında id="root" olan div elementinin var olduğundan emin olun.'
  )
}

/**
 * REACT ROOT OLUŞTURMA VE MOUNT İŞLEMİ
 *
 * React 18'in yeni createRoot API'si ile uygulamayı mount eder.
 * StrictMode ile development ortamında ek güvenlik kontrolleri sağlar:
 * - Component'ları iki kez render eder (side effect tespiti için)
 * - Deprecated API kullanımları konusunda uyarır
 * - Concurrent Mode özelliklerini aktif eder
 */
createRoot(rootElement).render(
  <StrictMode>
    {/* Ana uygulama bileşeni */}
    <App />
  </StrictMode>
)
