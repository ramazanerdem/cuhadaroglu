/**
 * ÖZEL PROFİL EKLEME PANELİ BİLEŞENİ
 *
 * Kullanıcının standart ızgara dışında, manuel olarak belirledikleri konumlara
 * özel profiller eklemesi için kullanılan arayüz bileşeni. Dikey ve yatay
 * profiller için ayrı ayrı kontrol sağlar.
 */

import React, { useState } from 'react'
import type { CustomDivider, DrawingParameters } from '../types'

/**
 * ÖZEL PROFİL PANELİ PROPS ARABIRIMI
 *
 * Parent bileşenlerden alınan veriler ve callback fonksiyonları.
 */
interface CustomDividersPanelProps {
  /** Mevcut özel profiller listesi */
  customDividers: CustomDivider[]

  /** Çizim parametreleri - sınır kontrolü için kullanılır */
  parameters: DrawingParameters

  /** Yeni özel profil eklendiğinde çağrılan callback */
  onAddDivider: (divider: Omit<CustomDivider, 'id'>) => void

  /** Özel profil silindiğinde çağrılan callback */
  onRemoveDivider: (id: string) => void
}

/**
 * ANA ÖZEL PROFİL PANELİ BİLEŞENİ
 *
 * Form state'i yönetir ve kullanıcı etkileşimlerini handle eder.
 * Validasyon kontrolü yaparak geçersiz girişleri engeller.
 */
const CustomDividersPanel: React.FC<CustomDividersPanelProps> = ({
  customDividers,
  parameters,
  onAddDivider,
  onRemoveDivider,
}) => {
  // FORM STATE YÖNETİMİ
  /** Seçili profil türü - dikey veya yatay */
  const [selectedType, setSelectedType] = useState<'vertical' | 'horizontal'>(
    'vertical'
  )

  /** Profil konumu için girilen değer */
  const [position, setPosition] = useState<string>('')

  /** Profil için girilen isim/etiket */
  const [label, setLabel] = useState<string>('')

  /**
   * YENİ PROFİL EKLEME FONKSİYONU
   *
   * Form verilerini validasyona tabi tutar ve geçerli ise yeni profil ekler.
   * Başarılı ekleme sonrası form alanlarını temizler.
   */
  const handleAddDivider = () => {
    // Boş alan kontrolü
    if (!position || !label) {
      alert('Lütfen konum ve etiket alanlarını doldurun.')
      return
    }

    const positionValue = parseFloat(position)

    // Sayısal değer kontrolü
    if (isNaN(positionValue)) {
      alert('Lütfen geçerli bir sayı girin.')
      return
    }

    // SINIR KONTROLLERI
    if (selectedType === 'vertical') {
      // Dikey profiller için genişlik sınırı kontrolü
      if (
        positionValue < 0 ||
        positionValue > parameters.width - parameters.profileWidth
      ) {
        alert(
          `Dikey profil konumu 0 ile ${
            parameters.width - parameters.profileWidth
          } mm arasında olmalıdır.`
        )
        return
      }
    } else {
      // Yatay profiller için yükseklik sınırı kontrolü
      if (
        positionValue < 0 ||
        positionValue > parameters.height - parameters.profileHeight
      ) {
        alert(
          `Yatay profil konumu 0 ile ${
            parameters.height - parameters.profileHeight
          } mm arasında olmalıdır.`
        )
        return
      }
    }

    // ÇAKIŞMA KONTROLÜ - Aynı konumda profil var mı?
    const isDuplicate = customDividers.some(
      (divider) =>
        divider.type === selectedType &&
        Math.abs(divider.position - positionValue) < 1 // 1mm tolerans
    )

    if (isDuplicate) {
      alert('Bu konumda zaten bir profil bulunmaktadır.')
      return
    }

    // YENİ PROFİL OLUŞTUR VE EKLE
    const newDivider: Omit<CustomDivider, 'id'> = {
      type: selectedType,
      position: positionValue,
      label: label.trim(), // Boşlukları temizle
    }

    onAddDivider(newDivider)

    // FORM ALANLARINI TEMİZLE
    setPosition('')
    setLabel('')
  }

  /**
   * PROFİL SİLME FONKSİYONU
   *
   * Kullanıcı onayı ile seçili profili siler.
   *
   * @param id - Silinecek profilin benzersiz kimliği
   * @param dividerLabel - Profil etiketi (onay mesajı için)
   */
  const handleRemoveDivider = (id: string, dividerLabel: string) => {
    if (
      confirm(`"${dividerLabel}" profilini silmek istediğinizden emin misiniz?`)
    ) {
      onRemoveDivider(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* YENİ PROFİL EKLEME FORMU */}
      <div className="bg-gradient-to-b from-zinc-700 to-zinc-800 border-3 border-zinc-500 p-4 space-y-4 shadow-brutal">
        <div className="text-sm font-bold text-zinc-100 uppercase tracking-wide mb-4">
          ➕ Yeni Özel Profil Ekle
        </div>

        {/* PROFİL TÜRÜ SEÇİMİ */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-200 uppercase">
            Profil Türü
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedType('vertical')}
              className={`p-3 font-bold uppercase border-2 transition-all ${
                selectedType === 'vertical'
                  ? 'bg-red-600 border-red-400 text-white shadow-brutal-sm'
                  : 'bg-zinc-800 border-zinc-600 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              ▌ Dikey
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('horizontal')}
              className={`p-3 font-bold uppercase border-2 transition-all ${
                selectedType === 'horizontal'
                  ? 'bg-blue-600 border-blue-400 text-white shadow-brutal-sm'
                  : 'bg-zinc-800 border-zinc-600 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              ▬ Yatay
            </button>
          </div>
        </div>

        {/* KONUM GİRİŞİ */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-200 uppercase">
            {selectedType === 'vertical'
              ? 'Sol Kenardan Mesafe (mm)'
              : 'Alt Kenardan Yükseklik (mm)'}
          </label>

          {/* RANGE SLIDER KONTROLÜ */}
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max={
                selectedType === 'vertical'
                  ? parameters.width - parameters.profileWidth
                  : parameters.height - parameters.profileHeight
              }
              step="1"
              value={position || '0'}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: (() => {
                  const currentValue = parseFloat(position) || 0
                  const maxValue =
                    selectedType === 'vertical'
                      ? parameters.width - parameters.profileWidth
                      : parameters.height - parameters.profileHeight
                  const percentage =
                    maxValue > 0 ? (currentValue / maxValue) * 100 : 0

                  return `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #52525b ${percentage}%, #52525b 100%)`
                })(),
              }}
            />

            {/* NUMERİK INPUT KONTROLÜ */}
            <input
              type="number"
              min="0"
              max={
                selectedType === 'vertical'
                  ? parameters.width - parameters.profileWidth
                  : parameters.height - parameters.profileHeight
              }
              step="1"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full bg-zinc-800 border-2 border-zinc-500 text-white font-mono px-3 py-2 rounded focus:border-zinc-300 focus:outline-none"
              placeholder={
                selectedType === 'vertical'
                  ? `0 - ${parameters.width - parameters.profileWidth}`
                  : `0 - ${parameters.height - parameters.profileHeight}`
              }
            />
          </div>

          {/* MEVCUT DEĞER GÖSTERGESİ */}
          <div className="text-xs text-zinc-300 text-center">
            Mevcut Değer:{' '}
            <span className="font-mono font-bold text-zinc-100">
              {position || '0'} mm
            </span>
            <span className="text-zinc-500 ml-2">
              /{' '}
              {selectedType === 'vertical'
                ? parameters.width - parameters.profileWidth
                : parameters.height - parameters.profileHeight}{' '}
              mm max
            </span>
          </div>
        </div>

        {/* ETIKET GİRİŞİ */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-200 uppercase">
            Profil Etiketi
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full bg-zinc-800 border-2 border-zinc-500 text-white px-3 py-2 rounded focus:border-zinc-300 focus:outline-none"
            placeholder="Örn: Orta Bölme, Kapı Çerçevesi"
            maxLength={30}
          />
        </div>

        {/* EKLE BUTONU */}
        <button
          onClick={handleAddDivider}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 border-2 border-green-400 text-white font-bold py-3 px-4 uppercase tracking-wide shadow-brutal-sm hover:from-green-500 hover:to-green-600 transition-all"
        >
          ➕ Profil Ekle
        </button>
      </div>

      {/* MEVCUT ÖZEL PROFİLLER LİSTESİ */}
      {customDividers.length > 0 && (
        <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border-3 border-zinc-600 shadow-brutal">
          <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 border-b-2 border-zinc-500 p-3">
            <div className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
              📋 Mevcut Özel Profiller ({customDividers.length})
            </div>
          </div>

          <div className="p-4 space-y-3">
            {customDividers.map((divider) => (
              <div
                key={divider.id}
                className={`p-4 border-2 rounded-lg flex items-center justify-between ${
                  divider.type === 'vertical'
                    ? 'bg-red-900/20 border-red-500/50'
                    : 'bg-blue-900/20 border-blue-500/50'
                }`}
              >
                {/* PROFİL BİLGİLERİ */}
                <div className="flex items-center space-x-4">
                  <div
                    className={`text-2xl ${
                      divider.type === 'vertical'
                        ? 'text-red-400'
                        : 'text-blue-400'
                    }`}
                  >
                    {divider.type === 'vertical' ? '▌' : '▬'}
                  </div>

                  <div>
                    <div className="font-bold text-white text-sm">
                      {divider.label}
                    </div>
                    <div className="text-xs text-zinc-300">
                      {divider.type === 'vertical'
                        ? `Sol kenardan ${divider.position} mm`
                        : `Alt kenardan ${divider.position} mm`}
                    </div>
                    <div className="text-xs text-zinc-400 uppercase">
                      {divider.type === 'vertical'
                        ? 'Dikey Profil'
                        : 'Yatay Profil'}
                    </div>
                  </div>
                </div>

                {/* SİLME BUTONU */}
                <button
                  onClick={() => handleRemoveDivider(divider.id, divider.label)}
                  className="bg-red-600 hover:bg-red-500 border-2 border-red-400 text-white font-bold px-3 py-2 rounded-lg transition-all shadow-brutal-sm"
                  title={`${divider.label} profilini sil`}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOŞLUK DURUMU MESAJI */}
      {customDividers.length === 0 && (
        <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border-3 border-zinc-600 p-6 text-center shadow-brutal">
          <div className="text-zinc-400 text-sm">
            Henüz özel profil eklenmemiş. Yukarıdaki formu kullanarak yeni
            profiller ekleyebilirsiniz.
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomDividersPanel
