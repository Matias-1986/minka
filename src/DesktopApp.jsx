import { useState } from 'react'
import DesktopAccountPage from './components/desktop/DesktopAccountPage'
import DesktopExplorePage from './components/desktop/DesktopExplorePage'
import DesktopHeader from './components/desktop/DesktopHeader'
import DesktopInvestmentDetailPage from './components/desktop/DesktopInvestmentDetailPage'
import DesktopNotificationsPage from './components/desktop/DesktopNotificationsPage'
import DesktopOpportunityDetailPage from './components/desktop/DesktopOpportunityDetailPage'
import DesktopPortfolioPage from './components/desktop/DesktopPortfolioPage'
import { useAppData } from './context/AppDataContext'
import { useAuth } from './context/AuthContext'

export default function DesktopApp() {
  const [activeNav, setActiveNav] = useState('explore')
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const [selectedHolding, setSelectedHolding] = useState(null)
  const [settingsSection, setSettingsSection] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const { isAuthenticated, promptLogin, logout } = useAuth()
  const { notifications, unreadCount, favorites, toggleFavorite } = useAppData()

  const guardAuth = (action) => {
    if (!isAuthenticated) {
      promptLogin()
      return
    }
    action()
  }

  const goToPortfolio = () => {
    setActiveNav('investments')
    setSelectedOpportunity(null)
    setSelectedHolding(null)
    setShowNotifications(false)
  }

  const openSettings = (section) => guardAuth(() => setSettingsSection(section))
  const closeSettings = () => setSettingsSection(null)

  const headerProps = {
    hasNotification: unreadCount > 0,
    notifications,
    onViewAllNotifications: () => guardAuth(() => setShowNotifications(true)),
    onOpenSettings: openSettings,
    onLogout: () => {
      closeSettings()
      logout()
    },
  }

  if (settingsSection) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <DesktopHeader
          activeNav={activeNav}
          onNavChange={(nav) => {
            closeSettings()
            setActiveNav(nav)
          }}
          {...headerProps}
        />
        <DesktopAccountPage
          initialSection={settingsSection}
          onClose={closeSettings}
          onLogout={closeSettings}
        />
      </div>
    )
  }

  if (showNotifications) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <DesktopHeader
          activeNav={activeNav}
          onNavChange={(nav) => {
            setShowNotifications(false)
            setActiveNav(nav)
          }}
          {...headerProps}
        />
        <DesktopNotificationsPage
          notifications={notifications}
          onBack={() => setShowNotifications(false)}
          onSelectNotification={() => setShowNotifications(false)}
        />
      </div>
    )
  }

  if (selectedHolding) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <DesktopHeader
          activeNav="investments"
          onNavChange={(nav) => {
            setSelectedHolding(null)
            setActiveNav(nav)
          }}
          {...headerProps}
          showBack
          onBack={() => setSelectedHolding(null)}
        />
        <DesktopInvestmentDetailPage
          holding={selectedHolding.holding}
          opportunity={selectedHolding.opportunity}
        />
      </div>
    )
  }

  if (selectedOpportunity) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <DesktopHeader
          activeNav={activeNav}
          onNavChange={(nav) => {
            setSelectedOpportunity(null)
            setActiveNav(nav)
          }}
          {...headerProps}
          showBack
          onBack={() => setSelectedOpportunity(null)}
        />
        <DesktopOpportunityDetailPage
          opportunity={selectedOpportunity}
          onGoToPortfolio={goToPortfolio}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <DesktopHeader
        activeNav={activeNav}
        onNavChange={(nav) => {
          if (nav === 'investments') guardAuth(() => setActiveNav(nav))
          else setActiveNav(nav)
        }}
        {...headerProps}
      />

      {activeNav === 'explore' ? (
        <DesktopExplorePage
          favorites={favorites}
          onToggleFavorite={(id) => guardAuth(() => toggleFavorite(id))}
          onSelectOpportunity={setSelectedOpportunity}
          onGoToPortfolio={goToPortfolio}
        />
      ) : (
        <DesktopPortfolioPage
          onSelectHolding={setSelectedHolding}
          onSelectOpportunity={setSelectedOpportunity}
          onExplore={() => setActiveNav('explore')}
          onGoToPortfolio={goToPortfolio}
        />
      )}
    </div>
  )
}
