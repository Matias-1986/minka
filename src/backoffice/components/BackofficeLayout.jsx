import { can } from '../permissions.js'
import { useAuth } from '../context/AuthContext.jsx'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', permission: 'dashboard:read' },
  { id: 'opportunities', label: 'Oportunidades', permission: 'opportunities:read' },
  { id: 'investors', label: 'Inversores', permission: 'investors:read' },
  { id: 'investments', label: 'Inversiones', permission: 'investments:read' },
  { id: 'managers', label: 'Gestores', permission: 'managers:read' },
  { id: 'masters', label: 'Tablas maestras', permission: 'masters:read' },
  { id: 'users', label: 'Equipo backoffice', permission: 'users:read' },
]

function roleLabel(roles = []) {
  if (roles.includes('admin')) return 'Administrador'
  if (roles.includes('viewer')) return 'Viewer (solo lectura)'
  return roles.join(', ')
}

export default function BackofficeLayout({ page, onNavigate, children }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex">
      <aside className="w-64 bg-[#111827] text-white flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-white/10">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-white/50 uppercase">
            MINKA
          </p>
          <p className="text-[18px] font-bold mt-1">Backoffice</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.filter((item) => can(user, item.permission)).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                page === item.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-[13px] font-medium truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-[11px] text-white/50 truncate">{user?.email}</p>
          <p className="text-[11px] text-[#60A5FA] mt-1">{roleLabel(user?.roles)}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-3 text-[13px] text-white/60 hover:text-white"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="bg-white border-b border-[#E5E7EB] px-8 py-5">
          <h1 className="text-[22px] font-bold text-[#111827] capitalize">
            {NAV.find((n) => n.id === page)?.label || page}
          </h1>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
