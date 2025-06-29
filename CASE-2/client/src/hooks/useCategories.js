import useSWR, { mutate } from 'swr'
import { fetcher, endpoints, categoryAPI } from '../services/api.js'

export const useCategories = () => {
  const { data, error, isLoading } = useSWR(endpoints.categories, fetcher)

  const addCategory = async (name) => {
    try {
      await categoryAPI.create(name)
      mutate(endpoints.categories)
      return { success: true, message: 'Kategori başarıyla eklendi!' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  return {
    categories: data?.data?.categories || [],
    categoriesError: error,
    categoriesLoading: isLoading,
    addCategory,
  }
}
