/**
 * PROFİL ÇİZİM MOTORU
 *
 * Bu dosya Paper.js kullanarak çerçevelerinin teknik çizimlerini
 * oluşturan ana çizim motorunu içerir. Parametrik tasarım, gerçek zamanlı güncelleme,
 * çakışma tespit sistemi ve SVG export özelliklerini destekler.
 */

import paper from 'paper'
import type { DrawingParameters, CustomDivider } from '../types'

/**
 * ANA ÇİZİM MOTORU SINIFI
 *
 * Paper.js kütüphanesini kullanarak vektörel çizim işlemlerini yönetir.
 * Profillerin konumlandırılması, ölçülendirme, çakışma tespiti ve
 * SVG export işlemlerinden sorumludur.
 */
export class DrawingEngine {
  /** Paper.js ana proje referansı - tüm çizim elemanlarını içerir */
  private project: paper.Project

  /** Ana çizim grubu - profiller ve çerçeveler bu gruba eklenir */
  private mainGroup: paper.Group

  /** Etiket grubu - ölçü ve isim etiketleri bu gruba eklenir */
  private labelsGroup: paper.Group

  /**
   * Tespit edilen çakışma listesi - gerçek zamanlı olarak güncellenir
   * Her çakışma grubu, türü ve etkilenen profil isimlerini içerir
   */
  private overlaps: Array<{
    type: 'horizontal' | 'vertical' // Çakışma türü: yatay veya dikey
    items: string[] // Çakışan profillerin isimleri
  }> = []

  /**
   * ÇİZİM MOTORU KURUCU FONKSİYONU
   *
   * HTML Canvas elementini alarak Paper.js projesini başlatır.
   * Çizim ve etiket gruplarını oluşturur.
   *
   * @param canvas - Çizimin yapılacağı HTML Canvas elementi
   */
  constructor(canvas: HTMLCanvasElement) {
    // Paper.js projesini canvas ile bağla
    this.project = new paper.Project(canvas)

    // Çizim gruplarını oluştur - organizasyon için ayrı gruplar
    this.mainGroup = new paper.Group() // Ana çizim elemanları
    this.labelsGroup = new paper.Group() // Ölçü ve etiketler
  }

  /**
   * CANVAS TEMİZLEME FONKSİYONU
   *
   * Mevcut tüm çizim elemanlarını ve uyarıları temizler.
   * Yeni çizim öncesi canvas'ı sıfırlamak için kullanılır.
   */
  public clear(): void {
    this.mainGroup.removeChildren() // Tüm çizim elemanlarını sil
    this.labelsGroup.removeChildren() // Tüm etiketleri sil
    this.overlaps = [] // Çakışma listesini temizle
  }

  /**
   * ANA ÇERÇEVE ÇİZİM FONKSİYONU
   *
   * Verilen parametreler ve özel bölücüler ile çerçeve çizimini oluşturur.
   * Bu fonksiyon çizim motorunun kalbidir ve tüm çizim süreçlerini koordine eder.
   *
   * @param params - Çizim parametreleri (boyutlar, profil sayıları, kalınlıklar)
   * @param customDividers - Kullanıcının eklediği özel konumlu profiller
   * @returns Tespit edilen çakışma uyarıları listesi
   */
  public drawFrame(
    params: DrawingParameters,
    customDividers: CustomDivider[]
  ): { overlaps: Array<{ type: 'horizontal' | 'vertical'; items: string[] }> } {
    // Canvas view'ını güncelle (Paper.js performans optimizasyonu)
    if (paper.view) {
      paper.view.update()
    }

    // Önceki çizimi temizle
    this.clear()

    const { width, height } = params

    // 1. ADIM: Ana çerçeveyi çiz (sadece dış hat)
    this.drawMainFrame(width, height)

    // 2. ADIM: Tüm profilleri (otomatik + özel) hesapla ve çiz
    this.drawAllDividers(params, customDividers)

    // 3. ADIM: Ölçü etiketlerini ve isimlerini ekle
    this.addLabels(params, customDividers)

    // 4. ADIM: Profil çakışmalarını ve geometrik sorunları tespit et
    this.detectOverlaps(params, customDividers)

    // 5. ADIM: Çizimi ekranın ortasına getir ve ölçeklendir
    this.centerDrawing()

    // Son view güncellemesi - çizimi ekrana yansıt
    if (paper.view) {
      paper.view.update()
    }

    // Tespit edilen çakışmaları döndür
    return { overlaps: this.overlaps }
  }

  /**
   * ANA ÇERÇEVE KONTUR ÇİZİMİ
   *
   * Çerçevenin dış konturu olan ana dikdörtgeni çizer.
   * Bu çerçeve, tüm profillerin yerleştirileceği sınır alanını belirler.
   *
   * @param width - Çerçeve genişliği (milimetre)
   * @param height - Çerçeve yüksekliği (milimetre)
   */
  private drawMainFrame(width: number, height: number): void {
    // Ana çerçeve sadece siyah kontur - içi dolu değil
    const outerFrame = new paper.Path.Rectangle({
      point: [0, 0], // Sol üst köşe koordinatı
      size: [width, height], // Çerçeve boyutları
      strokeColor: '#000000', // Siyah kontur rengi
      strokeWidth: 2, // 2 piksel kalınlık
      fillColor: null, // İç dolgu yok - şeffaf
    })

    // Ana çizim grubuna ekle
    this.mainGroup.addChild(outerFrame)
  }

  /**
   * TÜM PROFİL BÖLÜCÜ ÇİZİM KOORDİNATÖRÜ
   *
   * Hem otomatik yerleştirilen hem de kullanıcının eklediği özel profilleri
   * hesaplayıp çizen ana koordinatör fonksiyon. Dikey ve yatay profilleri
   * ayrı ayrı işleyerek düzenli bir çizim süreci sağlar.
   *
   * @param params - Çizim parametreleri
   * @param customDividers - Özel eklenen profiller
   */
  private drawAllDividers(
    params: DrawingParameters,
    customDividers: CustomDivider[]
  ): void {
    // AŞAMA 1: Tüm dikey profillerin konumlarını hesapla
    // (Otomatik dağıtılan + kullanıcı eklediği özel profiller)
    const allVerticalDividers = this.calculateAllVerticalDividers(
      params,
      customDividers
    )

    // AŞAMA 2: Tüm yatay profillerin konumlarını hesapla
    // (Otomatik dağıtılan + kullanıcı eklediği özel profiller)
    const allHorizontalDividers = this.calculateAllHorizontalDividers(
      params,
      customDividers
    )

    // AŞAMA 3: Hesaplanan dikey profilleri Paper.js ile çiz
    this.drawVerticalDividersFromList(params, allVerticalDividers)

    // AŞAMA 4: Hesaplanan yatay profilleri Paper.js ile çiz
    this.drawHorizontalDividersFromList(params, allHorizontalDividers)
  }

  /**
   * DİKEY PROFİL KONUM HESAPLAMA FONKSİYONU
   *
   * Otomatik dağıtılan ve özel eklenen tüm dikey profillerin konumlarını hesaplar.
   * Eşit aralık algoritması kullanarak profilleri düzenli olarak dağıtır.
   *
   * @param params - Çizim parametreleri
   * @param customDividers - Kullanıcının eklediği özel profiller
   * @returns Konum bilgisi olan profil listesi (x koordinatı bazında sıralı)
   */
  private calculateAllVerticalDividers(
    params: DrawingParameters,
    customDividers: CustomDivider[]
  ): Array<{ position: number; isCustom: boolean; label?: string }> {
    const { width, verticalDividers, profileWidth } = params
    const dividers: Array<{
      position: number // X koordinatı (sol kenardan uzaklık)
      isCustom: boolean // Özel mi yoksa otomatik mi?
      label?: string // Profil etiketi (sadece özel profillerde)
    }> = []

    // OTOMATIK DİKEY PROFİLLER - EŞİT ARALIK ALGORİTMASI
    if (verticalDividers > 0) {
      // Çerçeveyi eşit bölmelere ayır (profil sayısı + 1 bölme)
      const sectionWidth = width / (verticalDividers + 1)

      for (let i = 1; i <= verticalDividers; i++) {
        // Her profili kendi bölümünün ortasına yerleştir
        // profileWidth/2 çıkarma sebebi: profil merkezini değil sol kenarını konumlandırıyoruz
        const position = sectionWidth * i - profileWidth / 2

        dividers.push({
          // Sınır kontrolü: profil çerçeve dışına çıkmasın
          position: Math.max(0, Math.min(position, width - profileWidth)),
          isCustom: false, // Otomatik profil
        })
      }
    }

    // KULLANICI TARAFINDAN EKLENEN ÖZEL DİKEY PROFİLLER
    customDividers.forEach((divider) => {
      if (divider.type === 'vertical') {
        // Kullanıcının belirttiği konumu sınır kontrolüne tabi tut
        const position = Math.max(
          0, // Sol sınır
          Math.min(divider.position, width - profileWidth) // Sağ sınır
        )

        dividers.push({
          position,
          isCustom: true, // Özel profil işareti
          label: divider.label, // Kullanıcının verdiği isim
        })
      }
    })

    // X koordinatına göre soldan sağa sırala
    return dividers.sort((a, b) => a.position - b.position)
  }

  private calculateAllHorizontalDividers(
    params: DrawingParameters,
    customDividers: CustomDivider[]
  ): Array<{ position: number; isCustom: boolean; label?: string }> {
    const { height, horizontalDividers, profileHeight } = params
    const dividers: Array<{
      position: number
      isCustom: boolean
      label?: string
    }> = []

    // Varsayılan yatay kayıtları ekle - EŞİT ARALIKLAR
    if (horizontalDividers > 0) {
      // Tüm yüksekliği eşit bölmelere ayır
      const sectionHeight = height / (horizontalDividers + 1)

      for (let i = 1; i <= horizontalDividers; i++) {
        // Her kayıtı kendi bölmesinin ortasına yerleştir
        const position = sectionHeight * i - profileHeight / 2
        dividers.push({
          position: Math.max(0, Math.min(position, height - profileHeight)),
          isCustom: false,
        })
      }
    }

    // Özel yatay kayıtları ekle (y koordinatını alt taraftan hesapla)
    customDividers.forEach((divider) => {
      if (divider.type === 'horizontal') {
        const position = height - divider.position - profileHeight
        dividers.push({
          position: Math.max(0, Math.min(position, height - profileHeight)),
          isCustom: true,
          label: divider.label,
        })
      }
    })

    return dividers.sort((a, b) => a.position - b.position)
  }

  private drawVerticalDividersFromList(
    params: DrawingParameters,
    dividers: Array<{ position: number; isCustom: boolean; label?: string }>
  ): void {
    const { height, profileWidth, profileThickness } = params

    dividers.forEach((divider, index) => {
      // Dış dikdörtgen (profil çerçevesi) - keskin renk + opacity
      const outerProfile = new paper.Path.Rectangle({
        point: [divider.position, 0],
        size: [profileWidth, height],
        fillColor: new paper.Color(
          divider.isCustom ? '#ff6600' : '#ff0000'
        ).clone(),
        strokeColor: divider.isCustom ? '#ff6600' : '#ff0000',
        strokeWidth: 1,
        opacity: 0.3, // Opaklık eklendi
      })

      // REFERANS ÇİZGİSİ - Profil merkezinde tam boy siyah çizgi
      const centerLine = new paper.Path.Line({
        from: [divider.position + profileWidth / 2, 0],
        to: [divider.position + profileWidth / 2, height],
        strokeColor: '#000000',
        strokeWidth: 2,
        dashArray: [5, 5], // Kesikli çizgi
      })
      this.mainGroup.addChild(centerLine)

      // Profil kalınlığı - sadece dikey çizgiler TAM BOY (sol ve sağ kenarlar)
      // Sol kenar - TAM BOY (0'dan height'a kadar)
      const leftThicknessLine = new paper.Path.Line({
        from: [divider.position + profileThickness, 0],
        to: [divider.position + profileThickness, height],
        strokeColor: '#888888',
        strokeWidth: 1,
        dashArray: [3, 3],
      })

      // Sağ kenar - TAM BOY (0'dan height'a kadar)
      const rightThicknessLine = new paper.Path.Line({
        from: [divider.position + profileWidth - profileThickness, 0],
        to: [divider.position + profileWidth - profileThickness, height],
        strokeColor: '#888888',
        strokeWidth: 1,
        dashArray: [3, 3],
      })

      // Profil kalınlığı etiketi - SOL kenar yakınında
      const leftThicknessLabel = new paper.PointText({
        point: [divider.position + profileThickness + 5, height - 10],
        content: index === 0 ? `t:${profileThickness}` : '',
        fillColor: '#333333',
        fontSize: 8,
        justification: 'left',
      })

      // Sağ kenar etiketi - yorum satırı yapıldı
      const rightThicknessLabel = new paper.PointText({
        point: [
          divider.position + profileWidth - profileThickness - 5,
          height / 2 + 10,
        ],
        // content: `t:${profileThickness}`,
        fillColor: '#333333',
        fontSize: 8,
        justification: 'right',
      })

      this.mainGroup.addChild(outerProfile)
      this.mainGroup.addChild(leftThicknessLine)
      this.mainGroup.addChild(rightThicknessLine)
      this.labelsGroup.addChild(leftThicknessLabel)
      this.labelsGroup.addChild(rightThicknessLabel)
    })
  }

  private drawHorizontalDividersFromList(
    params: DrawingParameters,
    dividers: Array<{ position: number; isCustom: boolean; label?: string }>
  ): void {
    const { width, profileHeight, profileThickness } = params

    dividers.forEach((divider, index) => {
      // Dış dikdörtgen (profil çerçevesi) - keskin renk + opacity
      const outerProfile = new paper.Path.Rectangle({
        point: [0, divider.position],
        size: [width, profileHeight],
        fillColor: new paper.Color(
          divider.isCustom ? '#6600ff' : '#0000ff'
        ).clone(),
        strokeColor: divider.isCustom ? '#6600ff' : '#0000ff',
        strokeWidth: 1,
        opacity: 0.3, // Opaklık eklendi
      })

      // REFERANS ÇİZGİSİ - Profil merkezinde tam boy siyah çizgi
      const centerLine = new paper.Path.Line({
        from: [0, divider.position + profileHeight / 2],
        to: [width, divider.position + profileHeight / 2],
        strokeColor: '#000000',
        strokeWidth: 2,
        dashArray: [5, 5], // Kesikli çizgi
      })
      this.mainGroup.addChild(centerLine)

      // Profil kalınlığı - sadece yatay çizgiler TAM BOY (alt ve üst kenarlar)
      // Alt kenar - TAM BOY (0'dan width'a kadar)
      const bottomThicknessLine = new paper.Path.Line({
        from: [0, divider.position + profileThickness],
        to: [width, divider.position + profileThickness],
        strokeColor: '#888888',
        strokeWidth: 1,
        dashArray: [3, 3],
      })

      // Üst kenar - TAM BOY (0'dan width'a kadar)
      const topThicknessLine = new paper.Path.Line({
        from: [0, divider.position + profileHeight - profileThickness],
        to: [width, divider.position + profileHeight - profileThickness],
        strokeColor: '#888888',
        strokeWidth: 1,
        dashArray: [3, 3],
      })

      // Profil kalınlığı etiketi - ALT kenar yakınında
      const bottomThicknessLabel = new paper.PointText({
        point: [width - 15, divider.position + profileThickness + 10],
        content: index === 0 ? `t:${profileThickness}` : '',
        fillColor: '#333333',
        fontSize: 8,
        justification: 'right',
      })

      // Üst kenar etiketi - yorum satırı yapıldı
      const topThicknessLabel = new paper.PointText({
        point: [
          width / 2 - 15,
          divider.position + profileHeight - profileThickness - 2,
        ],
        // content: `t:${profileThickness}`,
        fillColor: '#333333',
        fontSize: 8,
        justification: 'center',
      })

      this.mainGroup.addChild(outerProfile)
      this.mainGroup.addChild(bottomThicknessLine)
      this.mainGroup.addChild(topThicknessLine)
      this.labelsGroup.addChild(bottomThicknessLabel)
      this.labelsGroup.addChild(topThicknessLabel)
    })
  }

  private addLabels(
    params: DrawingParameters,
    customDividers: CustomDivider[]
  ): void {
    const { width, height, profileWidth, profileHeight } = params

    // Ana boyut etiketleri
    const widthLabel = new paper.PointText({
      point: [width / 2, -20],
      content: `${width} mm`,
      fillColor: '#000000',
      fontSize: 14,
      justification: 'center',
    })

    const heightLabel = new paper.PointText({
      point: [-30, height / 2],
      content: `${height} mm`,
      fillColor: '#000000',
      fontSize: 14,
      justification: 'center',
    })
    heightLabel.rotate(-90)

    this.labelsGroup.addChild(widthLabel)
    this.labelsGroup.addChild(heightLabel)

    // Tüm kayıtları hesapla ve aralık etiketlerini ekle
    const allVerticalDividers = this.calculateAllVerticalDividers(
      params,
      customDividers
    )
    const allHorizontalDividers = this.calculateAllHorizontalDividers(
      params,
      customDividers
    )

    // Dikey aralık etiketleri
    this.addVerticalSpacingLabels(
      width,
      height,
      profileWidth,
      allVerticalDividers
    )

    // Yatay aralık etiketleri
    this.addHorizontalSpacingLabels(
      width,
      height,
      profileHeight,
      allHorizontalDividers
    )

    // Özel kayıt etiketleri
    this.addCustomDividerLabels(width, height, customDividers)
  }

  private addVerticalSpacingLabels(
    width: number,
    height: number,
    profileWidth: number,
    dividers: Array<{ position: number; isCustom: boolean; label?: string }>
  ): void {
    // Referans çizgilerinin pozisyonları (profil merkezleri)
    const centerPositions = [
      0, // Sol kenar
      ...dividers.map((d) => d.position + profileWidth / 2), // Profil merkezleri
      width, // Sağ kenar
    ]

    for (let i = 0; i < centerPositions.length - 1; i++) {
      const pos1 = centerPositions[i]!
      const pos2 = centerPositions[i + 1]!
      const spacing = Math.round(pos2 - pos1)
      const x = pos1 + spacing / 2

      const spacingLabel = new paper.PointText({
        point: [x, height + 40],
        content: `${spacing} mm`,
        fillColor: '#333333',
        fontSize: 10,
        justification: 'center',
      })
      this.labelsGroup.addChild(spacingLabel)
    }
  }

  private addHorizontalSpacingLabels(
    width: number,
    height: number,
    profileHeight: number,
    dividers: Array<{ position: number; isCustom: boolean; label?: string }>
  ): void {
    // Referans çizgilerinin pozisyonları (profil merkezleri)
    const centerPositions = [
      0, // Alt kenar
      ...dividers.map((d) => d.position + profileHeight / 2), // Profil merkezleri
      height, // Üst kenar
    ]

    for (let i = 0; i < centerPositions.length - 1; i++) {
      const pos1 = centerPositions[i]!
      const pos2 = centerPositions[i + 1]!
      const spacing = Math.round(pos2 - pos1)
      const y = pos1 + spacing / 2

      const spacingLabel = new paper.PointText({
        point: [width + 60, y], // Sol taraftan (-60) sağ tarafa (width + 60) taşındı
        content: `${spacing} mm`,
        fillColor: '#333333',
        fontSize: 10,
        justification: 'center',
      })
      this.labelsGroup.addChild(spacingLabel)
    }
  }

  private addCustomDividerLabels(
    width: number,
    height: number,
    customDividers: CustomDivider[]
  ): void {
    customDividers.forEach((divider) => {
      if (divider.type === 'vertical') {
        const label = new paper.PointText({
          point: [divider.position, height + 60],
          content: divider.label,
          fillColor: '#ff6600',
          fontSize: 12,
          justification: 'center',
        })
        this.labelsGroup.addChild(label)
      } else {
        const label = new paper.PointText({
          point: [width + 100, height - divider.position], // Sol taraftan (-100) sağ tarafa (width + 100) taşındı
          content: divider.label,
          fillColor: '#6600ff',
          fontSize: 12,
          justification: 'center',
        })
        this.labelsGroup.addChild(label)
      }
    })
  }

  private centerDrawing(): void {
    // Context7'den öğrendiğim Paper.js best practices
    const mainBounds = this.mainGroup.bounds
    const labelsBounds = this.labelsGroup.bounds

    if (!mainBounds && !labelsBounds) return

    // Toplam bounds hesapla
    let totalBounds: paper.Rectangle
    if (mainBounds && labelsBounds) {
      totalBounds = mainBounds.unite(labelsBounds)
    } else if (mainBounds) {
      totalBounds = mainBounds
    } else if (labelsBounds) {
      totalBounds = labelsBounds
    } else {
      return
    }

    // View center'a göre çizimi ortala - Paper.js best practice
    const viewCenter = paper.view.center
    const boundsCenter = totalBounds.center
    const offset = viewCenter.subtract(boundsCenter)

    // Grupları translate et
    this.mainGroup.translate(offset)
    this.labelsGroup.translate(offset)

    // Çizimi view bounds'a sığdır (opsiyonel scaling)
    const viewBounds = paper.view.bounds
    const paddedViewBounds = viewBounds.expand(-50) // 50px padding

    // Manuel bounds kontrolü - Paper.js Rectangle'da fits metodu yok
    const needsScaling =
      totalBounds.width > paddedViewBounds.width ||
      totalBounds.height > paddedViewBounds.height

    if (needsScaling) {
      const scale = Math.min(
        paddedViewBounds.width / totalBounds.width,
        paddedViewBounds.height / totalBounds.height
      )

      // Scale grupları
      this.mainGroup.scale(scale, viewCenter)
      this.labelsGroup.scale(scale, viewCenter)
    }
  }

  /**
   * SVG EXPORT FONKSİYONU
   *
   * Mevcut çizimi SVG formatında string olarak export eder.
   * Teknik çizimler için vektörel format, ölçeklenebilir ve yazdırılabilir.
   *
   * @returns SVG formatında çizim - string formatında
   */
  public exportSVG(): string {
    return this.project.exportSVG({ asString: true }) as string
  }

  /**
   * ÇİZİM MOTORU TEMİZLEME FONKSİYONU
   *
   * Paper.js projesini tamamen kaldırır ve bellek temizliği yapar.
   * Component unmount edildiğinde çağrılmalıdır (memory leak önlemi).
   */
  public destroy(): void {
    this.project.remove() // Paper.js projesini tamamen kaldır
  }

  private detectOverlaps(
    params: DrawingParameters,
    customDividers: CustomDivider[]
  ): void {
    // Yatay çakışmaları tespit et
    const horizontalOverlaps = this.detectHorizontalOverlaps(
      params,
      customDividers
    )

    // Dikey çakışmaları tespit et
    const verticalOverlaps = this.detectVerticalOverlaps(params, customDividers)

    // Profil kalınlığı validasyonu
    const thicknessWarnings = this.validateProfileThickness(params)

    // Çakışmaları topla
    this.overlaps = [...horizontalOverlaps, ...verticalOverlaps]

    // Kalınlık uyarılarını da overlap formatında ekle
    if (thicknessWarnings.length > 0) {
      this.overlaps.push({
        type: 'horizontal', // type alanı mevcut format için gerekli
        items: thicknessWarnings,
      })
    }
  }

  private detectHorizontalOverlaps(
    params: DrawingParameters,
    customDividers: CustomDivider[]
  ): Array<{ type: 'horizontal'; items: string[] }> {
    const { height, horizontalDividers, profileHeight } = params
    const overlaps: Array<{ type: 'horizontal'; items: string[] }> = []

    // Tüm yatay kayıtların pozisyonlarını topla
    const allHorizontalRects: Array<{
      start: number
      end: number
      label: string
      isCustom: boolean
    }> = []

    // Varsayılan yatay kayıtları ekle
    if (horizontalDividers > 0) {
      const sectionHeight = height / (horizontalDividers + 1)

      for (let i = 1; i <= horizontalDividers; i++) {
        const position = sectionHeight * i - profileHeight / 2
        allHorizontalRects.push({
          start: Math.max(0, position),
          end: Math.min(height, position + profileHeight),
          label: `Yatay Kayıt ${i}`,
          isCustom: false,
        })
      }
    }

    // Özel yatay kayıtları ekle
    customDividers.forEach((divider) => {
      if (divider.type === 'horizontal') {
        const position = height - divider.position - profileHeight
        allHorizontalRects.push({
          start: Math.max(0, position),
          end: Math.min(height, position + profileHeight),
          label: divider.label,
          isCustom: true,
        })
      }
    })

    // Çakışmaları kontrol et
    const processedPairs = new Set<string>()

    for (let i = 0; i < allHorizontalRects.length; i++) {
      for (let j = i + 1; j < allHorizontalRects.length; j++) {
        const rect1 = allHorizontalRects[i]!
        const rect2 = allHorizontalRects[j]!

        const pairKey = `${i}-${j}`
        if (processedPairs.has(pairKey)) continue

        // Rectangle intersection kontrolü
        if (
          this.rectanglesOverlap(rect1.start, rect1.end, rect2.start, rect2.end)
        ) {
          // Bu çakışan çift için grup oluştur
          const overlappingItems: string[] = [rect1.label, rect2.label]

          // Diğer çakışan rectangle'ları da bul
          for (let k = 0; k < allHorizontalRects.length; k++) {
            if (k === i || k === j) continue

            const rect3 = allHorizontalRects[k]!
            if (
              this.rectanglesOverlap(
                rect1.start,
                rect1.end,
                rect3.start,
                rect3.end
              ) ||
              this.rectanglesOverlap(
                rect2.start,
                rect2.end,
                rect3.start,
                rect3.end
              )
            ) {
              overlappingItems.push(rect3.label)
            }
          }

          overlaps.push({
            type: 'horizontal',
            items: [...new Set(overlappingItems)], // Duplikatları kaldır
          })

          processedPairs.add(pairKey)
          break // Bu rectangle için işlem tamam
        }
      }
    }

    return overlaps
  }

  private rectanglesOverlap(
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): boolean {
    return start1 < end2 && start2 < end1
  }

  private detectVerticalOverlaps(
    params: DrawingParameters,
    customDividers: CustomDivider[]
  ): Array<{ type: 'vertical'; items: string[] }> {
    const { width, verticalDividers, profileWidth } = params
    const overlaps: Array<{ type: 'vertical'; items: string[] }> = []

    // Tüm dikey kayıtların pozisyonlarını topla
    const allVerticalRects: Array<{
      start: number
      end: number
      label: string
      isCustom: boolean
    }> = []

    // Varsayılan dikey kayıtları ekle
    if (verticalDividers > 0) {
      const sectionWidth = width / (verticalDividers + 1)

      for (let i = 1; i <= verticalDividers; i++) {
        const position = sectionWidth * i - profileWidth / 2
        allVerticalRects.push({
          start: Math.max(0, position),
          end: Math.min(width, position + profileWidth),
          label: `Dikey Kayıt ${i}`,
          isCustom: false,
        })
      }
    }

    // Özel dikey kayıtları ekle
    customDividers.forEach((divider) => {
      if (divider.type === 'vertical') {
        const position = Math.max(
          0,
          Math.min(divider.position, width - profileWidth)
        )
        allVerticalRects.push({
          start: position,
          end: position + profileWidth,
          label: divider.label,
          isCustom: true,
        })
      }
    })

    // Çakışmaları kontrol et
    const processedPairs = new Set<string>()

    for (let i = 0; i < allVerticalRects.length; i++) {
      for (let j = i + 1; j < allVerticalRects.length; j++) {
        const rect1 = allVerticalRects[i]!
        const rect2 = allVerticalRects[j]!

        const pairKey = `${i}-${j}`
        if (processedPairs.has(pairKey)) continue

        // Rectangle intersection kontrolü
        if (
          this.rectanglesOverlap(rect1.start, rect1.end, rect2.start, rect2.end)
        ) {
          // Bu çakışan çift için grup oluştur
          const overlappingItems: string[] = [rect1.label, rect2.label]

          // Diğer çakışan rectangle'ları da bul
          for (let k = 0; k < allVerticalRects.length; k++) {
            if (k === i || k === j) continue

            const rect3 = allVerticalRects[k]!
            if (
              this.rectanglesOverlap(
                rect1.start,
                rect1.end,
                rect3.start,
                rect3.end
              ) ||
              this.rectanglesOverlap(
                rect2.start,
                rect2.end,
                rect3.start,
                rect3.end
              )
            ) {
              overlappingItems.push(rect3.label)
            }
          }

          overlaps.push({
            type: 'vertical',
            items: [...new Set(overlappingItems)], // Duplikatları kaldır
          })

          processedPairs.add(pairKey)
          break // Bu rectangle için işlem tamam
        }
      }
    }

    return overlaps
  }

  private validateProfileThickness(params: DrawingParameters): string[] {
    const { profileWidth, profileHeight, profileThickness } = params
    const warnings: string[] = []

    // Dikey profil kalınlığı kontrolü (profileWidth'in yarısından fazla olamaz)
    const maxVerticalThickness = profileWidth / 2
    if (profileThickness > maxVerticalThickness) {
      warnings.push(
        `Dikey profil kalınlığı çok büyük! Maksimum: ${maxVerticalThickness.toFixed(
          1
        )}mm (Genişlik/2)`
      )
    }

    // Yatay profil kalınlığı kontrolü (profileHeight'in yarısından fazla olamaz)
    const maxHorizontalThickness = profileHeight / 2
    if (profileThickness > maxHorizontalThickness) {
      warnings.push(
        `Yatay profil kalınlığı çok büyük! Maksimum: ${maxHorizontalThickness.toFixed(
          1
        )}mm (Yükseklik/2)`
      )
    }

    return warnings
  }
}
