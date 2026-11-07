import { createContext, useContext, useMemo } from 'react'

const FlowLayoutContext = createContext({ layout: 'mobile' })

export function FlowLayoutProvider({ layout = 'mobile', children }) {
  const value = useMemo(
    () => ({
      layout,
      isDesktop: layout === 'desktop',
      maxWidth: layout === 'desktop' ? 'max-w-[560px]' : 'max-w-[430px]',
    }),
    [layout],
  )

  return <FlowLayoutContext.Provider value={value}>{children}</FlowLayoutContext.Provider>
}

export function useFlowLayout() {
  return useContext(FlowLayoutContext)
}

export function FlowContainer({ children, className = '' }) {
  const { isDesktop, maxWidth } = useFlowLayout()

  if (isDesktop) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[#F5F5F5] flex justify-center items-start py-10 px-6">
        <div
          className={`w-full ${maxWidth} bg-white rounded-2xl shadow-xl border border-[#EFEFEF] overflow-hidden flex flex-col max-h-[calc(100vh-112px)] ${className}`}
        >
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className={`w-full ${maxWidth} min-h-screen flex flex-col ${className}`}>{children}</div>
    </div>
  )
}

export function FlowFinaleContainer({ children, className = '' }) {
  const { isDesktop, maxWidth } = useFlowLayout()

  if (isDesktop) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[#F5F5F5] flex justify-center items-start py-10 px-6">
        <div
          className={`w-full ${maxWidth} bg-white rounded-2xl shadow-xl border border-[#EFEFEF] overflow-hidden min-h-[520px] ${className}`}
        >
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-white flex justify-center relative overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

export function FlowFinaleInner({ children, className = '' }) {
  const { isDesktop, maxWidth } = useFlowLayout()

  if (isDesktop) {
    return (
      <div className={`w-full flex flex-col min-h-[520px] ${className}`}>
        {children}
      </div>
    )
  }

  return (
    <div className={`w-full ${maxWidth} min-h-screen flex flex-col ${className}`}>
      {children}
    </div>
  )
}

export function FlowContent({ children, className = '' }) {
  const { isDesktop } = useFlowLayout()
  return (
    <div className={`flex-1 overflow-y-auto ${isDesktop ? 'px-8' : 'px-5'} ${className}`}>
      {children}
    </div>
  )
}

export function FlowStickyFooter({ children }) {
  const { isDesktop, maxWidth } = useFlowLayout()

  if (isDesktop) {
    return (
      <div className="shrink-0 px-8 pb-8 pt-4 bg-white border-t border-[#F0F0F0]">
        {children}
      </div>
    )
  }

  return (
    <div
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full ${maxWidth} px-5 pb-8 pt-4 bg-white border-t border-[#F0F0F0]`}
    >
      {children}
    </div>
  )
}
