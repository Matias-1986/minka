import { useEffect, useState } from 'react'

export const MOBILE_MEDIA_QUERY = '(max-width: 767px)'

function getViewOverride() {
  if (typeof window === 'undefined') return null
  const view = new URLSearchParams(window.location.search).get('view')
  if (view === 'mobile' || view === 'desktop') return view
  return null
}

function matchesMobileViewport() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(MOBILE_MEDIA_QUERY).matches
}

function resolveIsMobile() {
  const override = getViewOverride()
  if (override === 'mobile') return true
  if (override === 'desktop') return false
  return matchesMobileViewport()
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(resolveIsMobile)

  useEffect(() => {
    const update = () => setIsMobile(resolveIsMobile())

    const media = window.matchMedia(MOBILE_MEDIA_QUERY)
    media.addEventListener('change', update)
    window.addEventListener('popstate', update)

    return () => {
      media.removeEventListener('change', update)
      window.removeEventListener('popstate', update)
    }
  }, [])

  return isMobile
}
