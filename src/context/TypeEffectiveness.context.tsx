import { ReactNode, createContext, useState } from 'react'
import { PokemonType } from '~/graphql/typeGenerated'

export interface IFTypeEffectivenessProviderProps {
  children: ReactNode
}

interface IFTypeEffectivenessProps {
  selectTypeList: Array<PokemonType>
  isMaxSelectType: boolean
  handleChangeTypes: (selectType: PokemonType) => void
  handleResetSelectTypes: () => void
}

const TypeEffectivenessContext = createContext<IFTypeEffectivenessProps>({
  selectTypeList: [],
  isMaxSelectType: false,
  handleChangeTypes: () => null,
  handleResetSelectTypes: () => null,
})

const TypeEffectivenessProvider = ({
  children,
}: IFTypeEffectivenessProviderProps) => {
  const [selectTypeList, setSelectTypeList] = useState<Array<PokemonType>>([])

  const handleChangeTypes = (selectType: PokemonType) => {
    setSelectTypeList((prev) => {
      if (prev.includes(selectType)) {
        return prev.filter((type) => type !== selectType)
      } else {
        return [...prev, selectType]
      }
    })
  }

  const handleResetSelectTypes = () => {
    setSelectTypeList([])
  }

  const isMaxSelectType = selectTypeList.length === 2

  const initialValue: IFTypeEffectivenessProps = {
    isMaxSelectType,
    selectTypeList,
    handleChangeTypes,
    handleResetSelectTypes,
  }

  return (
    <TypeEffectivenessContext.Provider value={initialValue}>
      {children}
    </TypeEffectivenessContext.Provider>
  )
}

export { TypeEffectivenessContext, TypeEffectivenessProvider }
