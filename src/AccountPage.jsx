import { useEffect, useMemo, useState } from 'react'
import { getPaymentMethods } from './api/index.js'
import BottomSheet from './components/BottomSheet'
import { useAppData } from './context/AppDataContext'
import { useAuth } from './context/AuthContext'

const ACCOUNT_MENU = [
  {
    title: 'Cuenta',
    items: [
      { id: 'personal', label: 'Datos personales', icon: 'user' },
      { id: 'identity', label: 'Verificación de identidad', icon: 'shield', badge: 'Verificada', badgeStyle: 'green' },
      { id: 'payments', label: 'Métodos de pago', icon: 'card' },
      { id: 'withdraw', label: 'Cuentas para retiro', icon: 'bank' },
    ],
  },
  {
    title: 'Preferencias',
    items: [
      { id: 'notifications', label: 'Notificaciones', icon: 'bell' },
      { id: 'privacy', label: 'Privacidad y seguridad', icon: 'lock' },
    ],
  },
  {
    title: 'Soporte',
    items: [
      { id: 'help', label: 'Centro de ayuda', icon: 'help' },
      { id: 'support', label: 'Contactar soporte', icon: 'chat' },
      { id: 'terms', label: 'Términos y condiciones', icon: 'doc' },
    ],
  },
]

const PAYMENT_TYPE_OPTIONS = [
  { id: 'card', label: 'Tarjeta de crédito o débito', subtitle: 'VISA, Mastercard y más' },
  { id: 'wallet', label: 'Billetera virtual', subtitle: 'Mercado Pago, Lemon y más' },
  { id: 'bank', label: 'Cuenta bancaria', subtitle: 'CBU / CVU en pesos o dólares' },
]

const DEMO_METHODS = [
  { id: 'visa', type: 'card', label: 'VISA', detail: '**** 4832', default: true },
  { id: 'mp', type: 'wallet', label: 'Mercado Pago', detail: 'juan.martin@gmail.com' },
  { id: 'bank', type: 'bank', label: 'Cuenta bancaria USD', detail: 'Galicia · **** 9012' },
]

function MenuIcon({ type }) {
  const cls = 'w-5 h-5 text-[#666]'
  const icons = {
    user: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    card: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>,
    bank: <><path d="M3 21h18M4 10h16M6 6l6-3 6 3M6 10v8M10 10v8M14 10v8M18 10v8" /></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" /></>,
    chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
    doc: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></>,
  }
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {icons[type]}
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg className="w-5 h-5 text-[#CCC] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

function ScreenHeader({ title, onBack }) {
  return (
    <header className="flex items-center gap-3 px-5 pt-12 pb-4 border-b border-[#F0F0F0]">
      <button type="button" onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2" aria-label="Volver">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <h1 className="text-[18px] font-bold text-[#1A1A1A]">{title}</h1>
    </header>
  )
}

function MenuRow({ item, onClick, unreadCount = 0 }) {
  const showUnreadCount = item.id === 'notifications' && unreadCount > 0

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 border-b border-[#F5F5F5] last:border-0 text-left hover:bg-[#FAFAFA]"
    >
      <MenuIcon type={item.icon} />
      <span className="flex-1 text-[15px] text-[#1A1A1A]">{item.label}</span>
      {item.badge ? (
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#E6F7ED] text-[#16A34A]">
          {item.badge}
        </span>
      ) : showUnreadCount ? (
        <span className="w-5 h-5 rounded-full bg-[#1A1A1A] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
          {unreadCount}
        </span>
      ) : (
        <ChevronRight />
      )}
    </button>
  )
}

function AccountMainScreen({ onNavigate, onLogout, unreadCount }) {
  const { user } = useAppData()

  return (
    <>
      <header className="relative flex items-center justify-center px-5 pt-12 pb-5">
        <button
          type="button"
          onClick={onNavigate.close}
          className="absolute left-5 w-10 h-10 rounded-full border border-[#E5E5E5] flex items-center justify-center bg-white"
          aria-label="Volver"
        >
          <svg className="w-5 h-5 text-[#1A1A1A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-[11px] font-semibold tracking-[0.12em] text-[#999] uppercase">
          Mi cuenta
        </h1>
      </header>

      <div className="px-5 pb-6">
        <div className="flex items-center gap-4 mb-3">
          <img src={user?.avatar} alt="" className="w-16 h-16 rounded-full object-cover shrink-0" />
          <div className="min-w-0">
            <p className="text-[20px] font-bold text-[#1A1A1A] leading-tight">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[14px] text-[#888] mt-0.5 truncate">{user?.email}</p>
          </div>
        </div>
        {user?.verified && (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full bg-[#E6F7ED] text-[#16A34A]">
            <span className="text-[10px] leading-none">•</span>
            Cuenta verificada
          </span>
        )}
      </div>

      <div className="pb-8">
        {ACCOUNT_MENU.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="px-5 text-[11px] font-semibold tracking-[0.08em] text-[#999] uppercase mb-2">
              {section.title}
            </p>
            <div className="bg-white border-y border-[#F0F0F0]">
              {section.items.map((item) => (
                <MenuRow
                  key={item.id}
                  item={item}
                  unreadCount={unreadCount}
                  onClick={() => {
                    if (item.id === 'personal') onNavigate.personal()
                    else if (item.id === 'payments') onNavigate.payments()
                    else if (item.id === 'notifications') onNavigate.notifications()
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pb-10 text-center">
        <button type="button" onClick={onLogout} className="text-[15px] font-semibold text-[#DC2626]">
          Cerrar sesión
        </button>
      </div>
    </>
  )
}

function PersonalDataScreen({ onBack }) {
  const { user } = useAppData()
  const [tab, setTab] = useState('account')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [phone, setPhone] = useState(user?.phone || '')

  const accountDirty = email !== user?.email || password !== 'password123'
  const personalDirty =
    firstName !== user?.firstName || lastName !== user?.lastName || phone !== user?.phone

  const canSave = tab === 'account' ? accountDirty : personalDirty

  return (
    <div className="min-h-screen flex flex-col">
      <ScreenHeader title="Datos personales" onBack={onBack} />

      <div className="px-5 flex gap-2 py-4 border-b border-[#F0F0F0]">
        {[
          { id: 'account', label: 'Datos de la cuenta' },
          { id: 'personal', label: 'Información personal' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-full text-[12px] font-semibold transition-colors ${
              tab === t.id ? 'bg-[#1A1A1A] text-white' : 'bg-[#F5F5F5] text-[#666]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 px-5 pt-6 pb-32">
        {tab === 'account' ? (
          <>
            <div className="mb-5">
              <label className="text-[12px] font-medium text-[#888] mb-1.5 block">Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div className="mb-8">
              <label className="text-[12px] font-medium text-[#888] mb-1.5 block">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#E8E8E8] text-[15px] pr-12 focus:outline-none focus:border-[#1A1A1A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="pt-6 border-t border-[#F0F0F0]">
              <p className="text-[15px] font-semibold text-[#1A1A1A] mb-2">Eliminar cuenta</p>
              <p className="text-[13px] text-[#888] mb-3 leading-relaxed">
                Si eliminás tu cuenta, perderás el acceso a tus inversiones y documentación.
              </p>
              <button type="button" className="text-[14px] font-semibold text-[#DC2626]">
                Eliminar cuenta
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-5">
              <label className="text-[12px] font-medium text-[#888] mb-1.5 block">Nombre</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div className="mb-5">
              <label className="text-[12px] font-medium text-[#888] mb-1.5 block">Apellido</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div className="mb-5">
              <label className="text-[12px] font-medium text-[#888] mb-1.5 block">Teléfono</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-8 pt-4 bg-white border-t border-[#F0F0F0]">
        <button
          type="button"
          disabled={!canSave}
          className={`w-full py-3.5 rounded-full text-[15px] font-semibold ${
            canSave ? 'bg-[#1A1A1A] text-white' : 'bg-[#E5E5E5] text-[#AAA] cursor-not-allowed'
          }`}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  )
}

function PaymentMethodIcon({ type }) {
  if (type === 'card') {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
        VISA
      </div>
    )
  }
  if (type === 'wallet') {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#00BCFF] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
        MP
      </div>
    )
  }
  return (
    <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] flex items-center justify-center shrink-0">
      <MenuIcon type="bank" />
    </div>
  )
}

function PaymentMethodsScreen({ methods, onBack, onAdd, onShowDemo, showDemo }) {
  const isEmpty = methods.length === 0 && !showDemo
  const displayMethods = showDemo ? DEMO_METHODS : methods

  return (
    <div className="min-h-screen flex flex-col">
      <ScreenHeader title="Métodos de pago" onBack={onBack} />

      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 pb-32 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#F5F5F5] flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-[#CCC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </div>
          <p className="text-[16px] font-medium text-[#1A1A1A] mb-8">
            Todavía no agregaste ningún método
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="w-full max-w-[320px] py-3.5 rounded-full bg-[#1A1A1A] text-white text-[15px] font-semibold"
          >
            Agregar método de pago
          </button>
          <button
            type="button"
            onClick={onShowDemo}
            className="mt-4 text-[13px] text-[#AAA] underline"
          >
            Ver lista de ejemplo (ensayo)
          </button>
        </div>
      ) : (
        <div className="flex-1 px-5 pt-6 pb-32">
          <div className="rounded-2xl border border-[#EFEFEF] overflow-hidden mb-4">
            {displayMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center gap-3 px-4 py-4 border-b border-[#F0F0F0] last:border-0"
              >
                <PaymentMethodIcon type={method.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-[#1A1A1A]">{method.label}</p>
                  <p className="text-[13px] text-[#888] truncate">{method.detail}</p>
                </div>
                {method.default && (
                  <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-[#F5F5F5] text-[#888]">
                    Predeterminada
                  </span>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="w-full py-3.5 rounded-full border-2 border-[#E5E5E5] text-[15px] font-semibold text-[#1A1A1A]"
          >
            + Agregar método de pago
          </button>
        </div>
      )}
    </div>
  )
}

function AddCardScreen({ onBack, onSave }) {
  const [cardNumber, setCardNumber] = useState('')
  const [holder, setHolder] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [document, setDocument] = useState('')
  const [isDefault, setIsDefault] = useState(true)

  const canSave =
    cardNumber.replace(/\s/g, '').length >= 15 &&
    holder.trim().length >= 3 &&
    expiry.length >= 4 &&
    cvv.length >= 3 &&
    document.length >= 6

  const formatCard = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 16)
    return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }

  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length <= 2 ? d : `${d.slice(0, 2)}/${d.slice(2)}`
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ScreenHeader title="Agregar tarjeta" onBack={onBack} />

      <div className="flex-1 px-5 pt-6 pb-32 space-y-4">
        {[
          { label: 'Número de tarjeta', value: cardNumber, onChange: (e) => setCardNumber(formatCard(e.target.value)), placeholder: '1234 5678 9012 3456' },
          { label: 'Titular', value: holder, onChange: (e) => setHolder(e.target.value), placeholder: 'Como figura en la tarjeta' },
          { label: 'Documento del titular', value: document, onChange: (e) => setDocument(e.target.value.replace(/\D/g, '').slice(0, 8)), placeholder: 'DNI' },
        ].map((field) => (
          <div key={field.label}>
            <label className="text-[12px] font-medium text-[#888] mb-1.5 block">{field.label}</label>
            <input
              type="text"
              value={field.value}
              onChange={field.onChange}
              placeholder={field.placeholder}
              className="w-full px-4 py-3.5 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[12px] font-medium text-[#888] mb-1.5 block">Vence</label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/AA"
              className="w-full px-4 py-3.5 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#888] mb-1.5 block">CVV</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="123"
              className="w-full px-4 py-3.5 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>
        </div>
        <label className="flex items-center justify-between py-2 cursor-pointer">
          <span className="text-[14px] text-[#1A1A1A]">Establecer como predeterminada</span>
          <button
            type="button"
            role="switch"
            aria-checked={isDefault}
            onClick={() => setIsDefault(!isDefault)}
            className={`w-11 h-6 rounded-full transition-colors relative ${isDefault ? 'bg-[#1A1A1A]' : 'bg-[#E5E5E5]'}`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isDefault ? 'left-[22px]' : 'left-0.5'}`}
            />
          </button>
        </label>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-8 pt-4 bg-white border-t border-[#F0F0F0]">
        <button
          type="button"
          disabled={!canSave}
          onClick={() => onSave({ label: 'VISA', detail: `**** ${cardNumber.slice(-4) || '4832'}`, type: 'card' })}
          className={`w-full py-3.5 rounded-full text-[15px] font-semibold ${
            canSave ? 'bg-[#1A1A1A] text-white' : 'bg-[#E5E5E5] text-[#AAA] cursor-not-allowed'
          }`}
        >
          Guardar tarjeta
        </button>
      </div>
    </div>
  )
}

export default function AccountPage({ onClose, onOpenNotifications, unreadCount = 0 }) {
  const { logout } = useAuth()
  const { user } = useAppData()
  const [screen, setScreen] = useState('main')
  const [showLogout, setShowLogout] = useState(false)
  const [showPaymentTypeSheet, setShowPaymentTypeSheet] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [showDemoMethods, setShowDemoMethods] = useState(false)

  useEffect(() => {
    getPaymentMethods()
      .then((res) => setPaymentMethods(res.data))
      .catch(console.error)
  }, [])

  const navigate = useMemo(
    () => ({
      close: onClose,
      personal: () => setScreen('personal'),
      payments: () => setScreen('payments'),
      notifications: () => {
        if (onOpenNotifications) onOpenNotifications()
      },
    }),
    [onClose, onOpenNotifications],
  )

  const handleAddPaymentType = (typeId) => {
    setShowPaymentTypeSheet(false)
    if (typeId === 'card') setScreen('add-card')
    else {
      setPaymentMethods((prev) => [
        ...prev,
        {
          id: `method-${Date.now()}`,
          type: typeId,
          label: typeId === 'wallet' ? 'Mercado Pago' : 'Cuenta bancaria USD',
          detail: typeId === 'wallet' ? user?.email : 'Galicia · **** 9012',
        },
      ])
      setShowDemoMethods(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-white relative">
        {screen === 'main' && (
          <AccountMainScreen
            onNavigate={navigate}
            onLogout={() => setShowLogout(true)}
            unreadCount={unreadCount}
          />
        )}
        {screen === 'personal' && (
          <PersonalDataScreen onBack={() => setScreen('main')} />
        )}
        {screen === 'payments' && (
          <PaymentMethodsScreen
            methods={paymentMethods}
            showDemo={showDemoMethods}
            onBack={() => {
              setShowDemoMethods(false)
              setScreen('main')
            }}
            onAdd={() => setShowPaymentTypeSheet(true)}
            onShowDemo={() => setShowDemoMethods(true)}
          />
        )}
        {screen === 'add-card' && (
          <AddCardScreen
            onBack={() => setScreen('payments')}
            onSave={(method) => {
              setPaymentMethods((prev) => [
                ...prev,
                { id: `method-${Date.now()}`, ...method, default: true },
              ])
              setShowDemoMethods(false)
              setScreen('payments')
            }}
          />
        )}

        <BottomSheet open={showPaymentTypeSheet} onClose={() => setShowPaymentTypeSheet(false)}>
          <h2 className="text-[18px] font-bold text-[#1A1A1A] mb-2">
            ¿Qué tipo de método querés agregar?
          </h2>
          <p className="text-[14px] text-[#888] mb-5">Elegí cómo querés pagar tus inversiones.</p>
          <div className="space-y-2 mb-2">
            {PAYMENT_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleAddPaymentType(opt.id)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[#E8E8E8] text-left hover:bg-[#FAFAFA]"
              >
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-[#1A1A1A]">{opt.label}</p>
                  <p className="text-[13px] text-[#888]">{opt.subtitle}</p>
                </div>
                <ChevronRight />
              </button>
            ))}
          </div>
        </BottomSheet>

        <BottomSheet open={showLogout} onClose={() => setShowLogout(false)}>
          <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-2 text-center">¿Cerrar sesión?</h2>
          <p className="text-[14px] text-[#666] text-center mb-6 leading-relaxed">
            Para volver a entrar, tendrás que ingresar tu correo y contraseña.
          </p>
          <button
            type="button"
            onClick={() => {
              setShowLogout(false)
              onClose()
              logout()
            }}
            className="w-full py-3.5 rounded-full bg-[#DC2626] text-white text-[15px] font-semibold mb-3"
          >
            Sí, cerrar sesión
          </button>
          <button
            type="button"
            onClick={() => setShowLogout(false)}
            className="w-full py-3 text-[15px] font-medium text-[#666]"
          >
            Cancelar
          </button>
        </BottomSheet>
      </div>
    </div>
  )
}
