import LinkButtonComponent from '~/components/button/LinkButton.component'
import HorizontalScrollListComponent from '~/components/horizontalScrollList/HorizontalScrollList.component'
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
 * ## 그리드가 아니라 가로 스크롤
 *
 * 시안 단계에서는 "6종이면 전부 보이니 그리드"로 판단했으나, 구현하며 카드가
 * 데스크톱에서 `w-56`(224px) 고정이라는 제약이 드러났다. 본문 폭 1248px에 6개는
 * 1344px이 필요해 6열은 카드가 칸을 넘어 겹치고, 5열로 낮추면 둘째 줄에 1개만
 * 남는다. `HorizontalScrollList` DS를 쓰면 카드 고정폭을 지키면서 한 줄에 담기고
 * 엣지 페이드·peek 단서도 DS가 처리한다.
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
      {/* 그리드가 아니라 가로 스크롤을 쓴다.
          그리드로는 6종을 데스크톱 한 줄에 담을 수 없다 — 본문 폭 1248px에
          카드(w-56=224px) 6개는 1344px이 필요해 물리적으로 초과한다. 5열로
          낮추면 둘째 줄에 1개만 남고, 6열로 두면 카드가 칸을 넘어 겹친다.
          가로 스크롤은 카드 고정폭을 지키면서 6종을 한 줄에 두고, 좁은 화면에서
          다음 카드가 살짝 보이는 peek 단서까지 DS가 처리한다. */}
      <HorizontalScrollListComponent aria-label={`${label} 타입 포켓몬 목록`}>
        {pokemons.map((pokemon, index) => (
          <PokemonCardComponent
            key={pokemon.id}
            pokemonData={pokemon}
            variant="pokedex"
            // 폴드 밖 블록이라 첫 카드만 우선 로드해도 충분하다.
            isHighPriority={index === 0}
          />
        ))}
      </HorizontalScrollListComponent>
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
