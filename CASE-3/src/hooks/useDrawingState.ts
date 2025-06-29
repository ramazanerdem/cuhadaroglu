/**
 * ÇIZIM DURUMU YÖNETİM HOOK'U
 *
 * Bu hook, uygulamanın tüm state yönetimini merkezi olarak halleder.
 * Profil parametreleri, özel bölücüler ve uyarı sistemini yönetir.
 * React'in useState ve useCallback hook'larını kullanarak performanslı state yönetimi sağlar.
 */

import { useState, useCallback } from 'react'
import type { DrawingState, DrawingParameters, CustomDivider } from '../types'

/**
 * VARSAYILAN PARAMETRE DEĞERLERİ
 *
 * Uygulama ilk açıldığında ve "Varsayılanlara Dön" butonuna basıldığında
 * kullanılacak standart profil çerçeve ölçüleri.
 */
const DEFAULT_PARAMETERS: DrawingParameters = {
  width: 600, // 600mm genişlik - standart pencere boyutu
  height: 400, // 400mm yükseklik - standart pencere boyutu
  verticalDividers: 2, // 2 dikey profil - çift kanatlı pencere
  horizontalDividers: 2, // 2 yatay profil - üst/orta/alt bölüm
  profileWidth: 50, // 50mm profil genişliği - standart parça profil
  profileHeight: 40, // 40mm profil yüksekliği - standart parça profil
  profileThickness: 2.5, // 2.5mm profil kalınlığı - standart parça kalınlığı
}

/**
 * ANA DRAWING STATE HOOK EXPORT'U
 *
 * Bu hook uygulamanın tüm state operasyonlarını ve güncelleyici fonksiyonlarını döndürür.
 * Component'lar bu hook'u import ederek state'e erişebilir ve güncelleyebilir.
 */
export const useDrawingState = () => {
  /**
   * ANA STATE TANIMI
   *
   * Uygulamanın tüm durumunu tek bir state objesi içinde tutar.
   * Bu yaklaşım state güncellemelerini daha öngörülebilir kılar.
   */
  const [state, setState] = useState<DrawingState>({
    parameters: {
      width: 600, // Ana çerçeve genişliği
      height: 400, // Ana çerçeve yüksekliği
      verticalDividers: 2, // Dikey profil sayısı
      horizontalDividers: 3, // Yatay profil sayısı
      profileWidth: 50, // Profil genişliği
      profileHeight: 50, // Profil yüksekliği
      profileThickness: 2.5, // Profil kalınlığı
    },
    customDividers: [], // Özel eklenen profiller (başlangıçta boş)
    horizontalOverlaps: [], // Yatay çakışma uyarıları
    verticalOverlaps: [], // Dikey çakışma uyarıları
    thicknessWarnings: [], // Kalınlık uyarıları
    isDrawing: false, // Çizim durumu flag'i
  })

  /**
   * TOPLU PARAMETRE GÜNCELLEME FONKSİYONU
   *
   * Birden fazla parametreyi aynı anda güncellemek için kullanılır.
   * useCallback ile wrap edilmiş - gereksiz re-render'ları önler.
   *
   * @param newParams - Güncellenmek istenen parametrelerin partial objesi
   */
  const updateParameters = useCallback(
    (newParams: Partial<DrawingParameters>) => {
      setState((prev) => ({
        ...prev,
        parameters: { ...prev.parameters, ...newParams },
      }))
    },
    []
  )

  /**
   * ÖZEL BÖLÜCÜ EKLEME FONKSİYONU
   *
   * Kullanıcının manuel olarak eklediği özel konumlu profilleri state'e ekler.
   * Benzersiz ID otomatik olarak oluşturulur (timestamp tabanlı).
   *
   * @param divider - ID hariç tüm divider bilgileri
   */
  const addCustomDivider = useCallback((divider: Omit<CustomDivider, 'id'>) => {
    // Yeni divider için timestamp tabanlı benzersiz ID oluştur
    const newDivider: CustomDivider = {
      ...divider,
      id: Date.now().toString(),
    }

    // State'i güncelle - önceki divider'lar korunur, yenisi eklenir
    setState((prev) => ({
      ...prev,
      customDividers: [...prev.customDividers, newDivider],
    }))
  }, [])

  /**
   * ÖZEL BÖLÜCÜ SİLME FONKSİYONU
   *
   * Belirli ID'ye sahip özel profili listeden çıkarır.
   * Array filter metodu kullanarak immutable güncelleme yapar.
   *
   * @param id - Silinecek profilin benzersiz kimliği
   */
  const removeCustomDivider = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      customDividers: prev.customDividers.filter((d) => d.id !== id),
    }))
  }, [])

  /**
   * ÇİZİM DURUMU GÜNCELLEME FONKSİYONU
   *
   * Uygulamanın şu anda çizim işlemi yapıp yapmadığını belirtir.
   * Loading state'i ve kullanıcı arayüzü feedback'i için kullanılır.
   *
   * @param isDrawing - Çizim durumu: true (çiziliyor) / false (tamamlandı)
   */
  const setDrawing = useCallback((isDrawing: boolean) => {
    setState((prev) => ({ ...prev, isDrawing }))
  }, [])

  /**
   * ÇAKIŞMA UYARILARI GÜNCELLEME FONKSİYONU
   *
   * DrawingEngine'den gelen çakışma analizlerini state'e kaydeder.
   * Hem profil çakışmaları hem de kalınlık uyarıları işlenir.
   *
   * @param horizontalOverlaps - Yatay profil çakışmaları
   * @param verticalOverlaps - Dikey profil çakışmaları
   * @param thicknessWarnings - Geometrik kalınlık uyarıları
   */
  const setOverlaps = useCallback(
    (
      horizontalOverlaps: string[],
      verticalOverlaps: string[],
      thicknessWarnings: string[]
    ) => {
      setState((prev) => ({
        ...prev,
        horizontalOverlaps,
        verticalOverlaps,
        thicknessWarnings,
      }))
    },
    []
  )

  /**
   * YATAY ÇAKIŞMA GÜNCELLEME FONKSİYONU (Legacy)
   *
   * Sadece yatay çakışmaları güncellemek için kullanılan eski fonksiyon.
   * Geriye dönük uyumluluk için korunmuştur.
   *
   * @param overlaps - Yatay profil çakışma listesi
   */
  const updateOverlaps = useCallback((overlaps: string[]) => {
    setState((prev) => ({ ...prev, horizontalOverlaps: overlaps }))
  }, [])

  /**
   * VARSAYILAN DEĞERLERİ GERİ YÜKLEME FONKSİYONU
   *
   * Tüm parametreleri ve özel profilleri sıfırlayarak uygulamayı
   * ilk açılış durumuna getirir. "Varsayılanlara Dön" butonu için.
   */
  const resetToDefaults = useCallback(() => {
    setState({
      parameters: DEFAULT_PARAMETERS, // Fabrika ayarları
      customDividers: [], // Özel profilleri temizle
      horizontalOverlaps: [], // Uyarıları temizle
      verticalOverlaps: [], // Uyarıları temizle
      thicknessWarnings: [], // Uyarıları temizle
      isDrawing: false, // Çizim durumunu sıfırla
    })
  }, [])

  /**
   * TEK PARAMETRE GÜNCELLEME FONKSİYONU (Legacy Uyumluluk)
   *
   * Eski component'ların kullandığı tek parametre güncelleme arayüzü.
   * İç tarafta updateParameters fonksiyonunu kullanır.
   *
   * @param key - Güncellenecek parametre anahtarı
   * @param value - Yeni değer
   */
  const updateParameter = useCallback(
    (key: keyof DrawingParameters, value: number) => {
      updateParameters({ [key]: value })
    },
    [updateParameters]
  )

  /**
   * KALINLIK UYARILARI GÜNCELLEME FONKSİYONU (Legacy Uyumluluk)
   *
   * Sadece kalınlık uyarılarını güncellemek için ayrı fonksiyon.
   * Eski component arayüzleri için uyumluluk sağlar.
   *
   * @param warnings - Kalınlık uyarıları listesi
   */
  const setThicknessWarnings = useCallback((warnings: string[]) => {
    setState((prev) => ({
      ...prev,
      thicknessWarnings: warnings,
    }))
  }, [])

  /**
   * HOOK'UN GERİ DÖNDÜRDÜĞÜ ARAYÜZ
   *
   * Component'ların kullanabileceği tüm state değerleri ve fonksiyonları.
   * Hem yeni yapıdaki state hem de eski component'lar için uyumluluk fonksiyonları.
   */
  return {
    // State değerleri - component'lar bunları okuyabilir
    parameters: state.parameters, // Mevcut çizim parametreleri
    customDividers: state.customDividers, // Özel eklenen profiller
    horizontalOverlaps: state.horizontalOverlaps, // Yatay çakışma uyarıları
    verticalOverlaps: state.verticalOverlaps, // Dikey çakışma uyarıları
    thicknessWarnings: state.thicknessWarnings, // Kalınlık uyarıları
    isDrawing: state.isDrawing, // Çizim durumu flag'i

    // Güncelleme fonksiyonları - component'lar bunları çağırabilir
    updateParameter, // Tek parametre güncelleme (legacy)
    updateParameters, // Toplu parametre güncelleme (yeni)
    addCustomDivider, // Özel profil ekleme
    removeCustomDivider, // Özel profil silme
    setDrawing, // Çizim durumu değiştirme
    setOverlaps, // Tüm çakışma uyarıları güncelleme
    setThicknessWarnings, // Kalınlık uyarıları güncelleme (legacy)
    updateOverlaps, // Yatay çakışma güncelleme (legacy)
    resetToDefaults, // Varsayılan değerlere dönüş
  }
}
