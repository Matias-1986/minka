import { useEffect, useMemo, useState } from 'react'
import {
  FlowContainer,
  FlowFinaleContainer,
  FlowFinaleInner,
  useFlowLayout,
} from './context/FlowLayoutContext'

const PAYMENT_LABELS = {
  mercadopago: 'Mercado Pago',
  brubank: 'Brubank',
  uala: 'Ualá',
  lemon: 'Lemon Cash',
  buenbit: 'Buenbit',
  belo: 'Belo',
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

function formatDateEs(date) {
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
}

function formatMonthYear(date) {
  const raw = date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

const CRYPTO_ASSET_LABELS = { usdt: 'USDT', usdc: 'USDC' }
const CRYPTO_NETWORK_LABELS = { ethereum: 'Ethereum', polygon: 'Polygon', tron: 'Tron' }

function formatCryptoAmount(value) {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function getPaymentChannel(paymentMethod, subPayType, wallet, cryptoAsset, cryptoNetwork) {
  if (paymentMethod === 'crypto') {
    const asset = CRYPTO_ASSET_LABELS[cryptoAsset] || 'USDT'
    const network = CRYPTO_NETWORK_LABELS[cryptoNetwork] || 'Polygon'
    return `${asset} · ${network}`
  }
  if (subPayType === 'wallet') return PAYMENT_LABELS[wallet] || 'Billetera virtual'
  if (subPayType === 'transfer') {
    return paymentMethod === 'usd' ? 'Transferencia en USD' : 'Transferencia bancaria'
  }
  if (subPayType === 'card') return 'Tarjeta de crédito o débito'
  return '—'
}

function getTimeline() {
  const now = new Date()
  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + 3)
  const june = new Date(now)
  june.setMonth(june.getMonth() + 2)

  return [
    {
      period: formatMonthYear(now),
      label: 'Participación confirmada',
      description: 'Recibirás el comprobante y el contrato firmado por email.',
      done: true,
    },
    {
      period: formatMonthYear(nextWeek),
      label: 'Firma de contrato en proceso',
      description: 'Te enviamos el contrato para firma digital.',
      done: false,
      current: true,
    },
    {
      period: formatMonthYear(june),
      label: 'Informe de certificación',
      description: 'Primer reporte con métricas del activo.',
      done: false,
    },
  ]
}

function OperationRefAccordion({ operationRef, defaultOpen = false, confirmed = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#EFEFEF] mb-5 text-left bg-[#FAFAFA]"
    >
      <div className="flex items-center gap-3 min-w-0">
        {confirmed && (
          <div className="w-8 h-8 rounded-full bg-[#E6F7ED] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#16A34A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[12px] text-[#888] mb-0.5">Número de operación</p>
          <p className="text-[14px] font-mono font-medium text-[#1A1A1A] truncate">
            {open ? operationRef : operationRef}
          </p>
        </div>
      </div>
      <svg
        className={`w-5 h-5 text-[#888] shrink-0 ml-2 transition-transform ${open ? 'rotate-180' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  )
}

function IsometricScene({ built }) {
  return (
    <div className="relative w-56 h-44 mx-auto mb-8">
      <div
        className="absolute inset-x-0 bottom-0 h-24 rounded-full opacity-40 blur-2xl"
        style={{ background: 'linear-gradient(180deg, #DBEAFE 0%, transparent 100%)' }}
      />
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-40 h-16 bg-white rounded-lg shadow-md border border-[#E8E8E8]"
        style={{ transform: 'translateX(-50%) rotateX(55deg) rotateZ(-45deg)', transformStyle: 'preserve-3d' }}
      />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-10 bg-[#F5F5F5] rounded border border-[#EBEBEB]" />
      {built && (
        <>
          <div className="absolute bottom-[4.5rem] left-[38%] w-8 h-14 bg-[#1A1A1A] rounded-t-sm shadow-lg" />
          <div className="absolute bottom-[4.5rem] left-[48%] w-6 h-10 bg-[#444] rounded-t-sm shadow-md" />
          <div className="absolute bottom-[4.25rem] left-[56%] w-5 h-8 bg-[#666] rounded-t-sm" />
          <div className="absolute bottom-[3.75rem] left-[34%] w-4 h-5 bg-[#555] rounded-t-sm" />
          <div className="absolute bottom-14 left-[30%] w-3 h-3 rounded-full bg-[#4ADE80]" />
          <div className="absolute bottom-14 left-[62%] w-3 h-3 rounded-full bg-[#4ADE80]" />
        </>
      )}
    </div>
  )
}

export function BuildingAnimationStep({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2800)
    return () => clearTimeout(timer)
  }, [onComplete])

  const { isDesktop } = useFlowLayout()

  return (
    <FlowFinaleContainer className="relative overflow-hidden">
      {!isDesktop && (
        <div
          className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent 0%, #DBEAFE 100%)' }}
        />
      )}
      <FlowFinaleInner className="items-center justify-center px-8 text-center relative z-10 flex-1">
        <IsometricScene built={false} />
        <h1 className={`font-bold text-[#1A1A1A] mb-3 ${isDesktop ? 'text-[26px]' : 'text-[22px]'}`}>
          Construyendo tu inversión
        </h1>
        <p className="text-[15px] text-[#888] leading-relaxed">
          Estamos confirmando tu participación en el proyecto.
        </p>
        <div className="mt-8 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#1A1A1A] animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </FlowFinaleInner>
    </FlowFinaleContainer>
  )
}

export function SuccessSplashStep({ investAmount, firstReturnDate, onViewDetail }) {
  const { isDesktop } = useFlowLayout()

  return (
    <FlowFinaleContainer className="relative overflow-hidden">
      {!isDesktop && (
        <div
          className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent 0%, #DBEAFE 100%)' }}
        />
      )}
      <FlowFinaleInner className={`relative z-10 flex-1 ${isDesktop ? 'px-8 pt-10 pb-8' : 'px-5 pt-16 pb-8'}`}>
        <div className="flex-1 flex flex-col items-center text-center">
          <IsometricScene built />
          <h1 className="text-[26px] font-bold text-[#1A1A1A] mb-3">¡Inversión exitosa!</h1>
          <p className="text-[15px] text-[#666] leading-relaxed max-w-[300px]">
            Tu inversión de <strong>USD {formatUsd(investAmount)}</strong> ya está activa. El primer
            retorno será el <strong>{firstReturnDate}</strong>.
          </p>
        </div>
        <button
          type="button"
          onClick={onViewDetail}
          className="w-full py-3.5 rounded-full bg-[#1A1A1A] text-white text-[15px] font-semibold mt-8"
        >
          Ver detalle de la operación
        </button>
      </FlowFinaleInner>
    </FlowFinaleContainer>
  )
}

export function ConfirmationDetailStep({
  opportunity,
  investAmount,
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
  onGoToPortfolio,
}) {
  const [detailsOpen, setDetailsOpen] = useState(true)
  const timeline = useMemo(() => getTimeline(), [])
  const amount = investAmount || totalUsd
  const fee = commission || 0
  const tna = parseFloat(opportunity.tnaValue) || 9.5
  const estimatedReturn = amount * (tna / 100)
  const paymentChannel = getPaymentChannel(
    paymentMethod,
    subPayType,
    wallet,
    cryptoAsset,
    cryptoNetwork,
  )
  const isCard = subPayType === 'card'
  const isCrypto = paymentMethod === 'crypto'
  const { isDesktop } = useFlowLayout()

  return (
    <FlowContainer className="pb-8">
      <div className="relative h-44">
          <img src={opportunity.image} alt={opportunity.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <p className="text-[18px] font-bold">{opportunity.title}</p>
            <p className="text-[13px] text-white/80">{opportunity.location}</p>
          </div>
        </div>

      <div className={`pt-5 ${isDesktop ? 'px-8' : 'px-5'}`}>
        <OperationRefAccordion operationRef={operationRef} confirmed />

          <p className="text-[11px] font-semibold tracking-[0.08em] text-[#999] uppercase mb-4">
            Qué pasa ahora
          </p>

          <div className="mb-6">
            {timeline.map((item, i) => (
              <div key={item.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      item.done
                        ? 'bg-[#16A34A]'
                        : item.current
                          ? 'bg-[#DBEAFE] border-2 border-[#3B82F6]'
                          : 'border-2 border-[#E0E0E0] bg-white'
                    }`}
                  >
                    {item.done && (
                      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                    {item.current && (
                      <svg className="w-3.5 h-3.5 text-[#3B82F6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 3" />
                      </svg>
                    )}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className={`w-0.5 flex-1 min-h-[40px] ${item.done ? 'bg-[#16A34A]' : 'bg-[#E8E8E8]'}`} />
                  )}
                </div>
                <div className="pb-5 flex-1">
                  <p className="text-[11px] font-semibold text-[#AAA] uppercase tracking-wide mb-0.5">
                    {item.period}
                  </p>
                  <p className={`text-[14px] font-semibold mb-1 ${item.done ? 'text-[#1A1A1A]' : 'text-[#666]'}`}>
                    {item.label}
                  </p>
                  {item.description && (
                    <p className="text-[13px] text-[#888] leading-relaxed">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#EFEFEF] mb-4 text-left"
          >
            <span className="text-[14px] font-semibold text-[#1A1A1A]">Detalle de la operación</span>
            <svg
              className={`w-5 h-5 text-[#888] transition-transform ${detailsOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {detailsOpen && (
            <div className="rounded-2xl border border-[#EFEFEF] px-4 mb-6 divide-y divide-[#F0F0F0]">
              <div className="flex justify-between py-3 text-[14px]">
                <span className="text-[#888]">Inversión</span>
                <span className="font-semibold">USD {formatUsd(amount)}</span>
              </div>
              {fee > 0 && (
                <div className="flex justify-between py-3 text-[14px]">
                  <span className="text-[#888]">Costo de servicio</span>
                  <span className="font-medium">USD {formatUsd(fee)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 text-[14px]">
                <span className="text-[#888]">Retorno estimado anual</span>
                <span className="font-semibold text-[#16A34A]">
                  +{opportunity.tnaValue} (USD {formatUsd(estimatedReturn)})
                </span>
              </div>
              <div className="flex justify-between py-3 text-[14px]">
                <span className="text-[#888]">Plazo</span>
                <span className="font-medium">{opportunity.term}</span>
              </div>
              <div className="flex justify-between items-center py-3 text-[14px]">
                <span className="text-[#888]">Estado</span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#E6F7ED] text-[#16A34A]">
                  Activo
                </span>
              </div>
              {isCard ? (
                <>
                  <div className="flex justify-between py-3 text-[14px]">
                    <span className="text-[#888]">Monto invertido</span>
                    <span className="font-medium">USD {formatUsd(amount)}</span>
                  </div>
                  <div className="flex justify-between py-3 text-[14px]">
                    <span className="text-[#888]">Medio de pago</span>
                    <span className="font-medium">Mastercard **** 3456</span>
                  </div>
                  <div className="flex justify-between py-3 text-[14px]">
                    <span className="text-[#888]">ID de pago</span>
                    <span className="font-mono text-[12px]">pi_3OqXk2LkdIwHu7ix0K</span>
                  </div>
                </>
              ) : isCrypto ? (
                <>
                  <div className="flex justify-between py-3 text-[14px]">
                    <span className="text-[#888]">Monto enviado</span>
                    <span className="font-medium">
                      {formatCryptoAmount(cryptoPayAmount || amount)}{' '}
                      {CRYPTO_ASSET_LABELS[cryptoAsset] || 'USDT'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 text-[14px]">
                    <span className="text-[#888]">Red</span>
                    <span className="font-medium">
                      {CRYPTO_NETWORK_LABELS[cryptoNetwork] || 'Polygon'}
                    </span>
                  </div>
                </>
              ) : (
                (paymentMethod === 'ars' || paymentMethod === 'usd') && (
                  <div className="flex justify-between py-3 text-[14px]">
                    <span className="text-[#888]">Monto transferido</span>
                    <span className="font-medium">
                      {paymentMethod === 'ars'
                        ? `ARS ${formatArs(totalArs)}`
                        : `USD ${formatUsd(totalUsd)}`}
                    </span>
                  </div>
                )
              )}
              {!isCard && !isCrypto && (
                <div className="flex justify-between py-3 text-[14px]">
                  <span className="text-[#888]">Canal de pago</span>
                  <span className="font-medium">{paymentChannel}</span>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            className="w-full flex items-center gap-3 p-4 rounded-2xl border border-[#EFEFEF] mb-8 text-left hover:bg-[#FAFAFA]"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#DC2626]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#1A1A1A]">Comprobante de inversión</p>
              <p className="text-[12px] text-[#888]">PDF · 2,4 MB</p>
            </div>
          </button>

          <div className="space-y-3">
            <button
              type="button"
              onClick={onGoToPortfolio || onClose}
              className="w-full py-3.5 rounded-full bg-[#1A1A1A] text-white text-[15px] font-semibold"
            >
              Ir a Mi Cartera
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 rounded-full border-2 border-[#E5E5E5] text-[#1A1A1A] text-[15px] font-semibold"
            >
              Volver al inicio
            </button>
          </div>
      </div>
    </FlowContainer>
  )
}

export function WaitingPaymentStep({
  variant = 'transfer',
  operationRef,
  cryptoAsset,
  cryptoNetwork,
  cryptoPayAmount,
  onClose,
  onGoToPortfolio,
  onSimulateError,
}) {
  const isCrypto = variant === 'crypto'
  const assetLabel = CRYPTO_ASSET_LABELS[cryptoAsset] || 'USDT'
  const networkLabel = CRYPTO_NETWORK_LABELS[cryptoNetwork] || 'Polygon'

  const steps = isCrypto
    ? [
        { label: 'Transferencia enviada', done: true },
        {
          label: 'Confirmando en blockchain',
          current: true,
          hint: 'Estamos verificando tu pago en la red. Puede demorar unos minutos.',
        },
        { label: 'Inversión activada', pending: true },
      ]
    : [
        { label: 'Transferencia realizada', done: true },
        {
          label: 'Validando acreditación bancaria',
          current: true,
          hint: 'Estamos verificando tu pago. Puede demorar hasta 24 hs.',
        },
        { label: 'Inversión activada', pending: true },
      ]

  const { isDesktop } = useFlowLayout()

  return (
    <FlowContainer>
      <div className={`flex-1 overflow-y-auto flex flex-col ${isDesktop ? 'px-8' : 'px-5'} pt-20 pb-8`}>
        <div className="flex-1">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-[#FEF3C7] flex items-center justify-center mx-auto mb-6 text-4xl">
              {isCrypto ? '⛓️' : '🔑'}
            </div>
            <h1 className="text-[24px] font-bold text-[#1A1A1A] mb-3">
              {isCrypto ? 'Esperando confirmación' : 'Esperando tu pago'}
            </h1>
            <p className="text-[15px] text-[#666] leading-relaxed max-w-[300px] mx-auto">
              {isCrypto
                ? `Registramos tu envío de ${formatCryptoAmount(cryptoPayAmount || 0)} ${assetLabel} por ${networkLabel}. Te avisamos cuando se acredite.`
                : 'Registramos tu transferencia. Te avisamos cuando acreditemos el pago y activemos tu inversión.'}
            </p>
          </div>

          <div className="text-left space-y-0 mb-8 px-1">
            {steps.map((s, i) => (
              <div key={s.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      s.done
                        ? 'bg-[#16A34A]'
                        : s.current
                          ? 'bg-[#DBEAFE] border-2 border-[#3B82F6]'
                          : 'border-2 border-[#E8E8E8] bg-white'
                    }`}
                  >
                    {s.done && (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                    {s.current && (
                      <svg className="w-4 h-4 text-[#3B82F6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 3" />
                      </svg>
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-0.5 h-12 ${s.done ? 'bg-[#16A34A]' : 'bg-[#E8E8E8]'}`} />
                  )}
                </div>
                <div className="pb-5 pt-0.5">
                  <p
                    className={`text-[14px] font-medium ${
                      s.current || s.done ? 'text-[#1A1A1A]' : 'text-[#AAA]'
                    }`}
                  >
                    {s.label}
                  </p>
                  {s.hint && <p className="text-[12px] text-[#888] mt-0.5 leading-relaxed">{s.hint}</p>}
                </div>
              </div>
            ))}
          </div>

          <OperationRefAccordion operationRef={operationRef} />
        </div>

        <div className="space-y-3 shrink-0">
          <button
            type="button"
            onClick={onGoToPortfolio || onClose}
            className="w-full py-3.5 rounded-full bg-[#1A1A1A] text-white text-[15px] font-semibold"
          >
            Ir a Mi Cartera
          </button>
          {onSimulateError && (
            <button
              type="button"
              onClick={onSimulateError}
              className="w-full text-[13px] text-[#AAA] underline"
            >
              {isCrypto
                ? 'Simular red incorrecta (ensayo)'
                : 'Simular pago no detectado (ensayo)'}
            </button>
          )}
        </div>
      </div>
    </FlowContainer>
  )
}

export function PaymentErrorStep({
  variant = 'transfer',
  opportunity,
  investAmount,
  totalUsd,
  operationRef,
  cryptoAsset,
  cryptoNetwork,
  cryptoPayAmount,
  onClose,
  onGoToPortfolio,
  onRetry,
}) {
  const isCard = variant === 'card'
  const isCryptoNetwork = variant === 'crypto-network'
  const amount = investAmount || totalUsd
  const assetLabel = CRYPTO_ASSET_LABELS[cryptoAsset] || 'USDT'
  const expectedNetwork = CRYPTO_NETWORK_LABELS[cryptoNetwork] || 'Polygon'

  const { isDesktop } = useFlowLayout()

  if (isCryptoNetwork) {
    return (
      <FlowContainer>
        <div className={`flex-1 overflow-y-auto flex flex-col ${isDesktop ? 'px-8' : 'px-5'} pt-16 pb-8`}>
          <div className="flex-1">
            <div className="w-20 h-20 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#DC2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
            </div>

            <h1 className="text-[24px] font-bold text-[#1A1A1A] text-center mb-3">
              Tu transferencia llegó por una red distinta
            </h1>
            <p className="text-[15px] text-[#666] text-center leading-relaxed mb-8 max-w-[320px] mx-auto">
              Detectamos tu pago, pero fue enviado por una red distinta a la seleccionada. Tu inversión no se completó.
            </p>

            <div className="rounded-2xl border border-[#EFEFEF] px-4 mb-4">
              <p className="text-[12px] font-semibold text-[#888] uppercase tracking-wide py-3 border-b border-[#F0F0F0]">
                ¿Qué pasó?
              </p>
              <div className="flex items-center justify-between py-3 border-b border-[#F0F0F0]">
                <span className="text-[14px] text-[#888]">Red seleccionada</span>
                <span className="flex items-center gap-2 text-[14px] font-medium text-[#16A34A]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {expectedNetwork}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-[14px] text-[#888]">Red por la que llegó</span>
                <span className="flex items-center gap-2 text-[14px] font-medium text-[#DC2626]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  Ethereum
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#EFEFEF] px-4 mb-6">
              <div className="flex justify-between py-3 text-[14px] border-b border-[#F0F0F0]">
                <span className="text-[#888]">Monto enviado</span>
                <span className="font-medium">
                  {formatCryptoAmount(cryptoPayAmount || amount)} {assetLabel}
                </span>
              </div>
              <div className="flex justify-between py-3 text-[14px] border-b border-[#F0F0F0]">
                <span className="text-[#888]">Hash de transacción</span>
                <span className="font-mono text-[11px] text-[#1A1A1A]">0x9f3a...b2c1</span>
              </div>
              <div className="flex justify-between items-center py-3 text-[14px]">
                <span className="text-[#888]">Estado</span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FEE2E2] text-[#DC2626]">
                  No procesada
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#FEF3C7] p-4 mb-6">
              <p className="text-[14px] text-[#92400E] leading-relaxed">
                Tu dinero no se perdió, pero requiere intervención manual de nuestro equipo para recuperarlo.
                Contactá a soporte dentro de las próximas 72 horas.
              </p>
            </div>

            <ol className="text-[13px] text-[#666] space-y-2 mb-8 list-decimal pl-5">
              <li>Contactá a soporte con el hash de la transacción</li>
              <li>Indicá la red por la que enviaste los fondos</li>
              <li>Te responderemos en un plazo de 72 horas hábiles</li>
            </ol>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="w-full py-3.5 rounded-full bg-[#1A1A1A] text-white text-[15px] font-semibold"
            >
              Contactar a Soporte
            </button>
            <button
              type="button"
              onClick={onGoToPortfolio || onClose}
              className="w-full py-3.5 rounded-full border-2 border-[#E5E5E5] text-[#1A1A1A] text-[15px] font-semibold"
            >
              Volver a Mi Cartera
            </button>
          </div>
        </div>
      </FlowContainer>
    )
  }

  if (isCard) {
    return (
      <FlowContainer className="overflow-hidden">
        <div className="bg-[#DC2626] text-white text-center py-2.5 px-4 text-[13px] font-medium">
          Error: Problemas técnicos de tarjeta
        </div>

        <div className={`flex-1 overflow-y-auto flex flex-col ${isDesktop ? 'px-8' : 'px-5'} pt-12 pb-8`}>
            <div className="w-20 h-20 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#DC2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>

            <h1 className="text-[24px] font-bold text-[#1A1A1A] text-center mb-3">
              El pago no se pudo procesar
            </h1>
            <p className="text-[15px] text-[#666] text-center leading-relaxed mb-6 max-w-[320px] mx-auto">
              Lo sentimos, la operación fue rechazada por tu entidad bancaria.
            </p>

            <div className="rounded-2xl bg-[#F8F8F8] p-4 mb-6">
              <p className="text-[13px] font-semibold text-[#1A1A1A] mb-2">Podés intentar:</p>
              <ul className="text-[13px] text-[#666] space-y-1.5 list-disc pl-4">
                <li>Usar otra tarjeta de crédito o débito</li>
                <li>Verificar el límite disponible en tu cuenta</li>
                <li>Contactar a tu banco para autorizar la operación</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#EFEFEF] px-4 mb-8">
              <div className="flex justify-between py-3 text-[14px] border-b border-[#F0F0F0]">
                <span className="text-[#888]">Proyecto</span>
                <span className="font-medium">{opportunity.title}</span>
              </div>
              <div className="flex justify-between py-3 text-[14px] border-b border-[#F0F0F0]">
                <span className="text-[#888]">Monto</span>
                <span className="font-medium">USD {formatUsd(amount)}</span>
              </div>
              <div className="flex justify-between items-center py-3 text-[14px]">
                <span className="text-[#888]">Estado</span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FEE2E2] text-[#DC2626]">
                  Rechazado
                </span>
              </div>
            </div>

            <div className="space-y-3 mt-auto">
              <button
                type="button"
                onClick={onRetry}
                className="w-full py-3.5 rounded-full bg-[#1A1A1A] text-white text-[15px] font-semibold"
              >
                Intentar con otro medio
              </button>
              <button
                type="button"
                onClick={onGoToPortfolio || onClose}
                className="w-full py-3.5 rounded-full border-2 border-[#E5E5E5] text-[#1A1A1A] text-[15px] font-semibold"
              >
                Volver a Mi Cartera
              </button>
            </div>
          </div>
      </FlowContainer>
    )
  }

  return (
    <FlowContainer>
      <div className={`flex-1 overflow-y-auto flex flex-col ${isDesktop ? 'px-8' : 'px-5'} pt-20 pb-8`}>
        <div className="flex-1">
          <div className="w-20 h-20 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#DC2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>

          <h1 className="text-[24px] font-bold text-[#1A1A1A] text-center mb-3">
            No detectamos tu pago
          </h1>
          <p className="text-[15px] text-[#666] text-center leading-relaxed mb-8 max-w-[320px] mx-auto">
            Pasaron 24 horas sin acreditación. Liberamos tu lugar en el proyecto — podés volver a intentar cuando quieras.
          </p>

          <div className="rounded-2xl border border-[#EFEFEF] px-4 mb-6">
            <div className="flex justify-between py-3 text-[14px] border-b border-[#F0F0F0]">
              <span className="text-[#888]">Proyecto</span>
              <span className="font-medium">{opportunity.title}</span>
            </div>
            <div className="flex justify-between py-3 text-[14px] border-b border-[#F0F0F0]">
              <span className="text-[#888]">Monto</span>
              <span className="font-medium">USD {formatUsd(amount)}</span>
            </div>
            <div className="flex justify-between py-3 text-[14px] border-b border-[#F0F0F0]">
              <span className="text-[#888]">Operación</span>
              <span className="font-mono text-[12px]">{operationRef}</span>
            </div>
            <div className="flex justify-between py-3 text-[14px]">
              <span className="text-[#888]">Estado</span>
              <span className="font-bold text-[#DC2626] tracking-wide">CANCELADA</span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#F8F8F8] p-4 mb-8 text-center">
            <p className="text-[14px] font-medium text-[#1A1A1A] mb-3">¿Ya realizaste el pago?</p>
            <button
              type="button"
              className="px-5 py-2.5 rounded-full border-2 border-[#1A1A1A] text-[14px] font-semibold"
            >
              Contactar a soporte
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onRetry}
            className="w-full py-3.5 rounded-full bg-[#1A1A1A] text-white text-[15px] font-semibold"
          >
            Volver a invertir en este proyecto
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-full border-2 border-[#E5E5E5] text-[#1A1A1A] text-[15px] font-semibold"
          >
            Explorar otras oportunidades
          </button>
        </div>
      </div>
    </FlowContainer>
  )
}

export function getFirstReturnDate() {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  d.setDate(15)
  return formatDateEs(d)
}
