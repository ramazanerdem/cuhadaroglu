/**
 * PROFİL TASARIM UYGULAMASI - TİP TANIMLARI
 *
 * Bu dosya uygulamada kullanılan tüm TypeScript tiplerini tanımlar.
 * Profiller için parametrik çizim sistemi tiplerini içerir.
 */

/**
 * ANA ÇİZİM PARAMETRELERİ
 *
 * Çrçeve tasarımı için gerekli tüm ölçü ve sayısal değerleri içerir.
 * Bu parametreler kullanıcı tarafından gerçek zamanlı olarak değiştirilebilir.
 */
export interface DrawingParameters {
  /** Ana çerçeve genişliği (milimetre cinsinden) */
  width: number

  /** Ana çerçeve yüksekliği (milimetre cinsinden) */
  height: number

  /** Otomatik yerleştirilen dikey profil sayısı */
  verticalDividers: number

  /** Otomatik yerleştirilen yatay profil sayısı */
  horizontalDividers: number

  /** Her bir profilin genişliği (milimetre cinsinden) */
  profileWidth: number

  /** Her bir profilin yüksekliği (milimetre cinsinden) */
  profileHeight: number

  /** Profil iç çerçeve kalınlığı - malzeme kalınlığı (milimetre cinsinden) */
  profileThickness: number
}

/**
 * ÖZEL BÖLÜCÜ PROFIL TANIMI
 *
 * Kullanıcının standart ızgara dışında eklediği özel konumlu profilleri temsil eder.
 * Bu profiller belirli mesafelerde manuel olarak yerleştirilir.
 */
export interface CustomDivider {
  /** Özel profilin benzersiz kimliği - veritabanı ve takip için */
  id: string

  /** Profil türü: 'vertical' (dikey) veya 'horizontal' (yatay) */
  type: 'vertical' | 'horizontal'

  /**
   * Profilin konumu (milimetre cinsinden):
   * - Dikey profiller için: Sol kenardan olan mesafe
   * - Yatay profiller için: Alt kenardan olan yükseklik
   */
  position: number

  /** Kullanıcının bu profile verdiği isim/etiket */
  label: string
}

/**
 * UYGULAMA DURUMU YÖNETİMİ
 *
 * Uygulamanın tüm anlık durumunu tutan ana veri yapısı.
 * React state yönetimi için kullanılır.
 */
export interface DrawingState {
  /** Mevcut çizim parametreleri */
  parameters: DrawingParameters

  /** Kullanıcının eklediği özel profiller listesi */
  customDividers: CustomDivider[]

  /** Yatay profillerde tespit edilen çakışma uyarıları */
  horizontalOverlaps: string[]

  /** Dikey profillerde tespit edilen çakışma uyarıları */
  verticalOverlaps: string[]

  /** Profil kalınlığı ile ilgili geometrik uyarılar */
  thicknessWarnings: string[]

  /** Şu anda çizim işlemi devam ediyor mu? (loading durumu) */
  isDrawing: boolean
}

/**
 * PAPER.JS CANVAS REFERANSI
 *
 * PaperCanvas bileşeninin dış dünyaya açtığı fonksiyonları tanımlar.
 * Bu interface ile parent bileşenler canvas'ı kontrol edebilir.
 */
export interface PaperCanvasRef {
  /** Mevcut parametrelerle çizimi yeniden oluştur */
  redraw: () => void

  /** Canvas'ı tamamen temizle, tüm çizimleri sil */
  clear: () => void

  /** Mevcut çizimi SVG formatında export et ve string olarak dön */
  exportSVG: () => string
}
