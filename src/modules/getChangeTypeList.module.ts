type GetChangeTypeListFn = (typeList: Array<string>, type: string) => string

/**
 */
export const getChangeTypeList: GetChangeTypeListFn = (typeList, type) => {
  const list = typeList.includes(type)
    ? typeList.filter((list) => list !== type)
    : [...typeList, type]

  return list.join(',')
}
