import { useState } from 'react'
import { MincaLogo, ProfileAvatar } from '../AppChrome'
import DesktopNotificationsMenu from './DesktopNotificationsMenu'
import DesktopProfileMenu from './DesktopProfileMenu'

const NAV_LINKS = [
  { id: 'explore', label: 'Explorar' },
  { id: 'investments', label: 'Mis inversiones' },
]

export default function DesktopHeader({
  activeNav,
  onNavChange,
  onOpenSettings,
  onLogout,
  hasNotification,
  notifications = [],
  onViewAllNotifications,
  showBack,
  onBack,
}) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#EFEFEF]">
      <div className="max-w-[1440px] mx-auto px-8 h-[72px] flex items-center gap-8">
        <div className="flex items-center gap-4 shrink-0">
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] -ml-2"
              aria-label="Volver"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <MincaLogo />
        </div>

        <div className="flex-1 max-w-md hidden lg:block">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AAA]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <input
              type="search"
              placeholder="Buscar oportunidades..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F5F5F5] border border-transparent text-[14px] text-[#1A1A1A] placeholder:text-[#AAA] focus:outline-none focus:border-[#E0E0E0] focus:bg-white"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => onNavChange(link.id)}
              className={`px-4 py-2 rounded-full text-[14px] font-medium transition-colors ${
                activeNav === link.id
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#666] hover:text-[#1A1A1A] hover:bg-[#F5F5F5]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen((v) => !v)
                setProfileOpen(false)
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] text-[#666] relative"
              aria-label="Notificaciones"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {hasNotification && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F97316] ring-2 ring-white" />
              )}
            </button>
            <DesktopNotificationsMenu
              open={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
              notifications={notifications}
              onViewAll={onViewAllNotifications}
              onOpenAccount={() => onOpenSettings('profile')}
            />
          </div>
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] text-[#666]"
            aria-label="Mensajes"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <div className="relative">
            <ProfileAvatar
              onClick={() => {
                setProfileOpen((v) => !v)
                setNotificationsOpen(false)
              }}
              hasNotification={hasNotification}
            />
            <DesktopProfileMenu
              open={profileOpen}
              onClose={() => setProfileOpen(false)}
              onOpenProfile={() => onOpenSettings('profile')}
              onOpenPayments={() => onOpenSettings('payments')}
              onOpenSecurity={() => onOpenSettings('security')}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
