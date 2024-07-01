type GetChangeTypeListFn = (typeList: Array<string>, type: string) => string

/**
 * @desc 타입 필터 선택시 해당 값이 필터에 추가 또는 선택된 필터를 해제한 리스트를 URL파라미터에 맞게 쉼표로 구분된 문자열로 변환하여 반환
 * @param typeList 타입 리스트
 * @param type 선택한 타입
 * @returns
 */
export const getChangeTypeList: GetChangeTypeListFn = (typeList, type) => {
  const list = typeList.includes(type)
    ? typeList.filter((list) => list !== type)
    : [...typeList, type]

  return list.join(',')
}
