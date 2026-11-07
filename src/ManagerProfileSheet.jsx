function SectionTitle({ children }) {
  return (
    <h3 className="text-[11px] font-semibold tracking-[0.08em] text-[#999] uppercase mb-3">
      {children}
    </h3>
  )
}

function KeyRow({ label, value, valueClassName = '' }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#F0F0F0] last:border-0">
      <span className="text-[14px] text-[#888]">{label}</span>
      <span className={`text-[14px] font-medium text-[#1A1A1A] ${valueClassName}`}>{value}</span>
    </div>
  )
}

function StatusBadge({ status, type }) {
  const styles =
    type === 'active'
      ? 'bg-[#E8F0FE] text-[#1A56DB]'
      : 'bg-[#E6F7ED] text-[#1B7F3A]'

  return (
    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${styles}`}>
      {status}
    </span>
  )
}

export default function ManagerProfileSheet({ manager, onClose }) {
  if (!manager) return null

  const {
    initials,
    name,
    subtitle,
    foundedYear,
    about,
    hasPlatformHistory,
    cuit,
    yearsOperating,
    deliveredProjects,
    documentationStatus,
    platformStats,
    otherProjects = [],
  } = manager

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Cerrar perfil del gestor"
      />

      <div className="relative w-full max-w-[430px] max-h-[92vh] bg-white rounded-t-[28px] shadow-2xl flex flex-col animate-slide-up">
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#E0E0E0]" />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-5 w-8 h-8 flex items-center justify-center text-[#999]"
          aria-label="Cerrar"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto px-5 pt-2 pb-4">
          <div className="flex items-start gap-4 mb-4 pr-8">
            <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] flex items-center justify-center shrink-0">
              <span className="text-white text-[11px] font-bold tracking-wider">{initials}</span>
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#1A1A1A] leading-tight">{name}</h2>
              <p className="text-[14px] text-[#888] mt-0.5">{subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#1A1A1A] bg-[#F5F5F5] px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
              Verificado por MINCA
            </span>
            <span className="text-[12px] font-medium text-[#666] bg-[#F5F5F5] px-3 py-1.5 rounded-full">
              Fundada en {foundedYear}
            </span>
          </div>

          {hasPlatformHistory && platformStats && (
            <>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <p className="text-[22px] font-bold text-[#1A1A1A]">{platformStats.funded}</p>
                  <p className="text-[11px] text-[#888] leading-tight">Proyectos financiados</p>
                </div>
                <div className="text-center">
                  <p className="text-[22px] font-bold text-[#1A1A1A]">{platformStats.closedWithoutIssues}</p>
                  <p className="text-[11px] text-[#888] leading-tight">Cerrados sin incidentes</p>
                </div>
                <div className="text-center">
                  <p className="text-[22px] font-bold text-[#1A1A1A]">{platformStats.paymentsOnTime}</p>
                  <p className="text-[11px] text-[#888] leading-tight">Pagos al día</p>
                </div>
              </div>
              <p className="text-[12px] text-[#AAA] mb-6">
                Datos verificados al {platformStats.verifiedAt}
              </p>
            </>
          )}

          <section className="mb-6">
            <SectionTitle>Sobre el gestor</SectionTitle>
            <p className="text-[15px] text-[#444] leading-relaxed">{about}</p>
          </section>

          {!hasPlatformHistory && (
            <section className="mb-6">
              <SectionTitle>Datos clave</SectionTitle>
              <div className="rounded-2xl border border-[#EFEFEF] px-4">
                <KeyRow label="CUIT" value={cuit} />
                <KeyRow label="Años de operación" value={`${yearsOperating} años`} />
                <KeyRow label="Proyectos entregados" value={String(deliveredProjects)} />
                <KeyRow
                  label="Documentación"
                  value={documentationStatus}
                  valueClassName="text-[#1B7F3A] font-semibold"
                />
              </div>
            </section>
          )}

          {hasPlatformHistory && otherProjects.length > 0 && (
            <section className="mb-4">
              <SectionTitle>Otros proyectos en Minca</SectionTitle>
              <div className="space-y-3">
                {otherProjects.map((project) => (
                  <div
                    key={project.title}
                    className="flex items-center gap-3 p-2 rounded-2xl border border-[#EFEFEF]"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#1A1A1A] truncate">{project.title}</p>
                      <p className="text-[12px] text-[#888]">{project.meta}</p>
                    </div>
                    <StatusBadge status={project.status} type={project.statusType} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="shrink-0 px-5 pb-8 pt-2 border-t border-[#F0F0F0] bg-white rounded-b-none">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-full border-2 border-[#1A1A1A] text-[15px] font-semibold text-[#1A1A1A]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
