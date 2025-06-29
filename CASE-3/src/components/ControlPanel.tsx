/**
 * KONTROL VE BİLGİ PANELİ BİLEŞENİ
 *
 * Profil tasarım uygulamasının kontrol butonlarını ve teknik bilgilerini
 * gösteren merkezi kontrol paneli. SVG export, sıfırlama, canlı parametre
 * gösterimi ve renk kodları sistemini içerir.
 */

import React from 'react'
import type { DrawingParameters, CustomDivider } from '../types'

/**
 * KONTROL PANELİ PROPS ARABIRIMI
 *
 * Parent bileşenlerden alınan veriler ve callback fonksiyonları.
 */
interface ControlPanelProps {
  /** Mevcut çizim parametreleri */
  parameters: DrawingParameters

  /** Mevcut özel profiller listesi */
  customDividers: CustomDivider[]

  /** SVG export işlemi için callback */
  onExportSVG: () => void

  /** Varsayılan değerlere dönüş için callback */
  onResetToDefaults: () => void
}

/**
 * ANA KONTROL PANELİ BİLEŞENİ
 *
 * Kullanıcının tasarım üzerinde kontrol sağlayabileceği butonları ve
 * mevcut tasarım hakkında teknik bilgileri görüntüleyen bileşen.
 */
const ControlPanel: React.FC<ControlPanelProps> = ({
  parameters,
  customDividers,
  onExportSVG,
  onResetToDefaults,
}) => {
  return (
    <div className="space-y-6">
      {/* EYLEM BUTONLARI SEKSİYONU */}
      <div className="bg-gradient-to-b from-zinc-700 to-zinc-800 border-3 border-zinc-500 p-4 shadow-brutal space-y-3">
        {/* SVG Export Butonu */}
        <button
          onClick={onExportSVG}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 border-2 border-green-400 text-white py-4 px-4 flex items-center justify-center space-x-3 font-bold uppercase tracking-wide shadow-brutal-sm hover:from-green-500 hover:to-green-600 hover:border-green-300 hover:shadow-brutal active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-150"
        >
          <span className="text-lg">💾 SVG İNDİR</span>
        </button>

        {/* Varsayılanlara Dönüş Butonu */}
        <button
          onClick={onResetToDefaults}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 border-2 border-red-400 text-white py-3 px-4 flex items-center justify-center space-x-3 font-bold uppercase tracking-wide shadow-brutal-sm hover:from-red-500 hover:to-red-600 hover:border-red-300 hover:shadow-brutal active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-150"
        >
          <span className="text-sm">SIFIRLA</span>
        </button>
      </div>

      {/* CANLI TEKNİK ÖZELLİKLER SEKSİYONU */}
      <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border-3 border-zinc-600 shadow-brutal">
        <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 border-b-2 border-zinc-500 p-3">
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
            Canlı Teknik Özellikler
          </h3>
        </div>

        <div className="p-4 space-y-3">
          {/* BOYUTLAR GRİDİ */}
          <div className="grid grid-cols-2 gap-3">
            {/* Ana Çerçeve Boyutları */}
            <div className="flex flex-col items-start bg-gradient-to-r from-gray-600 to-gray-700 border-2 border-gray-400 p-3 shadow-brutal-sm">
              <div className="text-xs font-bold text-gray-100 uppercase">
                Boyutlar
              </div>
              <div className="text-sm font-black text-white font-mono flex-1">
                {parameters.width} × {parameters.height}
              </div>
              <div className="text-xs font-bold text-gray-200">mm</div>
            </div>

            {/* Profil Boyutları */}
            <div className="flex flex-col items-start bg-gradient-to-r from-orange-600 to-orange-700 border-2 border-orange-400 p-3 shadow-brutal-sm">
              <div className="text-xs font-bold text-orange-100 uppercase">
                Profil
              </div>
              <div className="text-sm font-black text-white font-mono flex-1">
                {parameters.profileWidth} × {parameters.profileHeight}
              </div>
              <div className="text-xs font-bold text-orange-200">mm</div>
            </div>
          </div>

          {/* PROFİL SAYILARI GRİDİ */}
          <div className="grid grid-cols-2 gap-3">
            {/* Dikey Profil Sayısı */}
            <div className="flex flex-col items-start bg-gradient-to-r from-red-600 to-red-700 border-2 border-red-400 p-3 shadow-brutal-sm">
              <div className="text-xs font-bold text-red-100 uppercase">
                Dikey Kayıtlar
              </div>
              <div className="text-sm font-black text-white font-mono flex-1">
                {parameters.verticalDividers}
              </div>
              <div className="text-xs font-bold text-red-200">ADET</div>
            </div>

            {/* Yatay Profil Sayısı */}
            <div className="flex flex-col items-start bg-gradient-to-r from-blue-600 to-blue-700 border-2 border-blue-400 p-3 shadow-brutal-sm">
              <div className="text-xs font-bold text-blue-100 uppercase">
                Yatay Kayıtlar
              </div>
              <div className="text-sm font-black text-white font-mono flex-1">
                {parameters.horizontalDividers}
              </div>
              <div className="text-xs font-bold text-blue-200">ADET</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* PROFİL KALINLIĞI */}
            <div className="flex flex-col items-start bg-gradient-to-r from-purple-600 to-purple-700 border-2 border-purple-400 p-3 shadow-brutal-sm">
              <div className="text-xs font-bold text-purple-100 uppercase tracking-wide">
                Profil Kalınlığı (t)
              </div>
              <div className="text-sm font-black text-white font-mono flex-1">
                {parameters.profileThickness}
              </div>
              <div className="text-xs font-bold text-purple-200">mm</div>
            </div>

            {/* ÖZEL PROFİL SAYISI */}
            <div className="flex flex-col items-start bg-gradient-to-r from-yellow-600 to-yellow-700 border-2 border-yellow-400 p-3 shadow-brutal-sm">
              <div className="text-xs font-bold text-yellow-100 uppercase tracking-wide">
                Özel Profil Sayısı
              </div>
              <div className="text-sm font-black text-white font-mono flex-1">
                {customDividers.length}
              </div>
              <div className="text-xs font-bold text-yellow-200">ADET</div>
            </div>
          </div>
        </div>
      </div>

      {/* RENK KODLARI SEKSİYONU */}
      <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border-3 border-zinc-600 shadow-brutal">
        <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 border-b-2 border-zinc-500 p-3">
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
            Renk Kodları
          </h3>
        </div>

        <div className="p-4 space-y-2">
          {/* Ana Çerçeve */}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-zinc-700 to-zinc-800 border border-zinc-500 p-2">
            <div className="w-4 h-4 bg-black border border-zinc-400"></div>
            <span className="text-xs font-bold text-zinc-200 uppercase">
              Ana Çerçeve (Siyah çizgi)
            </span>
          </div>

          {/* Dikey Profiller */}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-zinc-700 to-zinc-800 border border-zinc-500 p-2">
            <div className="w-4 h-4 bg-red-500 border border-zinc-400 opacity-30"></div>
            <span className="text-xs font-bold text-zinc-200 uppercase">
              Dikey Profiller (Kırmızı)
            </span>
          </div>

          {/* Yatay Profiller */}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-zinc-700 to-zinc-800 border border-zinc-500 p-2">
            <div className="w-4 h-4 bg-blue-500 border border-zinc-400 opacity-30"></div>
            <span className="text-xs font-bold text-zinc-200 uppercase">
              Yatay Profiller (Mavi)
            </span>
          </div>

          {/* Özel Dikey Profiller */}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-zinc-700 to-zinc-800 border border-zinc-500 p-2">
            <div className="w-4 h-4 bg-orange-500 border border-zinc-400 opacity-30"></div>
            <span className="text-xs font-bold text-zinc-200 uppercase">
              Özel Dikey (Turuncu)
            </span>
          </div>

          {/* Özel Yatay Profiller */}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-zinc-700 to-zinc-800 border border-zinc-500 p-2">
            <div className="w-4 h-4 bg-purple-500 border border-zinc-400 opacity-30"></div>
            <span className="text-xs font-bold text-zinc-200 uppercase">
              Özel Yatay (Mor)
            </span>
          </div>

          {/* Referans Hatları */}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-zinc-700 to-zinc-800 border border-zinc-500 p-2">
            <div className="w-4 h-4 bg-black border border-zinc-400 border-dashed"></div>
            <span className="text-xs font-bold text-zinc-200 uppercase">
              Referans Hatları (Siyah kesikli)
            </span>
          </div>

          {/* Kalınlık Hatları */}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-zinc-700 to-zinc-800 border border-zinc-500 p-2">
            <div className="w-4 h-4 bg-gray-500 border border-zinc-400 border-dashed"></div>
            <span className="text-xs font-bold text-zinc-200 uppercase">
              Kalınlık Hatları (Gri kesikli)
            </span>
          </div>
        </div>
      </div>

      {/* TEKNİK NOTLAR SEKSİYONU */}
      <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border-3 border-zinc-600 shadow-brutal">
        <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 border-b-2 border-zinc-500 p-3">
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
            Teknik Notlar ve Açıklamalar
          </h3>
        </div>

        <div className="p-4 space-y-3 text-xs text-zinc-300">
          {/* Ölçüm Prensipleri */}
          <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 border border-zinc-500 p-3">
            <div className="font-bold text-zinc-100 mb-1">
              ÖLÇÜM PRENSİPLERİ:
            </div>
            <div>• Mesafeler: Referans hatları (profil merkezleri) arası</div>
            <div>• Kalınlık: Her profilin iç çerçevesi (t değeri)</div>
            <div>• Boyutlar: Ana çerçeve dış kenarları arası</div>
            <div>• Koordinatlar: Sol-üst köşe (0,0) referans noktası</div>
          </div>

          {/* Uyarı Sistemi */}
          <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 border border-zinc-500 p-3">
            <div className="font-bold text-zinc-100 mb-1">UYARI SİSTEMİ:</div>
            <div>• Çakışma tespiti: Profiller arası örtüşme kontrolü</div>
            <div>• Kalınlık doğrulama: Geometrik limit kontrolü</div>
            <div>• Gerçek zamanlı uyarı: Anında geri bildirim</div>
            <div>• Kategorik uyarılar: Yatay/Dikey/Kalınlık ayrımı</div>
          </div>

          {/* Export Bilgileri */}
          <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 border border-zinc-500 p-3">
            <div className="font-bold text-zinc-100 mb-1">
              EXPORT ÖZELLİKLERİ:
            </div>
            <div>• SVG Format: Vektörel, ölçeklenebilir çıktı</div>
            <div>• Tüm etiketler: Ölçü ve isim etiketleri dahil</div>
            <div>• Renk korunur: Tüm profil renkleri export edilir</div>
            <div>• Otomatik isim: Timestamp ile benzersiz dosya adı</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
