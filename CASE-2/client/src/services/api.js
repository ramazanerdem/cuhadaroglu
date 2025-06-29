import axios from 'axios'

// API base URL
const API_BASE = 'http://localhost:3000/api/v1'

// Axios instance oluştur
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - her istekten önce çalışır
apiClient.interceptors.request.use(
  function (config) {
    // İsteği log'la
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// Response interceptor - her yanıttan sonra çalışır
apiClient.interceptors.response.use(
  function (response) {
    console.log('API Response:', response.status, response.config.url)
    return response
  },
  function (error) {
    if (error.response) {
      console.error(
        'API Error Response:',
        error.response.status,
        error.response.data
      )
    } else if (error.request) {
      // İstek gönderildi ama yanıt alınamadı
      console.error('API Request Error:', error.request)
    } else {
      // İstek oluşturulurken hata oluştu
      console.error('API Setup Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// SWR için fetcher function
export const fetcher = (url) => apiClient.get(url).then((res) => res.data)

// API endpoints
export const endpoints = {
  categories: '/categories',
  products: '/products',
}

// Category API functions
export const categoryAPI = {
  create: async (name) => {
    try {
      const response = await apiClient.post(endpoints.categories, {
        name: name.trim(),
      })
      return response.data
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Kategori oluşturulamadı')
    }
  },
}

// Product API functions
export const productAPI = {
  create: async (productData) => {
    try {
      const response = await apiClient.post(endpoints.products, {
        name: productData.name.trim(),
        price: parseFloat(productData.price),
        categoryId: productData.categoryId,
      })
      return response.data
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Ürün oluşturulamadı')
    }
  },

  buildUrl: (filters = {}) => {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString())
      }
    })

    return `${endpoints.products}?${params.toString()}`
  },
}

// Export axios instance for advanced usage
export { apiClient }
export default apiClient
