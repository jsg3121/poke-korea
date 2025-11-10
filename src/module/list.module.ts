// ItemList Schema for SEO - 매일 랜덤 10개 (날짜 기반 시드)
export const getDailyRandomPokemon = () => {
  const today = new Date().toISOString().split('T')[0]
  const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0)

  const randomNumbers: number[] = []
  let tempSeed = seed

  while (randomNumbers.length < 10) {
    tempSeed = (tempSeed * 1103515245 + 12345) & 0x7fffffff
    const num = (tempSeed % 1025) + 1
    if (!randomNumbers.includes(num)) {
      randomNumbers.push(num)
    }
  }

  return randomNumbers
}
