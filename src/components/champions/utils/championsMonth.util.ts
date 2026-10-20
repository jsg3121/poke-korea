/**
 * `YYYY-MM` 형식의 월 값을 화면 표기로 바꾼다.
 * @param month `YYYY-MM` 형식의 월
 * @returns `YYYY년 M월`. 형식이 맞지 않으면 입력값 그대로
 */
export const formatMonthLabel = (month: string): string => {
  const [year, monthNum] = month.split('-')
  if (!year || !monthNum) return month
  return `${year}년 ${parseInt(monthNum, 10)}월`
}
