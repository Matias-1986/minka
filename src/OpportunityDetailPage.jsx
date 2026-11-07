import { useState } from 'react'
import InvestmentFlow from './InvestmentFlow'
import { useOpportunityDetail } from './hooks/useOpportunityDetail'
import ManagerProfileSheet from './ManagerProfileSheet'

const RISKS = [
  'El retorno es estimado y puede variar según las condiciones del mercado y la operatoria del proyecto.',
  'La inversión tiene un plazo de permanencia; la salida anticipada está sujeta a condiciones.',
  'El valor del activo puede fluctuar y no existe garantía de recuperación del capital.',
  'La documentación legal y los plazos de fondeo pueden modificarse según normativa vigente.',
]

const DOCUMENTS = [
  { title: 'Prospecto de inversión', meta: 'Formato PDF (2.4 MB)' },
  { title: 'Contrato de participación', meta: 'Formato PDF (1.1 MB)' },
]

function ChevronRight() {
  return (
    <svg className="w-5 h-5 text-[#999] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
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

function SectionTitle({ children }) {
  return (
    <h2 className="text-[11px] font-semibold tracking-[0.08em] text-[#999] uppercase mb-3">
      {children}
    </h2>
  )
}

export default function OpportunityDetailPage({ opportunity: initialOpportunity, onBack, onGoToPortfolio }) {
  const { opportunity: fetched, loading } = useOpportunityDetail(initialOpportunity?.id)
  const opportunity = fetched || initialOpportunity
  const [showManager, setShowManager] = useState(false)
  const [showInvestFlow, setShowInvestFlow] = useState(false)

  if (!opportunity) return null

  if (loading && !fetched) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-[14px] text-[#888]">Cargando proyecto…</p>
      </div>
    )
  }

  if (showInvestFlow) {
    return (
      <InvestmentFlow
        opportunity={opportunity}
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
    manager,
  } = opportunity

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-white relative pb-28">
        <div className="relative h-[280px]">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onBack}
            className="absolute top-12 left-5 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md"
            aria-label="Volver"
          >
            <svg className="w-5 h-5 text-[#1A1A1A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        <div className="px-5 pt-5">
          <p className="text-[11px] font-medium tracking-[0.06em] text-[#999] uppercase mb-2">
            {typeLabel}
          </p>
          <h1 className="text-[28px] font-bold text-[#1A1A1A] leading-tight mb-2">{title}</h1>
          <div className="flex items-center gap-1.5 text-[#666] text-[14px] mb-6">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z" />
              <circle cx="12" cy="11" r="2.5" />
            </svg>
            {location}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-[#F5F5F5] rounded-2xl px-4 py-4">
              <p className="text-[22px] font-bold text-[#1A1A1A] leading-none mb-1">{tnaValue}</p>
              <p className="text-[13px] text-[#888]">TNA estimada</p>
            </div>
            <div className="bg-[#F5F5F5] rounded-2xl px-4 py-4">
              <p className="text-[22px] font-bold text-[#1A1A1A] leading-none mb-1">{risk}</p>
              <p className="text-[13px] text-[#888]">Riesgo</p>
            </div>
          </div>
          <div className="bg-[#F5F5F5] rounded-2xl px-4 py-4 mb-6 w-[calc(50%-6px)]">
            <p className="text-[22px] font-bold text-[#1A1A1A] leading-none mb-1">{term}</p>
            <p className="text-[13px] text-[#888]">Plazo estimado</p>
          </div>

          <div className="mb-8">
            <p className="text-[14px] font-medium text-[#1A1A1A] mb-2">Fondeo</p>
            <p className="mb-3">
              <span className="text-[18px] font-bold text-[#1A1A1A]">USD {fundedCurrent}</span>
              <span className="text-[14px] text-[#888]"> de USD {fundedTotal}</span>
            </p>
            <div className="relative h-8 rounded-full bg-[#E8E8E8] overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#4ADE80] via-[#A3E635] to-[#FACC15] flex items-center justify-center"
                style={{ width: `${funded}%` }}
              >
                <span className="text-[12px] font-semibold text-[#1A1A1A] whitespace-nowrap px-2">
                  {funded}% completado
                </span>
              </div>
            </div>
          </div>

          <section className="mb-8 pb-8 border-b border-[#EFEFEF]">
            <SectionTitle>Sobre el proyecto</SectionTitle>
            <p className="text-[15px] text-[#444] leading-relaxed">{about}</p>
            <button type="button" className="mt-3 text-[14px] font-semibold text-[#1A1A1A]">
              Ver más &gt;
            </button>
          </section>

          <section className="mb-8 pb-8 border-b border-[#EFEFEF]">
            <SectionTitle>Quién gestiona</SectionTitle>
            <button
              type="button"
              onClick={() => setShowManager(true)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[#E8E8E8] bg-white text-left hover:bg-[#FAFAFA] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] flex items-center justify-center shrink-0">
                <span className="text-white text-[10px] font-bold tracking-wider">{manager.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#1A1A1A]">{manager.name}</p>
                <p className="text-[13px] text-[#888]">{manager.role}</p>
                <p className="text-[13px] text-[#888]">{manager.stats}</p>
              </div>
              <ChevronRight />
            </button>
          </section>

          <section className="mb-8 pb-8 border-b border-[#EFEFEF]">
            <SectionTitle>Riesgos a considerar</SectionTitle>
            <ul className="space-y-3 mb-4">
              {RISKS.map((riskItem, i) => (
                <li key={i} className="flex gap-3 text-[14px] text-[#555] leading-relaxed">
                  <span className="w-5 h-5 rounded-full border-2 border-[#CCC] shrink-0 mt-0.5" />
                  {riskItem}
                </li>
              ))}
            </ul>
            <button type="button" className="text-[14px] font-semibold text-[#1A1A1A] underline underline-offset-2">
              ¿Cómo funciona la salida anticipada?
            </button>
          </section>

          <section className="mb-6">
            <SectionTitle>Documentación</SectionTitle>
            <div className="space-y-2">
              {DOCUMENTS.map((doc) => (
                <button
                  key={doc.title}
                  type="button"
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#FAFAFA] text-left transition-colors"
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
        </div>

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[390px] z-10">
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
              Invertí ahora
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>

        {showManager && (
          <ManagerProfileSheet
            manager={manager}
            onClose={() => setShowManager(false)}
          />
        )}
      </div>
    </div>
  )
}
