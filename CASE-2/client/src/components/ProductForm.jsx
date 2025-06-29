import { useState } from 'react'
import { useCategories } from '../hooks/useCategories.js'

const ProductForm = ({ onProductAdded }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    categoryId: '',
  })

  const { categories } = useCategories()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !newProduct.name.trim() ||
      !newProduct.price ||
      !newProduct.categoryId
    ) {
      alert('Tüm alanları doldurun!')
      return
    }

    const result = await onProductAdded(newProduct)

    if (result?.success) {
      setNewProduct({ name: '', price: '', categoryId: '' })
      alert(result.message)
    } else {
      alert(`Hata: ${result?.message || 'Bilinmeyen hata'}`)
    }
  }

  const handleInputChange = (field, value) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        📦 Yeni Ürün Ekle
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={newProduct.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Ürün adını girin"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="number"
          step="0.01"
          value={newProduct.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
          placeholder="Fiyat (₺)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <select
          value={newProduct.categoryId}
          onChange={(e) => handleInputChange('categoryId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
        >
          <option value="">Kategori seçin</option>
          {categories.map((category) => (
            <option
              key={category._id}
              value={category._id}
              className="text-black"
            >
              {category.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
        >
          Ürün Ekle
        </button>
      </form>
    </div>
  )
}

export default ProductForm
