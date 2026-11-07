import { useMemo, useState } from 'react'
import InvestmentFlow from '../../InvestmentFlow'
import { useOpportunityDetail } from '../../hooks/useOpportunityDetail'

function toFlowAmount(formatted) {
  return formatted.replace(/\./g, '').replace(',', '.')
}
import DesktopManagerModal from './DesktopManagerModal'
import DesktopParticipantsModal from './DesktopParticipantsModal'

const RISKS = [
  'El retorno es estimado y puede variar según las condiciones del mercado y la operatoria del proyecto.',
  'La inversión tiene un plazo de permanencia; la salida anticipada está sujeta a condiciones.',
  'El valor del activo puede fluctuar y no existe garantía de recuperación del capital.',
  'La documentación legal y los plazos de fondeo pueden modificarse según normativa vigente.',
]

const DOCUMENTS = [
  { title: 'Prospecto de inversión', meta: 'Formato PDF (2.4 MB)' },
  { title: 'Contrato de participación', meta: 'Formato PDF (1.1 MB)' },
  { title: 'Planos y memoria técnica', meta: 'Formato PDF (8.7 MB)' },
]

const DEFAULT_PARTICIPANTS = [
  { name: 'AZ Buildings S.A.', role: 'Desarrollador y gestor', verified: true, initials: 'AZ' },
  { name: 'Estudio Jurídico López & Asoc.', role: 'Asesor legal', verified: true, initials: 'L&A' },
  { name: 'Banco Industrial S.A.', role: 'Fiduciario', verified: true, initials: 'BI' },
  { name: 'Perito García & Cía.', role: 'Tasación y control', verified: true, initials: 'PG' },
]

const DEFAULT_TECHNICAL = [
  { label: 'Superficie construida', value: '4.200 m²' },
  { label: 'Unidades', value: '48 departamentos' },
  { label: 'Tipologías', value: '1, 2 y 3 ambientes' },
  { label: 'Entrega estimada', value: 'Q4 2027' },
]

function formatUsd(value) {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function parseMinAmount(minInvestment) {
  const digits = minInvestment.replace(/[^\d]/g, '')
  return Number(digits) || 10000
}

function formatAmountInput(value) {
  const digits = value.replace(/[^\d]/g, '')
  if (!digits) return ''
  return Number(digits).toLocaleString('es-AR')
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-[11px] font-semibold tracking-[0.08em] text-[#999] uppercase mb-4">
      {children}
    </h2>
  )
}

function PdfIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] flex items-center justify-center shrink-0">
      <svg className="w-5 h-5 text-[#DC2626]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 13h2v5H8v-5zm3 0h2v5h-2v-5zm3 0h2v5h-2v-5z" />
      </svg>
    </div>
  )
}

function ChevronRight() {
  return (
    <svg className="w-5 h-5 text-[#999] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

export default function DesktopOpportunityDetailPage({ opportunity: initialOpportunity, onGoToPortfolio }) {
  const { opportunity: fetched, loading } = useOpportunityDetail(initialOpportunity?.id)
  const opportunity = fetched || initialOpportunity
  const [showManager, setShowManager] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [showInvestFlow, setShowInvestFlow] = useState(false)
  const [aboutExpanded, setAboutExpanded] = useState(false)

  const minAmount = useMemo(
    () => parseMinAmount(opportunity?.minInvestment || 'USD 10.000'),
    [opportunity?.minInvestment],
  )

  const [investAmount, setInvestAmount] = useState(() => formatAmountInput(String(minAmount)))

  if (!opportunity) return null

  if (loading && !fetched) {
    return (
      <main className="max-w-[1200px] mx-auto px-8 py-16 text-center text-[15px] text-[#888]">
        Cargando proyecto…
      </main>
    )
  }

  if (showInvestFlow) {
    return (
      <InvestmentFlow
        layout="desktop"
        opportunity={opportunity}
        initialAmount={toFlowAmount(investAmount)}
        initialStep={2}
        onClose={() => setShowInvestFlow(false)}
        onGoToPortfolio={onGoToPortfolio}
      />
    )
  }

  const {
    title,
    image,
    typeLabel,
    location,
    tnaValue,
    risk,
    term,
    funded,
    fundedCurrent,
    fundedTotal,
    minInvestment,
    about,
    aboutExtended,
    manager,
    technicalDetails,
    participants,
  } = opportunity

  const technical = technicalDetails || DEFAULT_TECHNICAL
  const projectParticipants = participants || DEFAULT_PARTICIPANTS
  const extendedAbout = aboutExtended || `${about} El proyecto cuenta con estructura fiduciaria, seguros de obra y contratos de alquiler pre-acordados para las primeras 24 unidades. La operatoria está a cargo de un equipo con más de 15 años de experiencia en desarrollos residenciales de categoría en CABA.`

  const numericInvest = Number(investAmount.replace(/[^\d]/g, '')) || 0
  const canInvest = numericInvest >= minAmount && numericInvest <= (opportunity.maxAmount || 100000)

  const handleAmountChange = (e) => {
    setInvestAmount(formatAmountInput(e.target.value))
  }

  return (
    <div className="bg-[#FAFAFA] min-h-[calc(100vh-72px)]">
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-12 items-start">
          <main className="min-w-0">
            <div className="rounded-2xl overflow-hidden mb-8 aspect-[16/9] bg-[#E8E8E8]">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>

            <p className="text-[12px] font-medium tracking-[0.06em] text-[#999] uppercase mb-2">
              {typeLabel}
            </p>
            <h1 className="text-[40px] font-bold text-[#1A1A1A] leading-[1.1] mb-3 tracking-tight">
              {title}
            </h1>
            <div className="flex items-center gap-2 text-[#666] text-[15px] mb-8">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z" />
                <circle cx="12" cy="11" r="2.5" />
              </svg>
              {location}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="bg-white rounded-2xl px-5 py-5 border border-[#EFEFEF]">
                <p className="text-[28px] font-bold text-[#1A1A1A] leading-none mb-1.5">{tnaValue}</p>
                <p className="text-[13px] text-[#888]">TNA estimada</p>
              </div>
              <div className="bg-white rounded-2xl px-5 py-5 border border-[#EFEFEF]">
                <p className="text-[28px] font-bold text-[#1A1A1A] leading-none mb-1.5">{risk}</p>
                <p className="text-[13px] text-[#888]">Riesgo</p>
              </div>
              <div className="bg-white rounded-2xl px-5 py-5 border border-[#EFEFEF]">
                <p className="text-[28px] font-bold text-[#1A1A1A] leading-none mb-1.5">{term}</p>
                <p className="text-[13px] text-[#888]">Plazo</p>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex items-baseline justify-between mb-3">
                <p className="text-[15px] font-semibold text-[#1A1A1A]">Fondeo del proyecto</p>
                <p className="text-[14px] text-[#888]">
                  <span className="font-semibold text-[#1A1A1A]">USD {fundedCurrent}</span>
                  {' '}de USD {fundedTotal}
                </p>
              </div>
              <div className="relative h-10 rounded-full bg-[#E8E8E8] overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#4ADE80] via-[#86EFAC] to-[#A3E635] flex items-center justify-center transition-all duration-500"
                  style={{ width: `${Math.max(funded, 12)}%` }}
                >
                  <span className="text-[13px] font-semibold text-[#1A1A1A] whitespace-nowrap px-3">
                    {funded}% fondeado
                  </span>
                </div>
              </div>
            </div>

            <section className="mb-12 pb-12 border-b border-[#EFEFEF]">
              <SectionTitle>Sobre el proyecto</SectionTitle>
              <p className="text-[16px] text-[#444] leading-[1.75]">
                {aboutExpanded ? extendedAbout : about}
              </p>
              <button
                type="button"
                onClick={() => setAboutExpanded((v) => !v)}
                className="mt-4 text-[14px] font-semibold text-[#1A1A1A] hover:underline underline-offset-2"
              >
                {aboutExpanded ? 'Ver menos' : 'Ver más →'}
              </button>
            </section>

            <section className="mb-12 pb-12 border-b border-[#EFEFEF]">
              <SectionTitle>Desarrollado por</SectionTitle>
              <button
                type="button"
                onClick={() => setShowManager(true)}
                className="w-full flex items-center gap-4 p-5 rounded-2xl border border-[#E8E8E8] bg-white text-left hover:border-[#CCC] hover:shadow-sm transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-[#1A1A1A] flex items-center justify-center shrink-0">
                  <span className="text-white text-[11px] font-bold tracking-wider">{manager.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[17px] font-semibold text-[#1A1A1A]">{manager.name}</p>
                  <p className="text-[14px] text-[#888] mt-0.5">{manager.role}</p>
                  <p className="text-[13px] text-[#AAA] mt-1">{manager.stats}</p>
                </div>
                <span className="text-[14px] font-semibold text-[#1A1A1A] shrink-0">Ver más</span>
              </button>
            </section>

            <section className="mb-12 pb-12 border-b border-[#EFEFEF]">
              <SectionTitle>Detalles técnicos</SectionTitle>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {technical.map((item) => (
                  <div key={item.label} className="flex justify-between gap-4 py-3 border-b border-[#F0F0F0]">
                    <span className="text-[14px] text-[#888]">{item.label}</span>
                    <span className="text-[14px] font-medium text-[#1A1A1A] text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12 pb-12 border-b border-[#EFEFEF]">
              <SectionTitle>Participantes</SectionTitle>
              <button
                type="button"
                onClick={() => setShowParticipants(true)}
                className="w-full flex items-center justify-between p-5 rounded-2xl border border-[#E8E8E8] bg-white text-left hover:border-[#CCC] hover:shadow-sm transition-all"
              >
                <div>
                  <p className="text-[16px] font-semibold text-[#1A1A1A]">
                    {projectParticipants.length} participantes
                  </p>
                  <p className="text-[14px] text-[#888] mt-0.5">
                    Desarrollador, fiduciario, asesores legales y más
                  </p>
                </div>
                <ChevronRight />
              </button>
            </section>

            <section className="mb-12 pb-12 border-b border-[#EFEFEF]">
              <SectionTitle>Riesgos a considerar</SectionTitle>
              <ul className="space-y-4 mb-4">
                {RISKS.map((riskItem, i) => (
                  <li key={i} className="flex gap-3 text-[15px] text-[#555] leading-relaxed">
                    <span className="w-5 h-5 rounded-full border-2 border-[#CCC] shrink-0 mt-0.5" />
                    {riskItem}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="text-[14px] font-semibold text-[#1A1A1A] underline underline-offset-2"
              >
                ¿Cómo funciona la salida anticipada?
              </button>
            </section>

            <section className="mb-8">
              <SectionTitle>Documentación</SectionTitle>
              <div className="space-y-1">
                {DOCUMENTS.map((doc) => (
                  <button
                    key={doc.title}
                    type="button"
                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white border border-transparent hover:border-[#EFEFEF] text-left transition-all"
                  >
                    <PdfIcon />
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-medium text-[#1A1A1A]">{doc.title}</p>
                      <p className="text-[13px] text-[#888]">{doc.meta}</p>
                    </div>
                    <ChevronRight />
                  </button>
                ))}
              </div>
            </section>
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-[88px]">
              <div className="bg-[#1A1A1A] rounded-2xl p-6 shadow-xl shadow-black/15">
                <p className="text-[13px] text-white/60 mb-1">Monto a invertir</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[18px] font-medium text-white/70">USD</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={investAmount}
                    onChange={handleAmountChange}
                    className="flex-1 bg-transparent text-[36px] font-bold text-white leading-none outline-none w-full min-w-0"
                    aria-label="Monto a invertir en USD"
                  />
                </div>
                <p className="text-[12px] text-white/50 mb-6">
                  Mínimo {minInvestment}
                </p>

                <button
                  type="button"
                  onClick={() => canInvest && setShowInvestFlow(true)}
                  disabled={!canInvest}
                  className={`w-full py-4 rounded-full text-[16px] font-semibold transition-colors ${
                    canInvest
                      ? 'bg-white text-[#1A1A1A] hover:bg-[#F0F0F0]'
                      : 'bg-white/30 text-white/50 cursor-not-allowed'
                  }`}
                >
                  Invertir
                </button>

                <div className="mt-5 pt-5 border-t border-white/10 space-y-2">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-white/50">Comisión estimada (0,5%)</span>
                    <span className="text-white/80">
                      USD {formatUsd(Math.round(numericInvest * 0.005))}
                    </span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-white/50">Total a pagar</span>
                    <span className="text-white font-semibold">
                      USD {formatUsd(Math.round(numericInvest * 1.005))}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[12px] text-[#AAA] text-center mt-4 px-2 leading-relaxed">
                Al invertir aceptás los términos del prospecto y el contrato de participación.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[390px] z-10">
        <div className="flex items-center justify-between bg-[#1A1A1A] rounded-full px-5 py-3.5 shadow-xl shadow-black/25">
          <div>
            <p className="text-[11px] text-white/60">Desde</p>
            <p className="text-[18px] font-bold text-white leading-tight">{minInvestment}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowInvestFlow(true)}
            className="flex items-center gap-2 text-white text-[15px] font-semibold"
          >
            Invertir
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <DesktopManagerModal
        manager={manager}
        open={showManager}
        onClose={() => setShowManager(false)}
      />
      <DesktopParticipantsModal
        participants={projectParticipants}
        open={showParticipants}
        onClose={() => setShowParticipants(false)}
      />
    </div>
  )
}
