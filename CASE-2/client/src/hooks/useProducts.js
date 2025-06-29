import useSWR, { mutate } from 'swr'
import { fetcher, productAPI } from '../services/api.js'

export const useProducts = (filters = {}) => {
  const url = productAPI.buildUrl({
    page: filters.page || 1,
    limit: filters.limit || 5,
    search: filters.search,
    category: filters.category,
  })

  const { data, error, isLoading } = useSWR(url, fetcher)

  const addProduct = async (productData) => {
    try {
      await productAPI.create(productData)
      mutate(url)
      return { success: true, message: 'Ürün başarıyla eklendi!' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const refreshProducts = () => {
    mutate(url)
  }

  return {
    products: data?.data?.products || [],
    pagination: data?.data?.pagination,
    productsError: error,
    productsLoading: isLoading,
    addProduct,
    refreshProducts,
  }
}
