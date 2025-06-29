const ProductList = ({
  products,
  pagination,
  productsError,
  productsLoading,
  onPageChange,
}) => {
  if (productsError) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-red-500">Ürünler yüklenirken hata oluştu</p>
      </div>
    )
  }

  if (productsLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Ürünler yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">📦 Ürünler</h2>

      {products.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition duration-200"
              >
                <h3 className="font-semibold text-lg text-gray-900">
                  {product.name}
                </h3>
                <p className="text-green-600 font-bold text-xl">
                  ₺{product.price.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  Kategori: {product.category?.name || 'Bilinmiyor'}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(product.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="mt-6 flex justify-center items-center space-x-4">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Önceki
              </button>

              <span className="text-gray-700">
                Sayfa {pagination.currentPage} / {pagination.totalPages} (
                {pagination.totalProducts} ürün)
              </span>

              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sonraki
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Henüz ürün bulunmuyor</p>
        </div>
      )}
    </div>
  )
}

export default ProductList
