'use client'

import Link from 'next/link'
import { useContext } from 'react'
import HorizontalScrollListComponent from '~/components/horizontalScrollList/HorizontalScrollList.component'
import ImageComponent from '~/components/Image.component'
import { DetailContext } from '~/context/Detail.context'
import { imageMode } from '~/module/buildMode'
import { pokemonNumberFormat } from '~/module/pokemonCard.module'
import { buildEvolutionChain } from '~/utils/evolution.util'
import EvolutionConditionCardComponent from './components/EvolutionConditionCard.component'
import InfoCardTitleComponent from './components/InfoCardTitle.component'
import { AdjacentPokemon } from './DetailSpeciesNav.container'

/**
 * 진화 계통 카드 (기존 데/모 RelationPokemon 이관 — UX-005 m1).
 * 기존의 맨 이미지 나열은 클릭 가능 여부가 드러나지 않았다 — 각 단계를
 * 밝은 카드 셸(hover scale·focus ring)로 감싸 어포던스를 명시한다.
 *
 * 1.55.0 진화조건 확장: 백엔드 `evolutionChain`(stages + edges)이 오면 계통
 * 전체를 진화 단계순으로 나열하고, 각 단계로 들어오는 진화 조건 문장(description)을
 * 함께 렌더한다. 어느 단계에서 조회해도 계통 전체가 동일하게 온다(이상해씨→
 * 이상해풀→이상해꽃). 폼별로 조건이 갈리는 종은 현재 폼(리전/일반)으로
 * 필터링(§4)하고, 버전별로 다른 종은 버전 탭으로 노출(§5)한다. imagePath·
 * displayName을 써서 리전폼(알로라 나인테일 등) 이미지·이름도 정확히 나온다.
 *
 * `evolutionChain`이 없으면(구 캐시) 기존 체인 나열로 폴백한다. 폴백 시 이름은
 * 컨텍스트에 없어(evolutionId뿐) 호출부가 경량 조회한 목록을 props로 받는다.
 * HorizontalScrollList가 각 자식을 li로 래핑하므로 Link를 직접 전달한다
 * (li 중첩 → hydration 오류).
 */

interface DetailEvolutionProps {
  /** 진화 체인 포켓몬 번호+이름 (evolutionId 순서, 조회 실패분 제외) — 폴백용 */
  evolutionPokemons: Array<AdjacentPokemon>
}

const DetailEvolutionContainer = ({
  evolutionPokemons,
}: DetailEvolutionProps) => {
  const { pokemonBaseInfo, activeType } = useContext(DetailContext)

  const name = pokemonBaseInfo?.name ?? ''

  // 리전폼 뷰(알로라 식스테일 등)일 때 진화 대상도 리전폼 버전을 보여준다.
  // 메가·거다이맥스는 폼이 바뀌어도 진화 계통은 일반폼과 같으므로 일반 기준.
  const isRegionForm = activeType === 'region'

  const stages = pokemonBaseInfo?.evolutionChain?.stages ?? []
  const edges = pokemonBaseInfo?.evolutionChain?.edges ?? []

  const nodes = buildEvolutionChain(stages, edges, isRegionForm)

  // 진화 대상이 하나라도 있으면 "진화 정보"로 보여준다(단독 포켓몬은 edges가
  // 없어 노드 0개 → 폴백). 현재 폼에 맞는 edge만 필터링돼 있다.
  if (nodes.length > 0) {
    return (
      <section
        className="card-detail w-full"
        aria-labelledby="pokemon-evolution-chain"
      >
        <InfoCardTitleComponent
          title="진화 정보"
          id="pokemon-evolution-chain"
        />
        <div className="grid grid-cols-1 gap-3 desktop:grid-cols-2">
          {nodes.map((node, index) => (
            <EvolutionConditionCardComponent
              key={`evolution-node-${node.targetNumber}-${node.displayName}-${index}`}
              node={node}
              baseName={name}
            />
          ))}
        </div>
      </section>
    )
  }

  // 폴백: evolutionChain이 없으면 기존 체인 나열(이름 조회 실패 시 번호만).
  const chain: Array<AdjacentPokemon> =
    evolutionPokemons.length > 0
      ? evolutionPokemons
      : (pokemonBaseInfo?.evolutionId ?? []).map((id) => ({
          number: id,
          name: '',
        }))
  if (chain.length === 0) return null

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
            className="block rounded-2xl transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
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
