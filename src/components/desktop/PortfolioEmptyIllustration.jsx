export default function PortfolioEmptyIllustration() {
  return (
    <div className="relative w-64 h-48 mx-auto mb-8">
      <div
        className="absolute inset-x-4 bottom-0 h-20 rounded-full opacity-50 blur-2xl"
        style={{ background: 'linear-gradient(180deg, #DBEAFE 0%, transparent 100%)' }}
      />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-44 h-20 bg-white rounded-xl shadow-lg border border-[#E8E8E8]" />
      <div className="absolute bottom-16 left-[42%] w-10 h-16 bg-[#E5E5E5] rounded-t-md border border-[#DDD]" />
      <div className="absolute bottom-16 left-[52%] w-8 h-12 bg-[#CCC] rounded-t-md border border-[#DDD]" />
      <div className="absolute bottom-14 left-[58%] w-6 h-9 bg-[#D4D4D4] rounded-t-sm" />
      <div className="absolute bottom-20 left-[38%] w-5 h-8 bg-[#EBEBEB] rounded-t-sm border border-[#E0E0E0]" />
    </div>
  )
}
