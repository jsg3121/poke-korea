'use client'

import { createContext, ReactNode, useContext } from 'react'

export interface DeviceProviderProps {
  children: ReactNode
  isMobile: boolean
}

interface DeviceContextValue {
  isMobile: boolean
}

const DeviceContext = createContext<DeviceContextValue>({
  isMobile: true,
})

const DeviceProvider = ({ children, isMobile }: DeviceProviderProps) => {
  const initialValue: DeviceContextValue = {
    isMobile,
  }

  return (
    <DeviceContext.Provider value={initialValue}>
      {children}
    </DeviceContext.Provider>
  )
}

const useDevice = (): DeviceContextValue => {
  const context = useContext(DeviceContext)

  return context
}

export { DeviceProvider, useDevice }
