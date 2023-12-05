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
    typeList.includes(value)
      ? setTypeList((types) => {
          return types.filter((list) => list !== value)
        })
      : setTypeList((types) => {
          return [...types, value]
        })
  }

  return [typeList, changeSelectTypeList]
}
