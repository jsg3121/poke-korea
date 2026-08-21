import LinkButtonComponent from '~/components/button/LinkButton.component'
import PokemonCardComponent from '~/components/pokemonCard/PokemonCard.component'
import { PokemonInfoFragment, PokemonType } from '~/graphql/typeGenerated'
import { getTypeLabel } from '~/module/typeParams.module'

/**
 * 타입별 포켓몬 6종.
 *
 * ## "대표"라고 쓰지 않는 이유
 *
 * 서비스 내부에 인기도·조회수 데이터가 없어 이 6종은 **편집 판단**이다
 * (§26.9.5). "대표"·"인기 순" 같은 표현은 확정된 공식 순위처럼 읽히므로 쓰지
 * 않고, 부제에 "일부를 보여준다"는 성격과 전체 수를 함께 드러낸다.
 *
 * 순서도 화면에 번호로 노출하지 않는다 — 번호를 붙이면 근거 없는 서열로 읽혀
 * 같은 문제가 생긴다. 상수의 순서는 유지하되 표시하지 않는다.
 *
 * ## 가로 스크롤 대신 그리드
 *
 * 6종이면 모바일 2열×3행으로 전부 보인다. 가로 스크롤의 존재 이유(넘치는 목록의
 * peek 단서)가 사라지므로 `HorizontalScrollList` DS를 쓰지 않는다 — 검색 유입
 * 사용자가 조작 없이 전부 보는 편이 낫다(시안 판단).
 */

interface TypeDetailPokemonContainerProps {
  pokemonType: PokemonType
  pokemons: Array<PokemonInfoFragment>
  /** 해당 타입 포켓몬 전체 수 — 부제에 쓴다. 0이면 표기를 생략한다. */
  totalCount: number
}

const TypeDetailPokemonContainer = ({
  pokemonType,
  pokemons,
  totalCount,
}: TypeDetailPokemonContainerProps) => {
  if (pokemons.length === 0) return null

  const label = getTypeLabel(pokemonType)

  return (
    <section
      aria-labelledby="type-detail-pokemon"
      className="w-full pt-10 desktop:pt-14"
    >
      <h2
        id="type-detail-pokemon"
        className="mb-2 text-xl font-semibold leading-tight text-primary-4 desktop:text-3xl"
      >
        {label} 타입 포켓몬
      </h2>
      <p className="mb-4 text-sm text-primary-3">
        {totalCount > 0
          ? `${label} 타입 포켓몬은 전부 ${totalCount}종이에요. 그중 널리 알려진 ${pokemons.length}종을 보여드려요.`
          : `널리 알려진 ${label} 타입 포켓몬 ${pokemons.length}종이에요.`}
      </p>
      <ul className="grid grid-cols-2 gap-3 desktop:grid-cols-6 desktop:gap-4">
        {pokemons.map((pokemon, index) => (
          <li key={pokemon.id} className="flex justify-center">
            <PokemonCardComponent
              pokemonData={pokemon}
              variant="pokedex"
              // 폴드 밖 블록이라 첫 카드만 우선 로드해도 충분하다.
              isHighPriority={index === 0}
            />
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <LinkButtonComponent
          href={`/list?type=${pokemonType}`}
          variant="secondary"
          showArrow
        >
          {label} 타입 포켓몬 전체 보기
        </LinkButtonComponent>
      </div>
    </section>
  )
}

export default TypeDetailPokemonContainer
