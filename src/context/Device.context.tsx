'use client'
import { ReactNode, createContext, useContext } from 'react'

export interface IFDeviceProviderProps {
  children: ReactNode
}

interface IFDeviceProps {}

const DeviceContext = createContext<IFDeviceProps>({})

const DeviceProvider = ({ children }: IFDeviceProviderProps) => {
  const initialValue: IFDeviceProps = {}

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
