import React from 'react'

type OnChangeTypeListType = (type: string) => void

type UseSetTypeFieldListType = (
  filterTypes: Array<string>
) => [Array<string>, OnChangeTypeListType]

/**
 * @desc 필터의 타입을 선택함에 따라 선택된 타입을 해제하거나 추가하는 hook
 * @param state 필터에서 선택한 타입 리스트
 * @returns
 */
export const useSetTypeFieldList: UseSetTypeFieldListType = (filterTypes) => {
  const [typeList, setTypeList] = React.useState(filterTypes)

  const onChangeTypeList = (type: string) => {
    if (typeList.indexOf(type) === -1) {
      setTypeList((list) => {
        return [...list, type]
      })
    } else {
      const index = typeList.indexOf(type)
      const cut = [...typeList]
      cut.splice(index, 1)
      setTypeList(() => {
        return [...cut]
      })
    }
  }
  console.log(typeList)

  return [typeList, onChangeTypeList]
}
