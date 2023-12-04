import React from 'react'

type ChangeSelectTypeList = (value: string) => void
type UseCheckSeletTypeListField = (
  selectedType: Array<string>
) => [Array<string>, ChangeSelectTypeList]

/**
 *
 * @param selectedType
 * @returns
 */
export const useCheckSelectTypeListField: UseCheckSeletTypeListField = (
  selectedType
) => {
  const [typeList, setTypeList] = React.useState<Array<string>>(selectedType)

  const changeSelectTypeList = (value: string) => {
    if (typeList.indexOf(value) === -1) {
      setTypeList((types) => {
        return [...types, value]
      })
    } else {
      const index = typeList.indexOf(value)
      const cut = [...typeList]
      cut.splice(index, 1)
      setTypeList(() => {
        return [...cut]
      })
    }
  }

  return [typeList, changeSelectTypeList]
}
