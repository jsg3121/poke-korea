type PokemonNumberFormat = (pokemonNumber: number) => string

/**
 * @desc 포켓몬 도감 번호앞에 0을 붙여 최소 3자리 형식으로 표시
 * @param pokemonNumber 포켓몬 전국도감 번호
 * @returns 4자리 숫자로 표시
 */
export const pokemonNumberFormat: PokemonNumberFormat = (pokemonNumber) => {
  return pokemonNumber.toString().padStart(3, '0')
}
