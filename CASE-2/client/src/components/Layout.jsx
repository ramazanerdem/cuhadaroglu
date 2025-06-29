import useSWR from 'swr'
import axios from 'axios'

const fetcher = (url) => axios.get(url).then((res) => res.data)
const Layout = ({ children }) => {
  // health check with SWR
  const {
    data: health,
    isLoading,
    error,
  } = useSWR('http://localhost:3000/health', fetcher)
  return (
    <div className="min-h-screen mx-auto bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          🛍️ Ürün Yönetim Sistemi
        </h1>

        {children}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500">
          <p>
            Server durumu:{' '}
            <span
              className={`${
                isLoading
                  ? 'text-yellow-500'
                  : error
                  ? 'text-red-500'
                  : health?.success
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {isLoading
                ? 'Yükleniyor...'
                : error
                ? 'Bağlantı Hatası'
                : health?.success
                ? 'Çalışıyor'
                : 'Çalışmıyor'}
            </span>
          </p>
          <p>
            Database durumu:{' '}
            <span
              className={`${
                isLoading
                  ? 'text-yellow-500'
                  : error
                  ? 'text-red-500'
                  : health?.db
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {isLoading
                ? 'Yükleniyor...'
                : error
                ? 'Bilinmiyor'
                : health?.db
                ? 'Çalışıyor'
                : 'Çalışmıyor'}
            </span>
          </p>
          <p className="text-sm mt-2">
            Bu arayüz backend API'sini test etmek için oluşturulmuştur.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Layout
