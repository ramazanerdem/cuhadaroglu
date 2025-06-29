/**
 * ANA UYGULAMA BİLEŞENİ
 *
 * Profil tasarım uygulamasının ana koordinatör bileşeni.
 * Tüm alt bileşenleri yönetir, state'i koordine eder ve kullanıcı
 * arayüzünün genel düzenini sağlar. Microfrontend mimarisi prensiplerine
 * uygun olarak modüler yapıda tasarlanmıştır.
 */

import { useRef } from 'react'
import type { PaperCanvasRef } from './types'
import { useDrawingState } from './hooks/useDrawingState'
import PaperCanvas from './components/PaperCanvas'
import ParameterPanel from './components/ParameterPanel'
import CustomDividersPanel from './components/CustomDividersPanel'
import ControlPanel from './components/ControlPanel'
import OverlapWarning from './components/OverlapWarning'

/**
 * ANA UYGULAMA FONKSİYONU
 *
 * Hook'lar ve ref'ler ile state yönetimi ve bileşen koordinasyonu yapar.
 */
function App() {
  // PAPER.JS CANVAS REFERANSI
  /** PaperCanvas bileşenine erişim için ref - export ve redraw işlemleri için */
  const canvasRef = useRef<PaperCanvasRef>(null)

  // MERKEZI STATE YÖNETİMİ
  /** useDrawingState hook'u ile tüm uygulama state'i */
  const {
    // State değerleri
    parameters, // Çizim parametreleri (boyutlar, profil sayıları, kalınlıklar)
    customDividers, // Kullanıcının eklediği özel profiller
    horizontalOverlaps, // Yatay profil çakışma uyarıları
    verticalOverlaps, // Dikey profil çakışma uyarıları
    thicknessWarnings, // Geometrik kalınlık uyarıları

    // State güncelleyici fonksiyonları
    updateParameter, // Tek parametre güncelleme
    addCustomDivider, // Özel profil ekleme
    removeCustomDivider, // Özel profil silme
    setOverlaps, // Çakışma uyarıları güncelleme
    resetToDefaults, // Varsayılan değerlere dönüş
  } = useDrawingState()

  /**
   * ÇAKIŞMA UYARILARI GÜNCELLEME HANDLER'I
   *
   * PaperCanvas'dan gelen çakışma tespit sonuçlarını state'e aktarır.
   * Üç farklı uyarı kategorisini (yatay, dikey, kalınlık) ayrı ayrı yönetir.
   *
   * @param horizontal - Yatay profil çakışma uyarıları
   * @param vertical - Dikey profil çakışma uyarıları
   * @param thickness - Kalınlık/geometrik uyarılar
   */
  const handleOverlapsDetected = (
    horizontal: string[],
    vertical: string[],
    thickness: string[]
  ) => {
    setOverlaps(horizontal, vertical, thickness)
  }

  /**
   * SVG EXPORT HANDLER'I
   *
   * Mevcut çizimi SVG formatında export eder ve kullanıcıya indirir.
   * PaperCanvas ref'i üzerinden exportSVG metodunu çağırır.
   */
  const handleExportSVG = () => {
    if (canvasRef.current) {
      const svgContent = canvasRef.current.exportSVG()

      // SVG dosyası için Blob oluştur
      const blob = new Blob([svgContent], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)

      // İndirme linkini otomatik tetikle
      const link = document.createElement('a')
      link.href = url
      link.download = `profil-tasarim-${Date.now()}.svg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Bellek temizliği
      URL.revokeObjectURL(url)
    }
  }

  /**
   * TOPLU UYARI LİSTESİ HAZIRLIĞI
   *
   * Farklı kategorilerdeki uyarıları OverlapWarning bileşeni için
   * tek bir liste halinde birleştirir.
   */
  const allWarnings = [
    // Yatay çakışma uyarıları
    ...(horizontalOverlaps.length > 0
      ? [{ type: 'horizontal' as const, items: horizontalOverlaps }]
      : []),
    // Dikey çakışma uyarıları
    ...(verticalOverlaps.length > 0
      ? [{ type: 'vertical' as const, items: verticalOverlaps }]
      : []),
    // Kalınlık/geometrik uyarılar
    ...(thicknessWarnings.length > 0
      ? [{ type: 'thickness' as const, items: thicknessWarnings }]
      : []),
  ]

  return (
    <div className="h-screen bg-gradient-to-br from-zinc-900 via-neutral-900 to-black flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* SOL KENAR ÇUBUĞu - KONTROL PANELLERİ */}
        <div className="w-96 flex-none bg-gradient-to-b from-zinc-900 to-black border-r-4 border-zinc-600 overflow-y-auto sidebar-scroll">
          <div className="p-4 space-y-4">
            {/* PARAMETRE KONTROL PANELİ */}
            <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border-4 border-zinc-600 shadow-brutal">
              {/* Panel başlığı */}
              <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 border-b-2 border-zinc-500 p-3">
                <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
                  Tasarım Parametreleri
                </h2>
              </div>

              {/* Parametre kontrolleri */}
              <div className="p-4">
                <ParameterPanel
                  parameters={parameters}
                  onParameterChange={updateParameter}
                />
              </div>
            </div>

            {/* ÖZEL PROFİL EKLEME PANELİ */}
            <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border-4 border-zinc-600 shadow-brutal">
              {/* Panel başlığı */}
              <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 border-b-2 border-zinc-500 p-3">
                <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
                  ➕ Özel Profil Yönetimi
                </h2>
              </div>

              {/* Özel profil kontrolleri */}
              <div className="p-4">
                <CustomDividersPanel
                  customDividers={customDividers}
                  parameters={parameters}
                  onAddDivider={addCustomDivider}
                  onRemoveDivider={removeCustomDivider}
                />
              </div>
            </div>

            {/* SIFIRLAMA VE DIŞA AKTARMA */}
            <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border-4 border-zinc-600 shadow-brutal">
              {/* Panel başlığı */}
              <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 border-b-2 border-zinc-500 p-3">
                <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
                  Sıfırlama ve Dışa Aktarma
                </h2>
              </div>

              {/* Kontrol butonları ve bilgi gösterimi */}
              <div className="p-4">
                <ControlPanel
                  parameters={parameters}
                  customDividers={customDividers}
                  onExportSVG={handleExportSVG}
                  onResetToDefaults={resetToDefaults}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ TARAF - ÇİZİM ALANI */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Çizim canvas container'ı */}
          <div className="flex-1 bg-gradient-to-b from-zinc-800 to-zinc-900 border-4 border-zinc-600 shadow-brutal m-4 flex flex-col max-h-[calc(100vh-30px)]">
            {/* Canvas başlık barı */}
            <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 border-b-2 border-zinc-500 p-3 flex-none">
              <h1 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
                Teknik Çizim
              </h1>
            </div>

            {/* Ana çizim canvas'ı */}
            <div className="flex-1 p-4 overflow-hidden">
              <PaperCanvas
                ref={canvasRef}
                parameters={parameters}
                customDividers={customDividers}
                onOverlapsDetected={handleOverlapsDetected}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SABİT KONUMLU UYARI SİSTEMİ */}
      {/* Ekranın sağ üst köşesinde, çizim alanının üzerinde gösterilir */}
      <OverlapWarning warnings={allWarnings} />
    </div>
  )
}

export default App
