import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'

/** bfcache 복귀 시 URL과 라우터 상태를 다시 맞춤 */
function HistorySync() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) {
        return
      }

      const { pathname, search, hash } = window.location
      const current = `${location.pathname}${location.search}${location.hash}`

      if (current !== `${pathname}${search}${hash}`) {
        navigate(`${pathname}${search}${hash}`, { replace: true })
      }
    }

    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [location.pathname, location.search, location.hash, navigate])

  return null
}

function AppRoutes() {
  return (
    <>
      <HistorySync />
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
