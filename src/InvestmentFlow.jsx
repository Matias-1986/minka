import { useCallback, useMemo, useState } from 'react'
import { confirmPayment, createInvestment, createPayment } from './api/index.js'
import {
  FlowContainer,
  FlowContent,
  FlowLayoutProvider,
  FlowStickyFooter,
  useFlowLayout,
} from './context/FlowLayoutContext'
import {
  BuildingAnimationStep,
  ConfirmationDetailStep,
  getFirstReturnDate,
  PaymentErrorStep,
  SuccessSplashStep,
  WaitingPaymentStep,
} from './InvestmentFinale'

const CRYPTO_WALLET_ADDRESS = '0x782c820C80D352125a3b664B8e5f4a2C9d1E7B3a'
const CRYPTO_SPREAD = 1.00111

const CRYPTO_ASSETS = [
  { id: 'usdt', label: 'USDT', name: 'Tether', balance: 1188, color: '#26A17B' },
  { id: 'usdc', label: 'USDC', name: 'USD Coin', balance: 1188, color: '#2775CA' },
]

const CRYPTO_NETWORKS = [
  { id: 'ethereum', label: 'Ethereum', color: '#627EEA' },
  { id: 'polygon', label: 'Polygon', color: '#8247E5' },
  { id: 'tron', label: 'Tron', color: '#EF0027' },
]

const QUICK_AMOUNTS = [500, 1000, 10000]
const COMMISSION_RATE = 0.005
const ARS_RATE = 1500

const PAYMENT_METHODS = [
  { id: 'ars', label: 'Pesos', subtitle: 'con banco local', icon: 'ars' },
  { id: 'usd', label: 'Dólares', subtitle: 'con banco local', icon: 'usd' },
  {
    id: 'crypto',
    label: 'Cripto',
    subtitle: 'Pagar con billetera',
    icon: 'crypto',
    badge: 'com. baja',
    badgeColor: 'text-[#16A34A]',
    selectedHint: 'USDT, USDC',
  },
]

const ARS_PAY_OPTIONS = [
  { id: 'wallet', label: 'Billetera virtual', badge: 'Inmediato', badgeColor: 'text-[#16A34A]' },
  { id: 'transfer', label: 'Transferencia bancaria', badge: 'Hasta 24 hs', badgeColor: 'text-[#888]' },
]

const ARS_WALLETS = [
  { id: 'mercadopago', label: 'Mercado Pago' },
  { id: 'brubank', label: 'Brubank' },
  { id: 'uala', label: 'Ualá' },
]

const USD_WALLETS = [
  { id: 'lemon', label: 'Lemon Cash' },
  { id: 'buenbit', label: 'Buenbit' },
  { id: 'belo', label: 'Belo' },
]

const USD_PAY_OPTIONS = [
  { id: 'wallet', label: 'Billetera virtual', badge: 'Disponible', badgeColor: 'text-[#16A34A]' },
  { id: 'transfer', label: 'Transferencia USD', badge: 'Hasta 24 hs', badgeColor: 'text-[#888]' },
  {
    id: 'card',
    label: 'Tarjeta de crédito o débito',
    subtitle: 'VISA, Mastercard y más tarjetas internacionales',
    badge: 'Inmediato',
    badgeColor: 'text-[#16A34A]',
  },
]

const WALLET_BRANDING = {
  mercadopago: { bg: '#00BCFF', initials: 'MP', accent: '#3483FA' },
  brubank: { bg: '#6B4EFF', initials: 'BB', accent: '#6B4EFF' },
  uala: { bg: '#E8194A', initials: 'U', accent: '#E8194A' },
  lemon: { bg: '#BFFF00', initials: '🍋', accent: '#1A1A1A' },
  buenbit: { bg: '#1A1A1A', initials: 'BB', accent: '#1A1A1A' },
  belo: { bg: '#7C3AED', initials: 'B', accent: '#7C3AED' },
}

function formatUsd(value) {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: value % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  })
}

function formatArs(value) {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function parseMinAmount(minInvestment) {
  const digits = minInvestment.replace(/[^\d]/g, '')
  return Number(digits) || 10000
}

function getCryptoPayAmount(investAmount) {
  return investAmount * CRYPTO_SPREAD
}

function formatCryptoAmount(value) {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function useInvestmentTotals(amount) {
  return useMemo(() => {
    const numericAmount = parseFloat(amount.replace(',', '.')) || 0
    const commission = numericAmount * COMMISSION_RATE
    const totalUsd = numericAmount + commission
    const totalArs = totalUsd * ARS_RATE
    return { numericAmount, commission, totalUsd, totalArs }
  }, [amount])
}

function FlowHeader({ step, totalSteps, title, onBack, onClose }) {
  const { isDesktop } = useFlowLayout()

  return (
    <header
      className={`shrink-0 pb-4 border-b border-[#F0F0F0] ${isDesktop ? 'px-8 pt-6' : 'px-5 pt-12'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center -ml-2"
          aria-label="Volver"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="text-[13px] font-medium text-[#888]">Paso {step} de {totalSteps}</span>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center -mr-2"
          aria-label="Cerrar"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      {title && <h1 className="text-[22px] font-bold text-[#1A1A1A]">{title}</h1>}
    </header>
  )
}

function ProjectSummary({ opportunity }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F8F8] mb-6">
      <img
        src={opportunity.image}
        alt={opportunity.title}
        className="w-12 h-12 rounded-xl object-cover shrink-0"
      />
      <div>
        <p className="text-[15px] font-semibold text-[#1A1A1A]">{opportunity.title}</p>
        <p className="text-[13px] text-[#888]">
          {opportunity.tnaValue} · {opportunity.risk}
        </p>
      </div>
    </div>
  )
}

function InvestmentSummary({
  opportunity,
  investAmount,
  commission,
  payTotal,
  totalArs,
  currency = 'ars',
  payLabel = 'Vas a pagar',
}) {
  return (
    <div className="rounded-2xl bg-[#F8F8F8] px-4 py-4 space-y-2">
      <div className="flex justify-between text-[14px]">
        <span className="text-[#888]">Proyecto</span>
        <span className="font-medium text-[#1A1A1A] text-right">{opportunity.title}</span>
      </div>
      <div className="flex justify-between text-[14px]">
        <span className="text-[#888]">Monto a invertir</span>
        <span className="font-medium text-[#1A1A1A]">USD {formatUsd(investAmount)}</span>
      </div>
      {commission > 0 && (
        <div className="flex justify-between text-[14px]">
          <span className="text-[#888]">Costo de servicio</span>
          <span className="font-medium text-[#1A1A1A]">USD {formatUsd(commission)}</span>
        </div>
      )}
      <div className="flex justify-between text-[14px] pt-2 border-t border-[#E8E8E8]">
        <span className="font-medium text-[#1A1A1A]">{payLabel}</span>
        <span className="font-bold text-[#1A1A1A]">
          {currency === 'usd' ? `USD ${formatUsd(payTotal)}` : `ARS ${formatArs(totalArs)}`}
        </span>
      </div>
    </div>
  )
}

function WalletPicker({ wallets, wallet, setWallet, walletOpen, setWalletOpen, placeholder }) {
  return (
    <div className="relative mb-6">
      <button
        type="button"
        onClick={() => setWalletOpen(!walletOpen)}
        className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-[#E8E8E8] text-left"
      >
        <span className={`text-[15px] ${wallet ? 'text-[#1A1A1A] font-medium' : 'text-[#888]'}`}>
          {wallet ? wallets.find((w) => w.id === wallet)?.label : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-[#888] transition-transform ${walletOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {walletOpen && (
        <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-[#E8E8E8] rounded-2xl shadow-lg overflow-hidden">
          {wallets.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => {
                setWallet(w.id)
                setWalletOpen(false)
              }}
              className="w-full px-4 py-3.5 text-left text-[15px] text-[#1A1A1A] hover:bg-[#FAFAFA] border-b border-[#F0F0F0] last:border-0"
            >
              {w.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function FlowFooter({ onBack, onNext, nextDisabled, nextLabel = 'Siguiente' }) {
  return (
    <FlowStickyFooter>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3.5 rounded-full border-2 border-[#E5E5E5] text-[15px] font-semibold text-[#1A1A1A]"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className={`flex-1 py-3.5 rounded-full text-[15px] font-semibold transition-colors ${
            nextDisabled
              ? 'bg-[#E5E5E5] text-[#AAA] cursor-not-allowed'
              : 'bg-[#1A1A1A] text-white'
          }`}
        >
          {nextLabel}
        </button>
      </div>
    </FlowStickyFooter>
  )
}

function PaymentMethodIcon({ type }) {
  const cls = 'w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold'
  if (type === 'ars') {
    return (
      <div className={`${cls} bg-[#F0F0F0] text-[#1A1A1A]`}>$</div>
    )
  }
  if (type === 'usd') {
    return (
      <div className={`${cls} bg-[#F0F0F0] text-[#1A1A1A]`}>U$S</div>
    )
  }
  return (
    <div className={`${cls} bg-[#1A1A1A] text-white text-[10px]`}>₿</div>
  )
}

function PaymentMethodOption({ method, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-colors ${
        selected ? 'border-[#1A1A1A] bg-[#FAFAFA]' : 'border-[#E8E8E8] bg-white'
      }`}
    >
      <PaymentMethodIcon type={method.icon} />
      <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <p className="text-[16px] font-semibold text-[#1A1A1A]">{method.label}</p>
          {method.subtitle && (
            <p className="text-[13px] text-[#888] mt-0.5">{method.subtitle}</p>
          )}
          {selected && method.selectedHint && (
            <p className="text-[12px] text-[#16A34A] font-medium mt-1">{method.selectedHint}</p>
          )}
        </div>
        {selected ? (
          <span className="text-[11px] font-semibold shrink-0 px-2.5 py-1 rounded-full bg-[#E6F7ED] text-[#16A34A]">
            Seleccionado
          </span>
        ) : (
          method.badge && (
            <span className={`text-[12px] font-medium shrink-0 ${method.badgeColor}`}>
              {method.badge}
            </span>
          )
        )}
      </div>
    </button>
  )
}

function CryptoAssetOption({ asset, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-colors ${
        selected ? 'border-[#1A1A1A] bg-[#FAFAFA]' : 'border-[#E8E8E8] bg-white'
      }`}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-[11px] font-bold"
        style={{ backgroundColor: asset.color }}
      >
        {asset.label.slice(0, 1)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[16px] font-semibold text-[#1A1A1A]">{asset.label}</p>
        <p className="text-[13px] text-[#888]">{asset.name}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[14px] font-semibold text-[#1A1A1A]">
          {formatCryptoAmount(asset.balance)}
        </p>
        <p className="text-[12px] text-[#888]">{asset.label}</p>
      </div>
    </button>
  )
}

function NetworkPicker({ networks, network, setNetwork, networkOpen, setNetworkOpen }) {
  const selected = networks.find((n) => n.id === network)

  return (
    <div className="relative mb-6">
      <p className="text-[12px] font-medium text-[#888] mb-2">Elegí la red</p>
      <button
        type="button"
        onClick={() => setNetworkOpen(!networkOpen)}
        className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-[#E8E8E8] text-left"
      >
        <div className="flex items-center gap-3">
          {selected ? (
            <>
              <div
                className="w-8 h-8 rounded-full shrink-0"
                style={{ backgroundColor: selected.color }}
              />
              <span className="text-[15px] font-medium text-[#1A1A1A]">{selected.label}</span>
            </>
          ) : (
            <span className="text-[15px] text-[#888]">Seleccioná una red</span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-[#888] transition-transform ${networkOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {networkOpen && (
        <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-[#E8E8E8] rounded-2xl shadow-lg overflow-hidden">
          {networks.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                setNetwork(n.id)
                setNetworkOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[#FAFAFA] border-b border-[#F0F0F0] last:border-0"
            >
              <div className="w-8 h-8 rounded-full shrink-0" style={{ backgroundColor: n.color }} />
              <span className="text-[15px] text-[#1A1A1A] flex-1">{n.label}</span>
              {network === n.id && (
                <svg className="w-5 h-5 text-[#8247E5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function QrPlaceholder() {
  return (
    <div className="w-44 h-44 mx-auto bg-white border-2 border-[#E8E8E8] rounded-xl p-2 grid grid-cols-8 gap-px">
      {Array.from({ length: 64 }).map((_, i) => (
        <div
          key={i}
          className={`aspect-square ${(i * 7 + 3) % 5 > 1 ? 'bg-[#1A1A1A]' : 'bg-white'}`}
        />
      ))}
    </div>
  )
}

function RadioOption({ selected, onClick, label, subtitle, badge, badgeColor }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-colors ${
        selected ? 'border-[#1A1A1A] bg-[#FAFAFA]' : 'border-[#E8E8E8] bg-white'
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
          selected ? 'border-[#1A1A1A]' : 'border-[#CCC]'
        }`}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A]" />}
      </div>
      <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <p className="text-[16px] font-semibold text-[#1A1A1A]">{label}</p>
          {subtitle && <p className="text-[13px] text-[#888] mt-0.5">{subtitle}</p>}
        </div>
        {selected ? (
          <span className="text-[11px] font-semibold shrink-0 px-2.5 py-1 rounded-full bg-[#E6F7ED] text-[#16A34A]">
            Seleccionado
          </span>
        ) : (
          badge && (
            <span className={`text-[12px] font-medium shrink-0 ${badgeColor}`}>{badge}</span>
          )
        )}
      </div>
    </button>
  )
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-[12px] font-medium text-[#888] hover:text-[#1A1A1A]"
      aria-label="Copiar"
    >
      {copied ? '✓' : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  )
}

function NumericKeypad({ onKey }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', 'del']

  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onKey(key)}
          className="h-12 rounded-xl bg-[#F5F5F5] text-[20px] font-medium text-[#1A1A1A] active:bg-[#E8E8E8]"
        >
          {key === 'del' ? '⌫' : key}
        </button>
      ))}
    </div>
  )
}

function AmountStep({ opportunity, amount, setAmount, onBack, onClose, onNext }) {
  const minAmount = parseMinAmount(opportunity.minInvestment)
  const maxAmount = opportunity.maxAmount || 100000

  const numericAmount = useMemo(() => {
    const normalized = amount.replace(',', '.')
    const parsed = parseFloat(normalized)
    return Number.isFinite(parsed) ? parsed : 0
  }, [amount])

  const commission = numericAmount > 0 ? numericAmount * COMMISSION_RATE : 0
  const total = numericAmount + commission

  const error = useMemo(() => {
    if (!amount) return null
    if (numericAmount < minAmount) {
      return `El monto mínimo es USD ${formatUsd(minAmount)}`
    }
    if (numericAmount > maxAmount) {
      return `El monto máximo es USD ${formatUsd(maxAmount)}`
    }
    return null
  }, [amount, numericAmount, minAmount, maxAmount])

  const isValid = numericAmount >= minAmount && numericAmount <= maxAmount

  const handleKey = (key) => {
    if (key === 'del') {
      setAmount((prev) => prev.slice(0, -1))
      return
    }
    if (key === ',') {
      if (!amount.includes(',')) setAmount((prev) => (prev ? `${prev},` : '0,'))
      return
    }
    setAmount((prev) => {
      const next = prev === '0' ? key : `${prev}${key}`
      const parsed = parseFloat(next.replace(',', '.'))
      if (parsed > maxAmount * 10) return prev
      return next
    })
  }

  return (
    <FlowContainer className="pb-36">
      <FlowHeader step={1} totalSteps={4} title="Elegir monto" onBack={onBack} onClose={onClose} />

      <FlowContent className="pt-5 pb-8">
          <ProjectSummary opportunity={opportunity} />

          <label className="block text-[13px] font-medium text-[#888] mb-3">
            ¿Cuánto querés invertir?
          </label>

          <div
            className={`rounded-2xl border-2 px-5 py-6 mb-4 text-center transition-colors ${
              error ? 'border-[#EF4444] bg-[#FEF2F2]' : 'border-[#E8E8E8] bg-[#FAFAFA]'
            }`}
          >
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-[18px] font-medium text-[#888]">USD</span>
              <span className="text-[40px] font-bold text-[#1A1A1A] leading-none tracking-tight">
                {amount || '0'}
              </span>
            </div>
            {error && (
              <p className="text-[13px] text-[#EF4444] mt-3 font-medium">{error}</p>
            )}
          </div>

          <div className="flex gap-2 mb-6">
            {QUICK_AMOUNTS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(String(value))}
                className={`flex-1 py-2.5 rounded-full text-[13px] font-medium border transition-colors ${
                  numericAmount === value
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-[#1A1A1A] border-[#E5E5E5]'
                }`}
              >
                USD {formatUsd(value)}
              </button>
            ))}
          </div>

          {numericAmount > 0 && !error && (
            <div className="rounded-2xl bg-[#F8F8F8] px-4 py-3 mb-4 space-y-2">
              <div className="flex justify-between text-[14px]">
                <span className="text-[#888]">Monto a invertir</span>
                <span className="font-medium text-[#1A1A1A]">USD {formatUsd(numericAmount)}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#888]">Comisión estimada</span>
                <span className="font-medium text-[#16A34A]">USD {formatUsd(commission)}</span>
              </div>
              <div className="flex justify-between text-[14px] pt-2 border-t border-[#E8E8E8]">
                <span className="font-medium text-[#1A1A1A]">Total</span>
                <span className="font-bold text-[#1A1A1A]">USD {formatUsd(total)}</span>
              </div>
            </div>
          )}

          <NumericKeypad onKey={handleKey} />
      </FlowContent>

      <FlowFooter onBack={onBack} onNext={onNext} nextDisabled={!isValid} />
    </FlowContainer>
  )
}

function PaymentStep({ opportunity, amount, paymentMethod, setPaymentMethod, onBack, onClose, onNext }) {
  const { numericAmount } = useInvestmentTotals(amount)

  return (
    <FlowContainer className="pb-36">
      <FlowHeader step={2} totalSteps={4} onBack={onBack} onClose={onClose} />

      <FlowContent className="pt-2 pb-8">
        <h1 className="text-[24px] font-bold text-[#1A1A1A] mb-2 leading-tight">
          ¿Con qué querés pagar?
        </h1>
          <p className="text-[14px] text-[#888] mb-6 leading-relaxed">
            Podés darnos pesos, dólares o cripto. En todos los casos recibís tus beneficios en dólares.
          </p>

          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <PaymentMethodOption
                key={method.id}
                method={method}
                selected={paymentMethod === method.id}
                onClick={() => setPaymentMethod(method.id)}
              />
            ))}
          </div>
      </FlowContent>

      <FlowStickyFooter>
        <div className="rounded-2xl bg-[#F8F8F8] px-4 py-3 mb-4 space-y-1">
          <div className="flex justify-between text-[14px]">
            <span className="text-[#888]">Proyecto</span>
            <span className="font-medium text-[#1A1A1A]">{opportunity.title}</span>
          </div>
          <div className="flex justify-between text-[14px]">
            <span className="text-[#888]">Monto a invertir</span>
            <span className="font-semibold text-[#1A1A1A]">USD {formatUsd(numericAmount)}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3.5 rounded-full border-2 border-[#E5E5E5] text-[15px] font-semibold text-[#1A1A1A]"
          >
            Volver
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!paymentMethod}
            className={`flex-1 py-3.5 rounded-full text-[15px] font-semibold transition-colors ${
              !paymentMethod
                ? 'bg-[#E5E5E5] text-[#AAA] cursor-not-allowed'
                : 'bg-[#1A1A1A] text-white'
            }`}
          >
            Siguiente
          </button>
        </div>
      </FlowStickyFooter>
    </FlowContainer>
  )
}

function CryptoSelectStep({
  opportunity,
  investAmount,
  cryptoAsset,
  setCryptoAsset,
  cryptoNetwork,
  setCryptoNetwork,
  networkOpen,
  setNetworkOpen,
  onBack,
  onClose,
  onNext,
}) {
  const cryptoPayAmount = getCryptoPayAmount(investAmount)
  const assetLabel = CRYPTO_ASSETS.find((a) => a.id === cryptoAsset)?.label || 'USDT'
  const canContinue = cryptoAsset && cryptoNetwork

  return (
    <FlowContainer className="pb-56">
      <FlowHeader step={3} totalSteps={4} title="¿Con qué cripto vas a pagar?" onBack={onBack} onClose={onClose} />

      <FlowContent className="pt-2 pb-8">
        <p className="text-[14px] text-[#888] mb-6 leading-relaxed -mt-2">
          Podés usar cualquiera de estas dos. El valor se convertirá automáticamente a dólares.
        </p>

        <div className="space-y-3 mb-6">
          {CRYPTO_ASSETS.map((asset) => (
            <CryptoAssetOption
              key={asset.id}
              asset={asset}
              selected={cryptoAsset === asset.id}
              onClick={() => setCryptoAsset(asset.id)}
            />
          ))}
        </div>

        {cryptoAsset && (
          <NetworkPicker
            networks={CRYPTO_NETWORKS}
            network={cryptoNetwork}
            setNetwork={setCryptoNetwork}
            networkOpen={networkOpen}
            setNetworkOpen={setNetworkOpen}
          />
        )}
      </FlowContent>

      <FlowStickyFooter>
          <div className="rounded-2xl bg-[#F8F8F8] px-4 py-3 mb-4 space-y-1">
            <div className="flex justify-between text-[14px]">
              <span className="text-[#888]">Proyecto</span>
              <span className="font-medium text-[#1A1A1A]">{opportunity.title}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-[#888]">Monto a invertir</span>
              <span className="font-medium text-[#1A1A1A]">USD {formatUsd(investAmount)}</span>
            </div>
            {cryptoAsset && (
              <div className="flex justify-between text-[14px] pt-2 border-t border-[#E8E8E8]">
                <span className="font-medium text-[#1A1A1A]">Vas a invertir</span>
                <span className="font-bold text-[#1A1A1A]">
                  {formatCryptoAmount(cryptoPayAmount)} {assetLabel}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3.5 rounded-full border-2 border-[#E5E5E5] text-[15px] font-semibold text-[#1A1A1A]"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!canContinue}
              className={`flex-1 py-3.5 rounded-full text-[15px] font-semibold transition-colors ${
                !canContinue
                  ? 'bg-[#E5E5E5] text-[#AAA] cursor-not-allowed'
                  : 'bg-[#1A1A1A] text-white'
              }`}
            >
              Siguiente
            </button>
          </div>
      </FlowStickyFooter>
    </FlowContainer>
  )
}

function CryptoConfirmStep({
  opportunity,
  investAmount,
  cryptoAsset,
  cryptoNetwork,
  onBack,
  onClose,
  onComplete,
  onSimulateWrongNetwork,
}) {
  const asset = CRYPTO_ASSETS.find((a) => a.id === cryptoAsset)
  const network = CRYPTO_NETWORKS.find((n) => n.id === cryptoNetwork)
  const cryptoPayAmount = getCryptoPayAmount(investAmount)
  const estimatedReturn = investAmount * 0.12
  const shortAddress = `${CRYPTO_WALLET_ADDRESS.slice(0, 6)}...${CRYPTO_WALLET_ADDRESS.slice(-4)}`

  return (
    <FlowContainer className="pb-44">
      <FlowHeader
        step={4}
        totalSteps={4}
        title="Revisá y confirmá tu inversión"
        onBack={onBack}
        onClose={onClose}
      />

      <FlowContent className="pt-2 pb-8">
        <p className="text-[14px] text-[#888] mb-6 leading-relaxed -mt-2">
          Enviá los fondos desde tu wallet para finalizar tu inversión.
        </p>

          <div className="rounded-2xl border border-[#EFEFEF] px-4 mb-6 divide-y divide-[#F0F0F0]">
            <div className="flex justify-between py-3 text-[14px]">
              <span className="text-[#888]">Proyecto</span>
              <span className="font-medium text-[#1A1A1A]">{opportunity.title}</span>
            </div>
            <div className="flex justify-between py-3 text-[14px]">
              <span className="text-[#888]">Monto a invertir</span>
              <span className="font-medium text-[#1A1A1A]">USD {formatUsd(investAmount)}</span>
            </div>
            <div className="flex justify-between py-3 text-[14px]">
              <span className="text-[#888]">Plazo</span>
              <span className="font-medium text-[#1A1A1A]">{opportunity.term}</span>
            </div>
            <div className="flex justify-between py-3 text-[14px]">
              <span className="text-[#888]">Retorno estimado</span>
              <span className="font-semibold text-[#16A34A]">+ USD {formatUsd(estimatedReturn)}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EFEFEF] p-5 mb-4 text-center">
            <QrPlaceholder />
            <div className="flex items-center justify-center gap-2 mt-4 mb-3">
              <p className="text-[13px] font-mono text-[#1A1A1A]">{shortAddress}</p>
              <CopyButton value={CRYPTO_WALLET_ADDRESS} />
            </div>
            <p className="text-[14px] text-[#666] leading-relaxed">
              Enviar <strong>{formatCryptoAmount(cryptoPayAmount)} {asset?.label}</strong> por la red{' '}
              <strong>{network?.label}</strong>
            </p>
          </div>

          {onSimulateWrongNetwork && (
            <button
              type="button"
              onClick={onSimulateWrongNetwork}
              className="w-full text-[13px] text-[#AAA] underline mb-2"
            >
              Simular red incorrecta (ensayo)
            </button>
          )}
      </FlowContent>

      <FlowFooter onBack={onBack} onNext={onComplete} nextLabel="Ya lo envié" />
    </FlowContainer>
  )
}

function CurrencyMethodStep({
  opportunity,
  investAmount,
  commission,
  payTotal,
  totalArs,
  currency,
  title,
  subtitle,
  options,
  wallets,
  walletPlaceholder,
  subPayType,
  setSubPayType,
  wallet,
  setWallet,
  walletOpen,
  setWalletOpen,
  onBack,
  onClose,
  onNext,
}) {
  const canContinue =
    subPayType === 'transfer' || subPayType === 'card' || (subPayType === 'wallet' && wallet)

  const nextLabel = subPayType === 'wallet' && wallet ? 'Ir a billetera' : 'Siguiente'
  const payLabel = subPayType === 'transfer' ? 'Vas a transferir' : 'Vas a pagar'

  return (
    <FlowContainer className="pb-52">
      <FlowHeader step={3} totalSteps={4} title={title} onBack={onBack} onClose={onClose} />

      <FlowContent className="pt-2 pb-8">
        {subtitle && (
          <p className="text-[14px] text-[#888] mb-6 leading-relaxed -mt-2">{subtitle}</p>
        )}

        <div className="space-y-3 mb-6">
          {options.map((option) => (
            <RadioOption
              key={option.id}
              selected={subPayType === option.id}
              onClick={() => {
                setSubPayType(option.id)
                if (option.id !== 'wallet') setWallet(null)
              }}
              label={option.label}
              subtitle={option.subtitle}
              badge={option.badge}
              badgeColor={option.badgeColor}
            />
          ))}
        </div>

        {subPayType === 'wallet' && (
          <WalletPicker
            wallets={wallets}
            wallet={wallet}
            setWallet={setWallet}
            walletOpen={walletOpen}
            setWalletOpen={setWalletOpen}
            placeholder={walletPlaceholder}
          />
        )}
      </FlowContent>

      <FlowStickyFooter>
        <InvestmentSummary
            opportunity={opportunity}
            investAmount={investAmount}
            commission={commission}
            payTotal={payTotal}
            totalArs={totalArs}
            currency={currency}
            payLabel={payLabel}
          />
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3.5 rounded-full border-2 border-[#E5E5E5] text-[15px] font-semibold text-[#1A1A1A]"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!canContinue}
              className={`flex-1 py-3.5 rounded-full text-[15px] font-semibold transition-colors ${
                !canContinue
                  ? 'bg-[#E5E5E5] text-[#AAA] cursor-not-allowed'
                  : 'bg-[#1A1A1A] text-white'
              }`}
            >
              {nextLabel}
            </button>
          </div>
      </FlowStickyFooter>
    </FlowContainer>
  )
}

function TransferConfirmStep({
  opportunity,
  totalUsd,
  totalArs,
  currency = 'ars',
  operationRef,
  acceptedContract,
  setAcceptedContract,
  acceptedSecond,
  setAcceptedSecond,
  onBack,
  onClose,
  onComplete,
}) {
  const estimatedReturn = totalUsd * 0.095
  const isUsd = currency === 'usd'

  const rows = [
    { label: 'Titular', value: 'MINCA S.A.', sub: 'CUIT 30-71567890-1' },
    { label: 'Banco', value: 'Banco Galicia' },
    { label: 'CBU', value: isUsd ? '0070099930004012345678' : '000009943000009876543', copy: true },
    { label: 'Alias', value: isUsd ? 'MINCA.USD' : 'MINCA.INVERSION', copy: true },
    {
      label: 'Monto',
      value: isUsd ? `USD ${formatUsd(totalUsd)}` : `ARS ${formatArs(totalArs)}`,
    },
    { label: 'Referencia', value: operationRef, copy: true },
  ]

  const secondCheckboxLabel = isUsd
    ? 'Confirmo que la transferencia proviene de una cuenta en dólares a mi nombre'
    : 'Entiendo que sin referencia obligatoria mi pago no puede identificarse'

  const canComplete = acceptedContract && acceptedSecond

  return (
    <FlowContainer className="pb-44">
      <FlowHeader
        step={4}
        totalSteps={4}
        title="Revisá y confirmá tu inversión"
        onBack={onBack}
        onClose={onClose}
      />

      <FlowContent className="pt-5 pb-8">
        <section className="mb-6">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-[#999] uppercase mb-3">
              Detalle de la operación
            </p>
            <div className="rounded-2xl border border-[#EFEFEF] px-4 divide-y divide-[#F0F0F0]">
              <div className="flex justify-between py-3 text-[14px]">
                <span className="text-[#888]">Proyecto</span>
                <span className="font-medium text-[#1A1A1A]">{opportunity.title}</span>
              </div>
              <div className="flex justify-between py-3 text-[14px]">
                <span className="text-[#888]">Monto</span>
                <span className="font-medium text-[#1A1A1A]">USD {formatUsd(totalUsd)}</span>
              </div>
              <div className="flex justify-between py-3 text-[14px]">
                <span className="text-[#888]">Plazo</span>
                <span className="font-medium text-[#1A1A1A]">{opportunity.term}</span>
              </div>
              <div className="flex justify-between py-3 text-[14px]">
                <span className="text-[#888]">Retorno estimado</span>
                <span className="font-medium text-[#16A34A]">+USD {formatUsd(estimatedReturn)}</span>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-[#999] uppercase mb-3">
              Datos para transferir
            </p>
            <div className="rounded-2xl border border-[#EFEFEF] px-4">
              {rows.map((row) => (
                <div key={row.label} className="flex items-start justify-between py-3 border-b border-[#F0F0F0] last:border-0 gap-3">
                  <div>
                    <p className="text-[12px] text-[#888]">{row.label}</p>
                    <p className="text-[14px] font-medium text-[#1A1A1A]">{row.value}</p>
                    {row.sub && <p className="text-[12px] text-[#888]">{row.sub}</p>}
                  </div>
                  {row.copy && <CopyButton value={row.value} />}
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-4 mb-4">
            <label className="flex gap-3 items-start cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedContract}
                onChange={(e) => setAcceptedContract(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#CCC]"
              />
              <span className="text-[14px] text-[#444] leading-relaxed">
                Leí y acepto el contrato de participación
              </span>
            </label>
            <label className="flex gap-3 items-start cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedSecond}
                onChange={(e) => setAcceptedSecond(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#CCC]"
              />
              <span className="text-[14px] text-[#444] leading-relaxed">
                {secondCheckboxLabel}
              </span>
            </label>
          </div>
      </FlowContent>

      <FlowFooter
        onBack={onBack}
        onNext={onComplete}
        nextDisabled={!canComplete}
        nextLabel="Ya transferí"
      />
    </FlowContainer>
  )
}

function WalletPayStep({ wallet, amount, currency, wallets, onBack, onClose, onComplete }) {
  const walletLabel = wallets.find((w) => w.id === wallet)?.label || 'Billetera'
  const brand = WALLET_BRANDING[wallet] || { bg: '#3483FA', initials: 'W', accent: '#3483FA' }
  const formattedAmount = currency === 'usd' ? `USD ${formatUsd(amount)}` : `$ ${formatArs(amount)}`

  const { isDesktop } = useFlowLayout()

  return (
    <FlowContainer className={isDesktop ? '' : 'bg-[#F5F5F5]'}>
      <div className={`flex flex-col flex-1 ${isDesktop ? '' : 'bg-[#F5F5F5]'}`}>
        <div className={`flex items-center justify-between ${isDesktop ? 'px-8 pt-6 pb-4' : 'px-5 pt-12 pb-4'}`}>
          <button type="button" onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center -mr-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={`flex-1 flex flex-col items-center justify-center text-center ${isDesktop ? 'px-8 pb-8' : 'px-5'}`}>
          <div className="w-full bg-white rounded-3xl p-6 shadow-sm mb-6 border border-[#EFEFEF]">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg"
              style={{ backgroundColor: brand.bg }}
            >
              <span className={wallet === 'lemon' ? '' : 'text-white text-[10px] font-bold'}>
                {brand.initials}
              </span>
            </div>
            <p className="text-[13px] text-[#888] mb-1">{walletLabel}</p>
            <p className="text-[12px] text-[#AAA] mb-6">Account balance</p>

            <p className="text-[32px] font-bold text-[#1A1A1A] mb-2">{formattedAmount}</p>
            <p className="text-[13px] text-[#888] mb-8">Pago a MINCA · Inversión</p>

            <div
              className="w-full h-24 rounded-2xl mb-6 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${brand.accent}, ${brand.bg})` }}
            >
              <div className="w-16 h-10 rounded-md bg-white/20 border border-white/30" />
            </div>

            <button
              type="button"
              onClick={onComplete}
              className="w-full py-4 rounded-2xl text-white text-[16px] font-semibold"
              style={{ backgroundColor: brand.accent }}
            >
              Pagar
            </button>
          </div>
          <p className="text-[12px] text-[#AAA]">Simulación de pago externo · {walletLabel}</p>
        </div>
      </div>
    </FlowContainer>
  )
}

function WalletRedirectStep({ wallet, wallets, onBack, onClose, onComplete }) {
  const walletLabel = wallets.find((w) => w.id === wallet)?.label || 'Billetera'
  const brand = WALLET_BRANDING[wallet] || { bg: '#1A1A1A', initials: 'W' }
  const { isDesktop } = useFlowLayout()

  const content = (
    <>
      <button
        type="button"
        onClick={onBack}
        className={`absolute w-10 h-10 flex items-center justify-center text-white/60 ${isDesktop ? 'top-6 left-6' : 'top-12 left-5'}`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onClose}
        className={`absolute w-10 h-10 flex items-center justify-center text-white/60 ${isDesktop ? 'top-6 right-6' : 'top-12 right-5'}`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-8 text-3xl border-4 border-white/10"
        style={{ backgroundColor: brand.bg }}
      >
        <span>{brand.initials}</span>
      </div>
      <p className="text-white text-[18px] font-semibold mb-2">Abriendo {walletLabel}</p>
      <p className="text-white/50 text-[14px] mb-10 leading-relaxed">
        Te redirigimos a tu billetera para confirmar el pago.
      </p>
      <button
        type="button"
        onClick={onComplete}
        className="px-8 py-3 rounded-full border border-white/30 text-white text-[14px] font-medium"
      >
        Simular retorno de la billetera
      </button>
    </>
  )

  if (isDesktop) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[#F5F5F5] flex justify-center items-start py-10 px-6">
        <div className="w-full max-w-[560px] min-h-[480px] bg-[#0A0A0A] rounded-2xl shadow-xl flex flex-col items-center justify-center px-8 text-center relative">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col items-center justify-center px-8 text-center relative">
        {content}
      </div>
    </div>
  )
}

function CardPayStep({
  opportunity,
  investAmount,
  commission,
  payTotal,
  onBack,
  onClose,
  onComplete,
  onPaymentFailed,
}) {
  const [cardNumber, setCardNumber] = useState('')
  const [holder, setHolder] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [acceptedContract, setAcceptedContract] = useState(false)
  const [saveCard, setSaveCard] = useState(false)

  const canPay =
    cardNumber.replace(/\s/g, '').length >= 15 &&
    holder.trim().length >= 3 &&
    expiry.length >= 4 &&
    cvv.length >= 3 &&
    acceptedContract

  const formatCardInput = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length <= 2) return digits
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }

  const { isDesktop } = useFlowLayout()

  return (
    <FlowContainer className="pb-44">
      <FlowHeader step={3} totalSteps={4} onBack={onBack} onClose={onClose} />

      <FlowContent className="pt-2 pb-8">
        <h1 className={`font-bold text-[#1A1A1A] mb-2 ${isDesktop ? 'text-[26px]' : 'text-[22px]'}`}>
          Ingresá los datos de tu tarjeta
        </h1>
          <p className="text-[14px] text-[#888] mb-6 leading-relaxed">
            El pago se procesará de forma segura por Stripe.
          </p>

          <div className="rounded-2xl bg-[#F8F8F8] px-4 py-4 space-y-2 mb-6">
            <div className="flex justify-between text-[14px]">
              <span className="text-[#888]">Proyecto</span>
              <span className="font-medium text-[#1A1A1A]">{opportunity.title}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-[#888]">Monto a invertir</span>
              <span className="font-medium text-[#1A1A1A]">USD {formatUsd(investAmount)}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-[#888]">Costo de servicio</span>
              <span className="font-medium text-[#1A1A1A]">USD {formatUsd(commission)}</span>
            </div>
            <div className="flex justify-between text-[14px] pt-2 border-t border-[#E8E8E8]">
              <span className="font-medium text-[#1A1A1A]">Monto total a pagar</span>
              <span className="font-bold text-[#16A34A]">USD {formatUsd(payTotal)}</span>
            </div>
          </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-[12px] font-medium text-[#888] mb-1.5 block">Número de tarjeta</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
              className="w-full px-4 py-3.5 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#888] mb-1.5 block">Titular</label>
            <input
              type="text"
              placeholder="Como figura en la tarjeta"
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-[#888] mb-1.5 block">Fecha</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/AA"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                className="w-full px-4 py-3.5 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#888] mb-1.5 block">CVV</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full px-4 py-3.5 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>
        </div>

        <label className="flex gap-3 items-start cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={saveCard}
            onChange={(e) => setSaveCard(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-[#CCC]"
          />
          <span className="text-[14px] text-[#444] leading-relaxed">
            Guardar datos de la tarjeta para futuras inversiones
          </span>
        </label>

        <label className="flex gap-3 items-start cursor-pointer mb-3">
          <input
            type="checkbox"
            checked={acceptedContract}
            onChange={(e) => setAcceptedContract(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-[#CCC]"
          />
          <span className="text-[14px] text-[#444] leading-relaxed">
            Leí y acepto el contrato de participación y autorizo el cargo a mi tarjeta
          </span>
        </label>

        <p className="text-[12px] text-[#AAA] leading-relaxed mb-4">
          Al continuar, aceptás los términos del contrato de participación y la política de privacidad de MINCA.
        </p>

        {onPaymentFailed && (
          <button
            type="button"
            onClick={onPaymentFailed}
            className="w-full text-[13px] text-[#AAA] underline mb-2"
          >
            Simular rechazo de tarjeta (ensayo)
          </button>
        )}
      </FlowContent>

      <FlowFooter
        onBack={onBack}
        onNext={onComplete}
        nextDisabled={!canPay}
        nextLabel={`Pagar USD ${formatUsd(payTotal)}`}
      />
    </FlowContainer>
  )
}

export default function InvestmentFlow({
  opportunity,
  onClose,
  onGoToPortfolio,
  layout = 'mobile',
  initialAmount = '',
  initialStep,
}) {
  return (
    <FlowLayoutProvider layout={layout}>
      <InvestmentFlowInner
        opportunity={opportunity}
        onClose={onClose}
        onGoToPortfolio={onGoToPortfolio}
        initialAmount={initialAmount}
        initialStep={initialStep}
      />
    </FlowLayoutProvider>
  )
}

function InvestmentFlowInner({
  opportunity,
  onClose,
  onGoToPortfolio,
  initialAmount = '',
  initialStep,
}) {
  const [step, setStep] = useState(() => initialStep ?? (initialAmount ? 2 : 1))
  const [amount, setAmount] = useState(initialAmount)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [subPayType, setSubPayType] = useState(null)
  const [wallet, setWallet] = useState(null)
  const [walletOpen, setWalletOpen] = useState(false)
  const [acceptedContract, setAcceptedContract] = useState(false)
  const [acceptedSecond, setAcceptedSecond] = useState(false)
  const [cryptoAsset, setCryptoAsset] = useState(null)
  const [cryptoNetwork, setCryptoNetwork] = useState(null)
  const [networkOpen, setNetworkOpen] = useState(false)

  const { numericAmount, commission, totalUsd, totalArs } = useInvestmentTotals(amount)
  const [errorVariant, setErrorVariant] = useState('transfer')
  const cryptoPayAmount = getCryptoPayAmount(numericAmount)

  const [investmentId, setInvestmentId] = useState(null)
  const [paymentId, setPaymentId] = useState(null)
  const [operationRef, setOperationRef] = useState('')

  const firstReturnDate = useMemo(() => getFirstReturnDate(), [])

  const isPendingPayment = subPayType === 'transfer' || paymentMethod === 'crypto'

  const ensureInvestment = useCallback(async () => {
    if (investmentId) return investmentId
    const res = await createInvestment(opportunity.id, numericAmount)
    setInvestmentId(res.data.investmentId)
    setOperationRef(res.data.operationRef)
    return res.data.investmentId
  }, [investmentId, opportunity.id, numericAmount])

  const handleComplete = async () => {
    try {
      const invId = await ensureInvestment()
      const payRes = await createPayment(invId, {
        method: paymentMethod,
        subMethod: subPayType,
        walletProvider: wallet,
        cryptoAsset,
        cryptoNetwork,
      })
      setPaymentId(payRes.data.paymentId)
      if (payRes.data.operationRef) setOperationRef(payRes.data.operationRef)

      if (!payRes.data.isPendingPayment) {
        await confirmPayment(invId, payRes.data.paymentId)
      }

      if (isPendingPayment) setStep(6)
      else setStep(5)
    } catch (err) {
      console.error(err)
      setErrorVariant(paymentMethod === 'crypto' ? 'crypto-network' : 'transfer')
      setStep(8)
    }
  }

  const finaleProps = {
    opportunity,
    investAmount: numericAmount,
    commission,
    totalUsd,
    totalArs,
    paymentMethod,
    subPayType,
    wallet,
    cryptoAsset,
    cryptoNetwork,
    cryptoPayAmount,
    operationRef,
    onClose,
    onGoToPortfolio: onGoToPortfolio || onClose,
  }

  const arsWallets = ARS_WALLETS
  const usdWallets = USD_WALLETS

  if (step === 5) {
    return <BuildingAnimationStep onComplete={() => setStep(6)} />
  }

  if (step === 6 && isPendingPayment) {
    return (
      <WaitingPaymentStep
        variant={paymentMethod === 'crypto' ? 'crypto' : 'transfer'}
        operationRef={operationRef}
        cryptoAsset={cryptoAsset}
        cryptoNetwork={cryptoNetwork}
        cryptoPayAmount={cryptoPayAmount}
        onClose={onClose}
        onGoToPortfolio={onGoToPortfolio || onClose}
        onSimulateError={() => {
          setErrorVariant(paymentMethod === 'crypto' ? 'crypto-network' : 'transfer')
          setStep(8)
        }}
      />
    )
  }

  if (step === 6) {
    return (
      <SuccessSplashStep
        investAmount={numericAmount}
        firstReturnDate={firstReturnDate}
        onViewDetail={() => setStep(7)}
      />
    )
  }

  if (step === 7) {
    return <ConfirmationDetailStep {...finaleProps} />
  }

  if (step === 8) {
    return (
      <PaymentErrorStep
        variant={errorVariant}
        opportunity={opportunity}
        investAmount={numericAmount}
        totalUsd={totalUsd}
        operationRef={operationRef}
        cryptoAsset={cryptoAsset}
        cryptoNetwork={cryptoNetwork}
        cryptoPayAmount={cryptoPayAmount}
        onClose={onClose}
        onGoToPortfolio={onGoToPortfolio || onClose}
        onRetry={() => {
          if (errorVariant === 'card' || errorVariant === 'crypto-network') setStep(4)
          else setStep(1)
        }}
      />
    )
  }

  if (step === 1) {
    return (
      <AmountStep
        opportunity={opportunity}
        amount={amount}
        setAmount={setAmount}
        onBack={onClose}
        onClose={onClose}
        onNext={() => setStep(2)}
      />
    )
  }

  if (step === 2) {
    return (
      <PaymentStep
        opportunity={opportunity}
        amount={amount}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        onBack={() => setStep(1)}
        onClose={onClose}
        onNext={() => setStep(3)}
      />
    )
  }

  if (step === 3 && paymentMethod === 'ars') {
    return (
      <CurrencyMethodStep
        opportunity={opportunity}
        investAmount={numericAmount}
        commission={commission}
        payTotal={totalUsd}
        totalArs={totalArs}
        currency="ars"
        title="¿Cómo vas a pagar en pesos?"
        subtitle="Seleccioná el medio de pago para realizar tu inversión."
        options={ARS_PAY_OPTIONS}
        wallets={arsWallets}
        walletPlaceholder="Elige una billetera virtual"
        subPayType={subPayType}
        setSubPayType={setSubPayType}
        wallet={wallet}
        setWallet={setWallet}
        walletOpen={walletOpen}
        setWalletOpen={setWalletOpen}
        onBack={() => setStep(2)}
        onClose={onClose}
        onNext={() => setStep(4)}
      />
    )
  }

  if (step === 3 && paymentMethod === 'usd') {
    return (
      <CurrencyMethodStep
        opportunity={opportunity}
        investAmount={numericAmount}
        commission={commission}
        payTotal={totalUsd}
        totalArs={totalArs}
        currency="usd"
        title="¿Cómo vas a pagar en dólares?"
        subtitle="Seleccioná el medio de pago para realizar tu inversión."
        options={USD_PAY_OPTIONS}
        wallets={usdWallets}
        walletPlaceholder="Elegí tu billetera virtual"
        subPayType={subPayType}
        setSubPayType={setSubPayType}
        wallet={wallet}
        setWallet={setWallet}
        walletOpen={walletOpen}
        setWalletOpen={setWalletOpen}
        onBack={() => setStep(2)}
        onClose={onClose}
        onNext={() => setStep(4)}
      />
    )
  }

  if (step === 3 && paymentMethod === 'crypto') {
    return (
      <CryptoSelectStep
        opportunity={opportunity}
        investAmount={numericAmount}
        cryptoAsset={cryptoAsset}
        setCryptoAsset={setCryptoAsset}
        cryptoNetwork={cryptoNetwork}
        setCryptoNetwork={setCryptoNetwork}
        networkOpen={networkOpen}
        setNetworkOpen={setNetworkOpen}
        onBack={() => setStep(2)}
        onClose={onClose}
        onNext={() => setStep(4)}
      />
    )
  }

  if (step === 4 && paymentMethod === 'ars' && subPayType === 'wallet') {
    return (
      <WalletPayStep
        wallet={wallet}
        amount={totalArs}
        currency="ars"
        wallets={arsWallets}
        onBack={() => setStep(3)}
        onClose={onClose}
        onComplete={handleComplete}
      />
    )
  }

  if (step === 4 && paymentMethod === 'usd' && subPayType === 'wallet') {
    return (
      <WalletRedirectStep
        wallet={wallet}
        wallets={usdWallets}
        onBack={() => setStep(3)}
        onClose={onClose}
        onComplete={handleComplete}
      />
    )
  }

  if (step === 4 && subPayType === 'card') {
    return (
      <CardPayStep
        opportunity={opportunity}
        investAmount={numericAmount}
        commission={commission}
        payTotal={totalUsd}
        onBack={() => setStep(3)}
        onClose={onClose}
        onComplete={handleComplete}
        onPaymentFailed={() => {
          setErrorVariant('card')
          setStep(8)
        }}
      />
    )
  }

  if (step === 4 && paymentMethod === 'crypto') {
    return (
      <CryptoConfirmStep
        opportunity={opportunity}
        investAmount={numericAmount}
        cryptoAsset={cryptoAsset}
        cryptoNetwork={cryptoNetwork}
        onBack={() => setStep(3)}
        onClose={onClose}
        onComplete={handleComplete}
        onSimulateWrongNetwork={() => {
          setErrorVariant('crypto-network')
          setStep(8)
        }}
      />
    )
  }

  if (step === 4 && subPayType === 'transfer') {
    return (
      <TransferConfirmStep
        opportunity={opportunity}
        totalUsd={totalUsd}
        totalArs={totalArs}
        currency={paymentMethod === 'usd' ? 'usd' : 'ars'}
        operationRef={operationRef}
        acceptedContract={acceptedContract}
        setAcceptedContract={setAcceptedContract}
        acceptedSecond={acceptedSecond}
        setAcceptedSecond={setAcceptedSecond}
        onBack={() => setStep(3)}
        onClose={onClose}
        onComplete={handleComplete}
      />
    )
  }

  return null
}
