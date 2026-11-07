import { useEffect, useState } from 'react'
import { addPaymentMethod, deletePaymentMethod, getPaymentMethods, updateUser } from '../../api/index.js'
import { useAppData } from '../../context/AppDataContext'
import DesktopModal from './DesktopModal'

const SETTINGS_NAV = [
  { id: 'profile', label: 'Datos personales' },
  { id: 'payments', label: 'Métodos de pago' },
  { id: 'security', label: 'Privacidad y seguridad' },
]

const CRYPTO_ASSETS = [
  { id: 'usdt', label: 'USDT (Tether)' },
  { id: 'usdc', label: 'USDC (USD Coin)' },
]

const CRYPTO_NETWORKS = [
  { id: 'polygon', label: 'Polygon' },
  { id: 'ethereum', label: 'Ethereum' },
  { id: 'tron', label: 'Tron' },
]

const DEMO_METHODS = [
  { id: 'visa', type: 'card', label: 'Tarjeta Visa', detail: '**** 4832', default: true },
  { id: 'usdt', type: 'crypto', label: 'Billetera USDT', detail: 'Polygon · 0x782c…7B3a' },
]

function PaymentMethodIcon({ type, label }) {
  if (type === 'card') {
    return (
      <div className="w-11 h-11 rounded-xl bg-[#1A1A1A] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
        VISA
      </div>
    )
  }
  if (type === 'crypto') {
    return (
      <div className="w-11 h-11 rounded-xl bg-[#26A17B] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
        {label?.includes('USDC') ? 'USDC' : 'USDT'}
      </div>
    )
  }
  return (
    <div className="w-11 h-11 rounded-xl bg-[#F5F5F5] flex items-center justify-center shrink-0 text-[#666]">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    </div>
  )
}

function DesktopPersonalDataPanel() {
  const { user, setUser } = useAppData()
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [dni, setDni] = useState(user?.dni || '')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    setFirstName(user.firstName)
    setLastName(user.lastName)
    setEmail(user.email)
    setPhone(user.phone)
    setDni(user.dni)
  }, [user])

  const isDirty =
    firstName !== user?.firstName ||
    lastName !== user?.lastName ||
    email !== user?.email ||
    phone !== user?.phone ||
    dni !== user?.dni

  return (
    <div className="max-w-xl">
      <h1 className="text-[28px] font-bold text-[#1A1A1A] mb-2">Datos personales</h1>
      <p className="text-[15px] text-[#888] mb-8">Actualizá tu información de contacto y perfil.</p>

      <div className="flex items-center gap-5 mb-8">
        <div className="relative">
          <img src={user?.avatar} alt="" className="w-20 h-20 rounded-full object-cover" />
          <button
            type="button"
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center border-2 border-white"
            aria-label="Editar foto"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </button>
        </div>
        {user?.verified && (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full bg-[#E6F7ED] text-[#16A34A]">
            Cuenta verificada
          </span>
        )}
      </div>

      <div className="space-y-5">
        {[
          { label: 'Nombre', value: firstName, onChange: setFirstName },
          { label: 'Apellido', value: lastName, onChange: setLastName },
          { label: 'Email', value: email, onChange: setEmail, type: 'email' },
          { label: 'Teléfono', value: phone, onChange: setPhone, type: 'tel' },
          { label: 'DNI / CUIL', value: dni, onChange: setDni },
        ].map((field) => (
          <div key={field.label}>
            <label className="text-[13px] font-medium text-[#888] mb-1.5 block">{field.label}</label>
            <input
              type={field.type || 'text'}
              value={field.value}
              onChange={(e) => {
                field.onChange(e.target.value)
                setSaved(false)
              }}
              className="w-full px-4 py-3 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          type="button"
          disabled={!isDirty}
          onClick={async () => {
            const res = await updateUser({ firstName, lastName, phone, dni, avatar: user?.avatar })
            setUser(res.data)
            setSaved(true)
          }}
          className={`px-8 py-3 rounded-full text-[15px] font-semibold transition-colors ${
            isDirty ? 'bg-[#1A1A1A] text-white hover:bg-[#333]' : 'bg-[#E5E5E5] text-[#AAA] cursor-not-allowed'
          }`}
        >
          Guardar cambios
        </button>
        {saved && !isDirty && (
          <span className="text-[14px] text-[#16A34A] font-medium">Cambios guardados</span>
        )}
      </div>
    </div>
  )
}

function DesktopPaymentMethodsPanel() {
  const [methods, setMethods] = useState([])
  const [loadingMethods, setLoadingMethods] = useState(true)
  const [showDemo, setShowDemo] = useState(false)
  const [modal, setModal] = useState(null)
  const [cryptoAsset, setCryptoAsset] = useState(null)
  const [cryptoNetwork, setCryptoNetwork] = useState(null)
  const [walletAddress, setWalletAddress] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [cardForm, setCardForm] = useState({ number: '', holder: '', expiry: '', cvv: '' })

  useEffect(() => {
    getPaymentMethods()
      .then((res) => setMethods(res.data))
      .catch(console.error)
      .finally(() => setLoadingMethods(false))
  }, [])

  const displayMethods = showDemo ? DEMO_METHODS : methods
  const isEmpty = !loadingMethods && displayMethods.length === 0

  const closeModal = () => {
    setModal(null)
    setCryptoAsset(null)
    setCryptoNetwork(null)
    setWalletAddress('')
    setCardForm({ number: '', holder: '', expiry: '', cvv: '' })
  }

  const formatCard = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 16)
    return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }

  const saveCard = async () => {
    const last4 = cardForm.number.replace(/\s/g, '').slice(-4) || '4832'
    const res = await addPaymentMethod({
      type: 'card',
      label: 'Tarjeta Visa',
      detail: `**** ${last4}`,
      cardLast4: last4,
    })
    setMethods((prev) => [...prev, res.data])
    setShowDemo(false)
    closeModal()
  }

  const saveCrypto = async () => {
    const asset = CRYPTO_ASSETS.find((a) => a.id === cryptoAsset)
    const network = CRYPTO_NETWORKS.find((n) => n.id === cryptoNetwork)
    const short = walletAddress.length > 10
      ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
      : walletAddress
    const res = await addPaymentMethod({
      type: 'crypto',
      label: `Billetera ${asset?.id.toUpperCase()}`,
      detail: `${network?.label} · ${short}`,
      cryptoAsset,
      cryptoNetwork: network?.label,
      walletAddress,
    })
    setMethods((prev) => [...prev, res.data])
    setShowDemo(false)
    closeModal()
  }

  const confirmDelete = async () => {
    if (deleteTarget) {
      await deletePaymentMethod(deleteTarget.id)
      setMethods((prev) => prev.filter((m) => m.id !== deleteTarget.id))
      setShowDemo(false)
    }
    setDeleteTarget(null)
  }

  const canSaveCard =
    cardForm.number.replace(/\s/g, '').length >= 15 &&
    cardForm.holder.trim().length >= 3 &&
    cardForm.expiry.length >= 4 &&
    cardForm.cvv.length >= 3

  const canSaveCrypto = cryptoAsset && cryptoNetwork && walletAddress.trim().length >= 10

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#1A1A1A] mb-2">Métodos de pago</h1>
          <p className="text-[15px] text-[#888]">Gestioná tarjetas y billeteras para invertir más rápido.</p>
        </div>
        {!isEmpty && (
          <button
            type="button"
            onClick={() => setModal('type')}
            className="px-5 py-2.5 rounded-full bg-[#1A1A1A] text-white text-[14px] font-semibold hover:bg-[#333] transition-colors shrink-0"
          >
            Vincular nuevo método
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="rounded-2xl border border-[#EFEFEF] bg-white py-16 px-8 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#F5F5F5] flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#CCC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </div>
          <p className="text-[16px] font-medium text-[#1A1A1A] mb-2">
            Aún no tenés métodos de pago vinculados
          </p>
          <p className="text-[14px] text-[#888] mb-8 max-w-sm mx-auto">
            Agregá una tarjeta o billetera cripto para agilizar tus próximas inversiones.
          </p>
          <button
            type="button"
            onClick={() => setModal('type')}
            className="px-8 py-3.5 rounded-full bg-[#1A1A1A] text-white text-[15px] font-semibold hover:bg-[#333]"
          >
            Vincular nuevo método
          </button>
          <button
            type="button"
            onClick={() => setShowDemo(true)}
            className="block mx-auto mt-4 text-[13px] text-[#AAA] underline"
          >
            Ver lista de ejemplo (ensayo)
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#EFEFEF] bg-white overflow-hidden divide-y divide-[#F0F0F0]">
          {displayMethods.map((method) => (
            <div key={method.id} className="flex items-center gap-4 px-5 py-4">
              <PaymentMethodIcon type={method.type} label={method.label} />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1A1A1A]">{method.label}</p>
                <p className="text-[13px] text-[#888] truncate">{method.detail}</p>
              </div>
              {method.default && (
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-[#F5F5F5] text-[#888]">
                  Predeterminada
                </span>
              )}
              <button
                type="button"
                onClick={() => setDeleteTarget(method)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#FEF2F2] text-[#AAA] hover:text-[#DC2626] transition-colors"
                aria-label="Eliminar"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <DesktopModal open={modal === 'type'} onClose={closeModal} maxWidth="max-w-md">
        <div className="px-8 pt-8 pb-6">
          <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-2 pr-8">
            ¿Qué tipo de método querés agregar?
          </h2>
          <p className="text-[14px] text-[#888] mb-6">Elegí cómo querés pagar tus inversiones.</p>
          <div className="space-y-3">
            {[
              { id: 'card', label: 'Tarjeta de crédito o débito', subtitle: 'VISA, Mastercard y más', icon: '💳' },
              { id: 'crypto', label: 'Criptomoneda', subtitle: 'USDT, USDC y más redes', icon: '₿' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setModal(opt.id === 'card' ? 'card' : 'crypto-asset')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[#E8E8E8] text-left hover:border-[#CCC] hover:bg-[#FAFAFA] transition-colors"
              >
                <span className="text-2xl">{opt.icon}</span>
                <div>
                  <p className="text-[15px] font-semibold text-[#1A1A1A]">{opt.label}</p>
                  <p className="text-[13px] text-[#888]">{opt.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </DesktopModal>

      <DesktopModal open={modal === 'crypto-asset'} onClose={closeModal} maxWidth="max-w-md">
        <div className="px-8 pt-8 pb-6">
          <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-2 pr-8">
            ¿Qué criptomoneda querés agregar?
          </h2>
          <div className="space-y-2 mb-6">
            {CRYPTO_ASSETS.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => {
                  setCryptoAsset(asset.id)
                  setModal('crypto-network')
                }}
                className={`w-full p-4 rounded-xl border text-left transition-colors ${
                  cryptoAsset === asset.id
                    ? 'border-[#1A1A1A] bg-[#FAFAFA]'
                    : 'border-[#E8E8E8] hover:border-[#CCC]'
                }`}
              >
                <p className="text-[15px] font-semibold text-[#1A1A1A]">{asset.label}</p>
              </button>
            ))}
          </div>
        </div>
      </DesktopModal>

      <DesktopModal open={modal === 'crypto-network'} onClose={closeModal} maxWidth="max-w-md">
        <div className="px-8 pt-8 pb-6">
          <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-6 pr-8">
            Completá los datos de tu billetera
          </h2>
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-[13px] font-medium text-[#888] mb-1.5 block">Red</label>
              <select
                value={cryptoNetwork || ''}
                onChange={(e) => setCryptoNetwork(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A] bg-white"
              >
                <option value="">Seleccionar red</option>
                {CRYPTO_NETWORKS.map((n) => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[13px] font-medium text-[#888] mb-1.5 block">Dirección de billetera</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x…"
                className="w-full px-4 py-3 rounded-xl border border-[#E8E8E8] text-[15px] font-mono focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>
          <button
            type="button"
            disabled={!canSaveCrypto}
            onClick={saveCrypto}
            className={`w-full py-3.5 rounded-full text-[15px] font-semibold ${
              canSaveCrypto ? 'bg-[#1A1A1A] text-white' : 'bg-[#E5E5E5] text-[#AAA] cursor-not-allowed'
            }`}
          >
            Vincular
          </button>
        </div>
      </DesktopModal>

      <DesktopModal open={modal === 'card'} onClose={closeModal} maxWidth="max-w-md">
        <div className="px-8 pt-8 pb-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-6 pr-8">Agregar tarjeta</h2>
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-[13px] font-medium text-[#888] mb-1.5 block">Número de tarjeta</label>
              <input
                type="text"
                value={cardForm.number}
                onChange={(e) => setCardForm((f) => ({ ...f, number: formatCard(e.target.value) }))}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="text-[13px] font-medium text-[#888] mb-1.5 block">Titular</label>
              <input
                type="text"
                value={cardForm.holder}
                onChange={(e) => setCardForm((f) => ({ ...f, holder: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[13px] font-medium text-[#888] mb-1.5 block">Vence</label>
                <input
                  type="text"
                  value={cardForm.expiry}
                  onChange={(e) => setCardForm((f) => ({ ...f, expiry: e.target.value }))}
                  placeholder="MM/AA"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
              <div>
                <label className="text-[13px] font-medium text-[#888] mb-1.5 block">CVV</label>
                <input
                  type="text"
                  value={cardForm.cvv}
                  onChange={(e) => setCardForm((f) => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  placeholder="123"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            disabled={!canSaveCard}
            onClick={saveCard}
            className={`w-full py-3.5 rounded-full text-[15px] font-semibold ${
              canSaveCard ? 'bg-[#1A1A1A] text-white' : 'bg-[#E5E5E5] text-[#AAA] cursor-not-allowed'
            }`}
          >
            Vincular tarjeta
          </button>
        </div>
      </DesktopModal>

      <DesktopModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="max-w-sm">
        <div className="px-8 pt-8 pb-6 text-center">
          <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-2">¿Estás seguro?</h2>
          <p className="text-[14px] text-[#666] mb-8 leading-relaxed">
            Vas a eliminar <strong>{deleteTarget?.label}</strong>. Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="flex-1 py-3 rounded-full border-2 border-[#E5E5E5] text-[15px] font-semibold text-[#1A1A1A]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="flex-1 py-3 rounded-full bg-[#DC2626] text-white text-[15px] font-semibold"
            >
              Eliminar
            </button>
          </div>
        </div>
      </DesktopModal>
    </div>
  )
}

function DesktopSecurityPanel() {
  return (
    <div className="max-w-xl">
      <h1 className="text-[28px] font-bold text-[#1A1A1A] mb-2">Privacidad y seguridad</h1>
      <p className="text-[15px] text-[#888] mb-8">Configurá cómo protegemos tu cuenta.</p>
      <div className="space-y-3">
        {[
          'Autenticación en dos pasos',
          'Sesiones activas',
          'Historial de accesos',
          'Descargar mis datos',
        ].map((item) => (
          <button
            key={item}
            type="button"
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#EFEFEF] bg-white text-left hover:border-[#CCC] transition-colors"
          >
            <span className="text-[15px] text-[#1A1A1A]">{item}</span>
            <svg className="w-5 h-5 text-[#CCC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function DesktopAccountPage({ initialSection = 'profile', onClose, onLogout }) {
  const [section, setSection] = useState(initialSection)

  const panels = {
    profile: <DesktopPersonalDataPanel />,
    payments: <DesktopPaymentMethodsPanel />,
    security: <DesktopSecurityPanel />,
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#FAFAFA]">
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        <div className="flex gap-12">
          <aside className="w-56 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 text-[14px] text-[#888] hover:text-[#1A1A1A] mb-6"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Volver
            </button>
            <p className="text-[11px] font-semibold tracking-[0.08em] text-[#999] uppercase mb-3">
              Configuración
            </p>
            <nav className="space-y-1">
              {SETTINGS_NAV.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
                    section === item.id
                      ? 'bg-[#1A1A1A] text-white'
                      : 'text-[#666] hover:bg-white hover:text-[#1A1A1A]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <button
              type="button"
              onClick={onLogout}
              className="mt-8 text-[14px] font-medium text-[#DC2626] hover:underline"
            >
              Cerrar sesión
            </button>
          </aside>

          <div className="flex-1 min-w-0">{panels[section]}</div>
        </div>
      </div>
    </div>
  )
}
