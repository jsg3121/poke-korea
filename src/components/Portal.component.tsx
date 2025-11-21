'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: ReactNode
  containerId?: string
}

const Portal = ({ children, containerId = 'portal-root' }: PortalProps) => {
  const [mounted, setMounted] = useState(false)
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setMounted(true)

    let element = document.getElementById(containerId)

    if (!element) {
      element = document.createElement('div')
      element.id = containerId
      document.body.appendChild(element)
    }

    setPortalElement(element)

    return () => {
      // Portal 요소가 비어있으면 제거
      if (element && element.childNodes.length === 0) {
        element.remove()
      }
    }
  }, [containerId])

  if (!mounted || !portalElement) {
    return null
  }

  return createPortal(children, portalElement)
}

export default Portal
