import DesktopApp from './DesktopApp'
import MobileApp from './MobileApp'
import { AppDataProvider } from './context/AppDataContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useIsMobile } from './hooks/useIsMobile'
import LoginPage from './pages/LoginPage'

function AppShell() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileApp /> : <DesktopApp />
}

function AppRoot() {
  const { loading, requireLogin, login, dismissLogin } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[15px] text-[#888]">Cargando…</p>
      </div>
    )
  }

  if (requireLogin) {
    return <LoginPage onLogin={login} onBrowseWithoutAccount={dismissLogin} />
  }

  return (
    <AppDataProvider>
      <AppShell />
    </AppDataProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoot />
    </AuthProvider>
  )
}
