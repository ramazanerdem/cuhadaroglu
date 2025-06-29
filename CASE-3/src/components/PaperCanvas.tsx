/**
 * PAPER.JS CANVAS BİLEŞENİ
 *
 * Bu bileşen, Paper.js kütüphanesi ile vektörel çizim yapabilmek için
 * HTML Canvas elementini React'e entegre eder. Profil çizimlerinin
 * görselleştirildiği ana ekran alanıdır.
 */

import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import type { DrawingParameters, CustomDivider, PaperCanvasRef } from '../types'
import { DrawingEngine } from '../utils/drawingEngine'

/**
 * CANVAS BİLEŞEN PROPS TİPLERİ
 *
 * Parent bileşenlerden alınan parametreler ve callback fonksiyonları.
 */
interface PaperCanvasProps {
  /** Mevcut çizim parametreleri - gerçek zamanlı güncellenir */
  parameters: DrawingParameters

  /** Kullanıcının eklediği özel profiller listesi */
  customDividers: CustomDivider[]

  /** Çakışma uyarıları tespit edildiğinde çağrılan callback */
  onOverlapsDetected: (
    horizontalOverlaps: string[],
    verticalOverlaps: string[],
    thicknessWarnings: string[]
  ) => void
}

/**
 * ANA PAPER CANVAS BİLEŞENİ
 *
 * forwardRef ile sarılmış - parent bileşenler ref üzerinden metodlara erişebilir.
 * DrawingEngine sınıfını yönetir ve Paper.js yaşam döngüsünü koordine eder.
 */
const PaperCanvas = forwardRef<PaperCanvasRef, PaperCanvasProps>(
  ({ parameters, customDividers, onOverlapsDetected }, ref) => {
    /** HTML Canvas DOM elemanına referans */
    const canvasRef = useRef<HTMLCanvasElement>(null)

    /** DrawingEngine sınıf instance'ına referans - çizim işlemleri için */
    const drawingEngineRef = useRef<DrawingEngine | null>(null)

    /**
     * PARENT BİLEŞENLERE AÇILAN ARAYÜZ
     *
     * useImperativeHandle ile parent'ların çağırabileceği metodları expose eder.
     * Bu sayede App.tsx gibi parent bileşenler canvas'ı kontrol edebilir.
     */
    useImperativeHandle(ref, () => ({
      /**
       * ÇİZİMİ YENİDEN OLUŞTUR
       * Mevcut parametrelerle çizimi sıfırdan çizer
       */
      redraw: () => {
        if (drawingEngineRef.current) {
          const { overlaps } = drawingEngineRef.current.drawFrame(
            parameters,
            customDividers
          )

          // Tespit edilen çakışmaları kategorilere ayır ve parent'a bildir
          const horizontalOverlaps: string[] = []
          const verticalOverlaps: string[] = []
          const thicknessWarnings: string[] = []

          overlaps.forEach((overlap) => {
            if (overlap.type === 'horizontal') {
              // Kalınlık uyarıları özel işaret içerirse thickness kategorisine at
              if (
                overlap.items.some(
                  (item) =>
                    item.includes('kalınlık') || item.includes('thickness')
                )
              ) {
                thicknessWarnings.push(...overlap.items)
              } else {
                horizontalOverlaps.push(...overlap.items)
              }
            } else {
              verticalOverlaps.push(...overlap.items)
            }
          })

          onOverlapsDetected(
            horizontalOverlaps,
            verticalOverlaps,
            thicknessWarnings
          )
        }
      },

      /**
       * CANVAS'I TEMİZLE
       * Tüm çizim elemanlarını siler, boş canvas bırakır
       */
      clear: () => {
        if (drawingEngineRef.current) {
          drawingEngineRef.current.clear()
        }
      },

      /**
       * SVG FORMATINDA EXPORT
       * Mevcut çizimi SVG string olarak döndürür
       */
      exportSVG: () => {
        if (drawingEngineRef.current) {
          return drawingEngineRef.current.exportSVG()
        }
        return ''
      },
    }))

    /**
     * COMPONENT MOUNT HOOK'U
     *
     * Canvas DOM elementine erişim sağlandığında DrawingEngine'i başlatır.
     * Component unmount olduğunda bellek temizliği yapar.
     */
    useEffect(() => {
      if (!canvasRef.current) return

      // DrawingEngine instance'ını oluştur
      drawingEngineRef.current = new DrawingEngine(canvasRef.current)

      // Component unmount edildiğinde temizlik yap
      return () => {
        if (drawingEngineRef.current) {
          drawingEngineRef.current.destroy() // Paper.js projesi temizliği
          drawingEngineRef.current = null
        }
      }
    }, [])

    /**
     * PARAMETRE DEĞİŞİKLİK HOOK'U
     *
     * Parameters veya customDividers değiştiğinde çizimi otomatik günceller.
     * Gerçek zamanlı güncelleme sistemi için kritik hook.
     */
    useEffect(() => {
      if (drawingEngineRef.current) {
        // Yeni parametrelerle çizimi güncelle
        const { overlaps } = drawingEngineRef.current.drawFrame(
          parameters,
          customDividers
        )

        // Çakışma analizini kategorilere ayır
        const horizontalOverlaps: string[] = []
        const verticalOverlaps: string[] = []
        const thicknessWarnings: string[] = []

        overlaps.forEach((overlap) => {
          if (overlap.type === 'horizontal') {
            // Kalınlık uyarılarını ayırt et
            if (
              overlap.items.some(
                (item) =>
                  item.includes('kalınlık') || item.includes('thickness')
              )
            ) {
              thicknessWarnings.push(...overlap.items)
            } else {
              horizontalOverlaps.push(...overlap.items)
            }
          } else {
            verticalOverlaps.push(...overlap.items)
          }
        })

        // Parent bileşene çakışma durumunu bildir
        onOverlapsDetected(
          horizontalOverlaps,
          verticalOverlaps,
          thicknessWarnings
        )
      }
    }, [parameters, customDividers, onOverlapsDetected])

    /**
     * BİLEŞEN RENDER ÇIKTISI
     *
     * Sadece HTML Canvas elementi döndürür - tüm çizim Paper.js tarafından yapılır.
     * CSS sınıfları ile styling ve responsive davranış sağlanır.
     */
    return (
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-white rounded-lg shadow-lg border-2 border-zinc-400"
        style={{
          display: 'block', // Canvas default inline davranışını override et
          touchAction: 'none', // Mobil cihazlarda zoom/pan'i devre dışı bırak
        }}
      />
    )
  }
)

// React DevTools için görünen isim ayarla
PaperCanvas.displayName = 'PaperCanvas'

export default PaperCanvas
