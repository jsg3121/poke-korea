import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type PortalProps = {
  /** 렌더링할 DOM 컨테이너의 id */
  id: string
  /** 포털로 렌더링할 자식 요소 */
  children: ReactNode
}

export const Portal = ({ id, children }: PortalProps) => {
  const portalElement = useRef<HTMLDivElement | null>(null)
  const [mount, setMount] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      portalElement.current = document.createElement('div')
      portalElement.current.id = id
      document.body.appendChild(portalElement.current)
      setMount(true)
    }

    return () => {
      if (!portalElement.current || !portalElement.current.parentElement) return
      portalElement.current.parentElement.removeChild(portalElement.current)
      setMount(false)
    }
  }, [id])

  return mount && portalElement.current
    ? createPortal(children, portalElement.current)
    : null
}
