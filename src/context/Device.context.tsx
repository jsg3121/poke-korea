import { ReactNode, createContext, useContext } from 'react'
import { detectUserAgent } from '~/module/device.module'

export interface IFDeviceProviderProps {
  userAgent: string
  children: ReactNode
}

interface IFDeviceProps {
  isMobile: boolean
}

const DeviceContext = createContext<IFDeviceProps>({
  isMobile: true,
})

const DeviceProvider = ({ children, userAgent }: IFDeviceProviderProps) => {
  const isMobile = detectUserAgent(userAgent)

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
