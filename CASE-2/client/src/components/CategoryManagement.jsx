import { useState } from 'react'
import { useCategories } from '../hooks/useCategories.js'

const CategoryManagement = () => {
  const [newCategory, setNewCategory] = useState('')
  const { categories, categoriesError, categoriesLoading, addCategory } =
    useCategories()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newCategory.trim()) return

    const result = await addCategory(newCategory)
    if (result.success) {
      setNewCategory('')
      alert(result.message)
    } else {
      alert(`Hata: ${result.message}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Kategori Ekleme */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📂 Yeni Kategori Ekle
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Kategori adını girin"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Kategori Ekle
          </button>
        </form>
      </div>

      {/* Kategori Listesi */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📋 Kategoriler
        </h2>

        {categoriesError && (
          <p className="text-red-500">Kategoriler yüklenirken hata oluştu</p>
        )}

        {categoriesLoading && (
          <p className="text-gray-500">Kategoriler yükleniyor...</p>
        )}

        {categories.length > 0 ? (
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category._id}
                className="p-3 bg-gray-50 rounded-md border border-gray-200"
              >
                <span className="font-medium text-black">{category.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({new Date(category.createdAt).toLocaleDateString('tr-TR')})
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Henüz kategori yok</p>
        )}
      </div>
    </div>
  )
}

export default CategoryManagement
