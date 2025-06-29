import { useCategories } from '../hooks/useCategories.js'

const ProductFilters = ({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
}) => {
  const { categories } = useCategories()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        🔍 Ürün Arama ve Filtreleme
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Ürün ismine göre arama yapın"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default ProductFilters
