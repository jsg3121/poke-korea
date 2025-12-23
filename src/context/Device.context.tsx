'use client'
import { ReactNode, createContext, useContext } from 'react'

export interface IFDeviceProviderProps {
  children: ReactNode
  isMobile: boolean
}

interface IFDeviceProps {
  isMobile: boolean
}

const DeviceContext = createContext<IFDeviceProps>({
  isMobile: true,
})

const DeviceProvider = ({ children, isMobile }: IFDeviceProviderProps) => {
  const initialValue: IFDeviceProps = {
    isMobile,
  }

  return (
    <DeviceContext.Provider value={initialValue}>
      {children}
    </DeviceContext.Provider>
  )
}

const useDevice = (): IFDeviceProps => {
  const context = useContext(DeviceContext)

  return context
}

export { DeviceProvider, useDevice }
