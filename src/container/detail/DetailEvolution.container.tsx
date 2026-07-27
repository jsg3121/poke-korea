'use client'

import Link from 'next/link'
import { useContext } from 'react'
import HorizontalScrollListComponent from '~/components/horizontalScrollList/HorizontalScrollList.component'
import ImageComponent from '~/components/Image.component'
import { DetailContext } from '~/context/Detail.context'
import { imageMode } from '~/module/buildMode'
import { pokemonNumberFormat } from '~/module/pokemonCard.module'
import InfoCardTitleComponent from './components/InfoCardTitle.component'
import { AdjacentPokemon } from './DetailSpeciesNav.container'

/**
 * 진화 체인 카드 (기존 데/모 RelationPokemon 이관 — UX-005 m1).
 * 기존의 맨 이미지 나열은 클릭 가능 여부가 드러나지 않았다 — 각 단계를
 * 밝은 카드 셸(hover scale·focus ring)로 감싸 어포던스를 명시한다.
 * 가로 스크롤은 홈에서 규격화한 HorizontalScrollList(엣지 페이드) 재사용.
 *
 * 이름은 컨텍스트에 없어서(evolutionId뿐) 호출부가 경량 조회한 목록을
 * props로 받는다(QA 라운드 2 — 번호만으로는 어떤 포켓몬인지 알 수 없음).
 * HorizontalScrollList가 각 자식을 li로 래핑하므로 Link를 직접 전달한다
 * (li 중첩 → hydration 오류, QA 라운드 1에서 수정).
 */

interface DetailEvolutionProps {
  /** 진화 체인 포켓몬 번호+이름 (evolutionId 순서, 조회 실패분 제외) */
  evolutionPokemons: Array<AdjacentPokemon>
}

const DetailEvolutionContainer = ({
  evolutionPokemons,
}: DetailEvolutionProps) => {
  const { pokemonBaseInfo } = useContext(DetailContext)

  // 이름 조회가 전부 실패한 예외 상황에도 번호 카드로 강등 렌더한다
  const chain: Array<AdjacentPokemon> =
    evolutionPokemons.length > 0
      ? evolutionPokemons
      : (pokemonBaseInfo?.evolutionId ?? []).map((id) => ({
          number: id,
          name: '',
        }))
  if (chain.length === 0) return null

  const name = pokemonBaseInfo?.name ?? ''

  return (
    <section
      className="card-detail w-full"
      aria-labelledby="pokemon-evolution-chain"
    >
      <InfoCardTitleComponent title="진화 체인" id="pokemon-evolution-chain" />
      <HorizontalScrollListComponent aria-label="진화 체인 포켓몬 목록">
        {chain.map((pokemon) => (
          <Link
            key={`relation-pokemon-id-${pokemon.number}`}
            href={`/detail/${pokemon.number}`}
            aria-label={`${name}와(과) 연관된 포켓몬 ${pokemon.name || `No.${pokemon.number}`} 상세 보기`}
            className="block rounded-2xl p-2 shadow-md transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
          >
            <ImageComponent
              src={`${imageMode}/${pokemon.number}`}
              width="9rem"
              height="9rem"
              alt={`포켓몬 ${name} 연관 포켓몬 ${pokemon.name || pokemon.number}`}
              imageSize={{ width: 138, height: 138 }}
              densities={[1, 1.5]}
              sizes="9rem"
              loading="lazy"
            />
            <p className="mt-1 text-center text-2xs text-primary-2 desktop:text-xs">
              No.{pokemonNumberFormat(pokemon.number)}
            </p>
            {pokemon.name && (
              <p className="text-center text-xs font-semibold text-primary-1 desktop:text-sm">
                {pokemon.name}
              </p>
            )}
          </Link>
        ))}
      </HorizontalScrollListComponent>
    </section>
  )
}

export default DetailEvolutionContainer
