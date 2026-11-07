import { useMemo, useState } from 'react'
import AccountPage from './AccountPage'
import { useAppData } from './context/AppDataContext'
import { useAuth } from './context/AuthContext'
import { useOpportunities } from './hooks/useOpportunities'
import EmailNotificationPreview from './EmailNotificationPreview'
import { BottomNav, MincaLogo, ProfileAvatar } from './components/AppChrome'
import InAppNotificationBanner from './components/InAppNotificationBanner'
import InvestmentDetailPage from './InvestmentDetailPage'
import InvestmentReportsPage from './InvestmentReportsPage'
import NotificationDetailPage from './NotificationDetailPage'
import NotificationsPage from './NotificationsPage'
import OpportunityDetailPage from './OpportunityDetailPage'
import PortfolioPage from './PortfolioPage'

const TABS = [
  { id: 'abiertas', label: 'Abiertas' },
  { id: 'proximas', label: 'Próximas' },
  { id: 'favoritas', label: 'Favoritas' },
]

const CATEGORIES = [
  { id: 'todas', label: 'Todas', icon: 'grid' },
  { id: 'real-estate', label: 'Real Estate', icon: 'building' },
  { id: 'agro', label: 'Agro', icon: 'cow' },
  { id: 'energia', label: 'Energía', icon: 'bolt' },
]

function CategoryIcon({ type }) {
  const cls = 'w-[18px] h-[18px]'
  if (type === 'grid') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    )
  }
  if (type === 'building') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
      </svg>
    )
  }
  if (type === 'cow') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 12c0-3 2-5 5-5h6c3 0 5 2 5 5v4H4v-4z" />
        <circle cx="8" cy="10" r="1" fill="currentColor" />
        <circle cx="16" cy="10" r="1" fill="currentColor" />
        <path d="M7 7V5M17 7V5" />
      </svg>
    )
  }
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

function OpportunityCard({ opportunity, isFavorite, onToggleFavorite, onSelect }) {
  const { title, categoryLabel, tna, funded, minInvestment, image } = opportunity

  return (
    <article
      className="relative w-full h-[340px] rounded-[22px] overflow-hidden shadow-sm cursor-pointer"
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      role="button"
      tabIndex={0}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-sm">
        <span className="text-white text-[13px] font-medium">{tna}</span>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite()
        }}
        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center"
        aria-label="Agregar a favoritos"
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill={isFavorite ? 'white' : 'none'}
          stroke="white"
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      <div className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-16 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
        <div className="flex items-center gap-1.5 mb-1">
          <CategoryIcon type={CATEGORIES.find((c) => c.id === opportunity.category)?.icon || 'grid'} />
          <span className="text-white/80 text-[12px]">{categoryLabel}</span>
        </div>

        <h2 className="text-white text-[22px] font-semibold leading-tight mb-4">{title}</h2>

        <div className="flex items-end justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white/70 text-[12px]">Fondeado: {funded}%</span>
            </div>
            <div className="h-[3px] rounded-full bg-white/25 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${funded}%` }}
              />
            </div>
          </div>
          <span className="text-white/80 text-[12px] whitespace-nowrap shrink-0">
            Desde {minInvestment}
          </span>
        </div>
      </div>
    </article>
  )
}

export default function OpportunitiesPage() {
  const [view, setView] = useState('explore')
  const [activeTab, setActiveTab] = useState('abiertas')
  const [activeCategory, setActiveCategory] = useState('todas')
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const [selectedHolding, setSelectedHolding] = useState(null)
  const [showAccount, setShowAccount] = useState(false)
  const [notifScreen, setNotifScreen] = useState(null)
  const [selectedNotifId, setSelectedNotifId] = useState(null)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [reportsOpportunityId, setReportsOpportunityId] = useState(null)

  const { isAuthenticated, promptLogin } = useAuth()
  const { notifications, unreadCount, favorites, toggleFavorite, markRead } = useAppData()

  const guardAuth = (action) => {
    if (!isAuthenticated) {
      promptLogin()
      return
    }
    action()
  }
  const { opportunities, loading, error } = useOpportunities({
    tab: activeTab,
    category: activeCategory,
  })

  const bannerNotification = useMemo(
    () => notifications.find((n) => !n.read && n.showBanner && !bannerDismissed),
    [notifications, bannerDismissed],
  )

  const selectedNotification = useMemo(
    () => notifications.find((n) => n.id === selectedNotifId),
    [notifications, selectedNotifId],
  )

  const openNotification = (notification) => {
    markRead(notification.id)
    setSelectedNotifId(notification.id)
    setNotifScreen('detail')
  }

  const openReports = (opportunityId) => {
    setNotifScreen(null)
    setShowAccount(false)
    setSelectedNotifId(null)
    setReportsOpportunityId(opportunityId)
  }

  const goToExplore = () => {
    setView('explore')
    setSelectedOpportunity(null)
    setSelectedHolding(null)
  }

  const goToPortfolio = () => {
    guardAuth(() => {
      setView('portfolio')
      setSelectedOpportunity(null)
      setSelectedHolding(null)
    })
  }

  if (reportsOpportunityId) {
    return (
      <InvestmentReportsPage
        opportunityId={reportsOpportunityId}
        onBack={() => setReportsOpportunityId(null)}
      />
    )
  }

  if (notifScreen === 'email' && selectedNotification) {
    return (
      <EmailNotificationPreview
        notification={selectedNotification}
        onBack={() => setNotifScreen('detail')}
        onViewReport={openReports}
      />
    )
  }

  if (notifScreen === 'detail' && selectedNotification) {
    return (
      <NotificationDetailPage
        notification={selectedNotification}
        onBack={() => setNotifScreen('list')}
        onViewReport={openReports}
        onViewEmail={() => setNotifScreen('email')}
      />
    )
  }

  if (notifScreen === 'list') {
    return (
      <NotificationsPage
        notifications={notifications}
        onBack={() => setNotifScreen(null)}
        onSelect={openNotification}
      />
    )
  }

  if (showAccount) {
    return (
      <AccountPage
        onClose={() => setShowAccount(false)}
        onOpenNotifications={() => {
          setShowAccount(false)
          setNotifScreen('list')
        }}
        unreadCount={unreadCount}
      />
    )
  }

  if (selectedHolding) {
    return (
      <InvestmentDetailPage
        holding={selectedHolding.holding}
        opportunity={selectedHolding.opportunity}
        onBack={() => setSelectedHolding(null)}
        onOpenAccount={() => guardAuth(() => setShowAccount(true))}
        hasNotification={unreadCount > 0}
      />
    )
  }

  if (selectedOpportunity) {
    return (
      <OpportunityDetailPage
        opportunity={selectedOpportunity}
        onBack={() => {
          setSelectedOpportunity(null)
          if (view === 'portfolio') setView('portfolio')
        }}
        onGoToPortfolio={goToPortfolio}
      />
    )
  }

  if (view === 'portfolio') {
    return (
      <PortfolioPage
        onExplore={goToExplore}
        onSelectHolding={setSelectedHolding}
        onSelectOpportunity={(opp) => {
          setSelectedOpportunity(opp)
        }}
        onOpenAccount={() => guardAuth(() => setShowAccount(true))}
        hasNotification={unreadCount > 0}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-[#FAFAFA] relative pb-28">
        {/* Header */}
        <header className="flex items-center justify-between px-5 pt-12 pb-4">
          <MincaLogo />
          <ProfileAvatar
            onClick={() => guardAuth(() => setShowAccount(true))}
            hasNotification={unreadCount > 0}
          />
        </header>

        <InAppNotificationBanner
          notification={bannerNotification}
          onView={() => openNotification(bannerNotification)}
          onDismiss={() => setBannerDismissed(true)}
        />

        {/* Title */}
        <h1 className="px-5 text-[32px] font-bold text-[#1A1A1A] tracking-tight mb-5">
          Oportunidades
        </h1>

        {/* Primary tabs */}
        <div className="px-5 flex gap-2 mb-5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id === 'favoritas') guardAuth(() => setActiveTab(tab.id))
                else setActiveTab(tab.id)
              }}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-white text-[#1A1A1A] border border-[#E5E5E5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category chips */}
        <div className="px-5 flex gap-5 overflow-x-auto scrollbar-hide mb-6 pb-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center gap-1.5 shrink-0 transition-colors ${
                  isActive ? 'text-[#1A1A1A]' : 'text-[#999]'
                }`}
              >
                <CategoryIcon type={cat.icon} />
                <span className="text-[12px] font-medium">{cat.label}</span>
                {isActive && <div className="w-full h-[2px] bg-[#1A1A1A] rounded-full" />}
              </button>
            )
          })}
        </div>

        {/* Cards */}
        <div className="px-5 flex flex-col gap-4">
          {loading && (
            <p className="text-center py-12 text-[14px] text-[#888]">Cargando oportunidades…</p>
          )}
          {error && (
            <p className="text-center py-12 text-[14px] text-[#DC2626]">{error}</p>
          )}
          {!loading && !error && opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              isFavorite={favorites.has(opp.id)}
              onToggleFavorite={() => guardAuth(() => toggleFavorite(opp.id))}
              onSelect={() => setSelectedOpportunity(opp)}
            />
          ))}
        </div>

        <BottomNav active="explore" onExplore={goToExplore} onPortfolio={goToPortfolio} />
      </div>
    </div>
  )
}
