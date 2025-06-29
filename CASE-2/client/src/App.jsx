import { useState } from 'react'
import Layout from './components/Layout.jsx'
import CategoryManagement from './components/CategoryManagement.jsx'
import ProductForm from './components/ProductForm.jsx'
import ProductFilters from './components/ProductFilters.jsx'
import ProductList from './components/ProductList.jsx'
import { useProducts } from './hooks/useProducts.js'

function App() {
  // State management for filters and pagination
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Use products hook with current filters
  const filters = {
    page: currentPage,
    limit: 5,
    search: searchTerm,
    category: selectedCategory,
  }

  const { products, pagination, productsError, productsLoading, addProduct } =
    useProducts(filters)

  // Handle filter changes and reset pagination
  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCategoryChange = (value) => {
    setSelectedCategory(value)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Sol Kolon - Kategori Yönetimi */}
        <CategoryManagement />

        {/* Sağ Kolon - Ürün Yönetimi */}
        <div className="space-y-6">
          <ProductForm onProductAdded={addProduct} />
          <ProductFilters
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </div>

      {/* Ürün Listesi */}
      <div className="mt-8">
        <ProductList
          products={products}
          pagination={pagination}
          productsError={productsError}
          productsLoading={productsLoading}
          onPageChange={handlePageChange}
        />
      </div>
    </Layout>
  )
}

export default App
