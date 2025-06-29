/**
 * ÇAKIŞMA UYARI SİSTEMİ BİLEŞENİ
 *
 * Profillerin çakışma durumlarını ve geometrik sorunları kullanıcıya
 * bildirir. Dikkat çekici görsel uyarılar ile tasarım hatalarının fark
 * edilmesini sağlar. Non-intrusive tasarım ile kullanıcı deneyimini kesintiye uğratmaz.
 */

import React from 'react'

/**
 * UYARI KARTLARI PROPS ARABIRIMI
 *
 * Parent bileşenlerden alınan uyarı listesi verileri.
 */
interface OverlapWarningProps {
  /** Tüm uyarı kategorilerini içeren toplu liste */
  warnings: Array<{
    /** Uyarı kategorisi - 'horizontal', 'vertical', 'thickness' */
    type: 'horizontal' | 'vertical' | 'thickness'

    /** Bu kategorideki uyarı mesajları */
    items: string[]
  }>
}

/**
 * UYARI TİPİ KONFIGÜRASYON YAPISI
 *
 * Her uyarı türü için görsel ve metin özellikleri.
 */
interface WarningTypeConfig {
  /** Uyarı kategorisi için başlık */
  title: string

  /** Uyarı ikonu - emoji formatında */
  icon: string

  /** Arka plan renk sınıfları - TailwindCSS */
  bgColor: string

  /** Çerçeve rengi sınıfları - TailwindCSS */
  borderColor: string

  /** Metin rengi sınıfları - TailwindCSS */
  textColor: string
}

/**
 * UYARI TİPLERİ KONFIGÜRASYONU
 *
 * Her uyarı kategorisi için görsel ve metin ayarlarını tanımlar.
 * Bu yapı ile yeni uyarı tipleri kolayca eklenebilir.
 */
const warningTypeConfigs: Record<string, WarningTypeConfig> = {
  horizontal: {
    title: 'Yatay Profil Çakışması',
    icon: '🔴',
    bgColor: 'bg-red-900/90',
    borderColor: 'border-red-500',
    textColor: 'text-red-100',
  },
  vertical: {
    title: 'Dikey Profil Çakışması',
    icon: '🟠',
    bgColor: 'bg-orange-900/90',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-100',
  },
  thickness: {
    title: 'Geometrik Uyarı',
    icon: '⚠️',
    bgColor: 'bg-yellow-900/90',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-100',
  },
}

/**
 * ANA ÇAKIŞMA UYARI BİLEŞENİ
 *
 * Uyarı kartlarını ekranın sağ üst köşesinde sabit konumda gösterir.
 * Kullanıcı çizim yaparken uyarıları kesintisiz takip edebilir.
 */
const OverlapWarning: React.FC<OverlapWarningProps> = ({ warnings }) => {
  // Uyarı yoksa hiçbir şey render etme
  if (warnings.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {warnings.map((warning, index) => {
        // Uyarı türü için konfigürasyon al (fallback olarak thickness kullan)
        const config =
          warningTypeConfigs[warning.type] || warningTypeConfigs.thickness!

        return (
          <div
            key={`${warning.type}-${index}`}
            className={`${config.bgColor} ${config.borderColor} ${config.textColor} border-2 rounded-lg p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105`}
          >
            {/* UYARI BAŞLIĞI */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-lg">{config.icon}</span>
              <div className="font-bold text-sm uppercase tracking-wide">
                {config.title}
              </div>
            </div>

            {/* UYARI MESAJLARI LİSTESİ */}
            <div className="space-y-2">
              {warning.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="text-xs leading-relaxed bg-black/20 rounded p-2 border border-white/10"
                >
                  {/* MADDE İŞARETİ VE MESAJ */}
                  <div className="flex items-start space-x-2">
                    <span className="text-white/60 mt-0.5">•</span>
                    <span className="flex-1">{item}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* UYARI SAYISI BİLGİSİ (Birden fazla uyarı varsa) */}
            {warning.items.length > 1 && (
              <div className="mt-3 pt-2 border-t border-white/10">
                <div className="text-xs font-semibold text-center opacity-75">
                  Toplam {warning.items.length} uyarı
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* GENEL BİLGİLENDİRME NOTU */}
      {warnings.length > 0 && (
        <div className="bg-zinc-900/90 border-2 border-zinc-600 text-zinc-200 rounded-lg p-3 text-xs leading-relaxed">
          <div className="flex items-center space-x-2 mb-2">
            <span>💡</span>
            <div className="font-semibold uppercase tracking-wide">
              Tasarım İpucu
            </div>
          </div>
          <div className="text-zinc-300">
            Çakışmaları çözmek için profil boyutlarını ayarlayın veya özel
            profillerin konumlarını değiştirin.
          </div>
        </div>
      )}
    </div>
  )
}

export default OverlapWarning
