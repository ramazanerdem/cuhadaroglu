/**
 * PARAMETRE KONTROL PANELİ BİLEŞENİ
 *
 * Çerçeve ve profil tasarımı için gerekli tüm sayısal parametreleri kontrol eden
 * kullanıcı arayüzü bileşeni. Gerçek zamanlı slider ve numrik input kontrolü
 * ile kullanıcı dostu parametre yönetimi sağlar.
 */

import React from 'react'
import type { DrawingParameters } from '../types'

/**
 * PARAMETRE PANELİ PROPS ARABIRIMI
 *
 * Parent bileşenlerden alınan parametreler ve güncelleyici fonksiyonlar.
 */
interface ParameterPanelProps {
  /** Mevcut parametre değerleri */
  parameters: DrawingParameters

  /** Parametre değişikliklerini parent'a bildiren callback */
  onParameterChange: (key: keyof DrawingParameters, value: number) => void
}

/**
 * PARAMETRE KONFIGÜRASYONU
 *
 * Her parametre için UI özellikleri, sınır değerleri ve görünüm ayarları.
 * Bu yapı ile parametre paneli dinamik olarak oluşturulur.
 */
interface ParameterConfig {
  /** Parametre anahtarı - DrawingParameters tipindeki alan adı */
  key: keyof DrawingParameters

  /** Kullanıcıya gösterilen Türkçe etiket */
  label: string

  /** Minimum değer - slider ve input için alt sınır */
  min: number

  /** Maximum değer - slider ve input için üst sınır */
  max: number

  /** Adım değeri - slider'ın hareket ettiği minimum artış */
  step: number

  /** Ölçü birimi - görüntülenecek birim (mm, adet) */
  unit: string

  /** Açıklama metni - kullanıcı için ek bilgi */
  description: string
}

/**
 * PARAMETRE TANIMLAMALARI
 *
 * Tüm parametreler için sınır değerleri ve UI ayarları.
 * Bu liste değiştirilerek yeni parametreler kolayca eklenebilir.
 */
const parameterConfig: ParameterConfig[] = [
  {
    key: 'width',
    label: 'Çerçeve Genişliği',
    min: 100,
    max: 2000,
    step: 10,
    unit: 'mm',
    description: 'Ana çerçevenin toplam genişliği',
  },
  {
    key: 'height',
    label: 'Çerçeve Yüksekliği',
    min: 100,
    max: 2000,
    step: 10,
    unit: 'mm',
    description: 'Ana çerçevenin toplam yüksekliği',
  },
  {
    key: 'verticalDividers',
    label: 'Dikey Profil Sayısı',
    min: 0,
    max: 10,
    step: 1,
    unit: 'adet',
    description: 'Otomatik yerleştirilecek dikey profil sayısı',
  },
  {
    key: 'horizontalDividers',
    label: 'Yatay Profil Sayısı',
    min: 0,
    max: 10,
    step: 1,
    unit: 'adet',
    description: 'Otomatik yerleştirilecek yatay profil sayısı',
  },
  {
    key: 'profileWidth',
    label: 'Profil Genişliği',
    min: 10,
    max: 200,
    step: 1,
    unit: 'mm',
    description: 'Her bir dikey profilin genişliği (dış ölçü)',
  },
  {
    key: 'profileHeight',
    label: 'Profil Yüksekliği',
    min: 10,
    max: 200,
    step: 1,
    unit: 'mm',
    description: 'Her bir yatay profilin yüksekliği (dış ölçü)',
  },
  {
    key: 'profileThickness',
    label: 'Profil Kalınlığı',
    min: 0.1,
    max: 20,
    step: 0.1,
    unit: 'mm',
    description: 'Malzeme kalınlığı (iç çerçeve kalınlığı)',
  },
]

/**
 * ANA PARAMETRE PANELİ BİLEŞENİ
 *
 * Yapılandırılmış parametre listesi üzerinden dinamik UI oluşturur.
 * Her parametre için slider ve numrik input kontrolü sağlar.
 */
const ParameterPanel: React.FC<ParameterPanelProps> = ({
  parameters,
  onParameterChange,
}) => {
  /**
   * PARAMETRE DEĞİŞTİRME HANDLER'I
   *
   * Slider veya input'tan gelen değişiklikleri işler ve parent'a bildirir.
   * Sınır değeri kontrolü yapar ve geçersiz değerleri filtreler.
   *
   * @param key - Değişen parametrenin anahtarı
   * @param value - Yeni parametre değeri
   */
  const handleParameterChange = (
    key: keyof DrawingParameters,
    value: number
  ) => {
    // Parametre konfigürasyonunu bul
    const config = parameterConfig.find((p) => p.key === key)
    if (!config) return

    // Değeri belirlenen sınırlar içinde tut
    const clampedValue = Math.min(Math.max(value, config.min), config.max)

    // Parent bileşene değişikliği bildir
    onParameterChange(key, clampedValue)
  }

  return (
    <div className="space-y-6">
      {parameterConfig.map((config) => (
        <div key={config.key} className="space-y-3">
          <div className="flex items-center justify-between bg-gradient-to-r from-zinc-700 to-zinc-800 border-2 border-zinc-500 p-2 shadow-brutal-sm">
            <div className="flex items-center space-x-2">
              {/* PARAMETRE BAŞLIĞI VE AÇIKLAMASI */}
              <div>
                <div className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                  {config.label}
                </div>
                <div className="text-xs text-zinc-300 mt-1">
                  {config.description}
                </div>
              </div>
            </div>

            {/* MEVCUT DEĞER GÖSTERIMI */}
            <div className="flex items-center space-x-2">
              <div className="text-lg font-black text-white font-mono bg-zinc-800 px-3 py-1 border border-zinc-500">
                {parameters[config.key]}
              </div>
              <div className="text-xs font-bold text-zinc-300 uppercase">
                {config.unit}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {/* SLIDER KONTROLÜ */}
            <input
              type="range"
              min={config.min}
              max={config.max}
              step={config.step}
              value={parameters[config.key]}
              onChange={(e) =>
                handleParameterChange(config.key, parseFloat(e.target.value))
              }
              className="w-full h-3 bg-gradient-to-r from-zinc-700 to-zinc-800 border-2 border-zinc-500 rounded-lg appearance-none cursor-pointer slider-brutal"
            />

            {/* SLIDER SINIRLARI GÖSTERİMİ */}
            <div className="flex justify-between text-xs font-mono text-zinc-400 px-1">
              <span className="bg-zinc-800 px-1 border border-zinc-600">
                {config.min} {config.unit}
              </span>
              <span className="bg-zinc-800 px-1 border border-zinc-600">
                {config.max} {config.unit}
              </span>
            </div>
          </div>

          {/* NUMERİK INPUT KONTROLÜ */}
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={config.min}
              max={config.max}
              step={config.step}
              value={parameters[config.key]}
              onChange={(e) =>
                handleParameterChange(
                  config.key,
                  parseFloat(e.target.value) || 0
                )
              }
              className="flex-1 bg-zinc-800 border-2 border-zinc-500 text-white font-mono text-sm px-3 py-2 rounded focus:border-zinc-300 focus:outline-none"
              placeholder={`${config.min} - ${config.max}`}
            />
            <div className="text-xs font-bold text-zinc-300 uppercase min-w-[40px]">
              {config.unit}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ParameterPanel
