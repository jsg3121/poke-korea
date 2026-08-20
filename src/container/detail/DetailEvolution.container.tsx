'use client'

import Link from 'next/link'
import { useContext } from 'react'
import HorizontalScrollListComponent from '~/components/horizontalScrollList/HorizontalScrollList.component'
import ImageComponent from '~/components/Image.component'
import { DetailContext } from '~/context/Detail.context'
import { imageMode } from '~/module/buildMode'
import { pokemonNumberFormat } from '~/module/pokemonCard.module'
import { buildEvolutionGroups } from '~/utils/evolution.util'
import EvolutionConditionCardComponent from './components/EvolutionConditionCard.component'
import InfoCardTitleComponent from './components/InfoCardTitle.component'
import { AdjacentPokemon } from './DetailSpeciesNav.container'

/**
 * 진화 계통 카드 (기존 데/모 RelationPokemon 이관 — UX-005 m1).
 * 각 진화 단계를 밝은 카드 셸(hover scale·focus ring)로 감싸 클릭 어포던스를 명시한다.
 *
 * 1.55.0 진화조건 확장: 백엔드 `evolutionChain.groups`(폼별 진화 루트 묶음)를 폼
 * 그룹 섹션으로 렌더한다. 리전폼 계통(알로라·가라르·히스이 등)은 그룹별 섹션으로
 * 나뉘고(예: 나옹 → 기본/알로라/가라르 3섹션), 각 섹션은 계통을 진화 단계순으로
 * 나열하며 각 단계에 진화 조건 문장(description)을 붙인다. 이름·이미지·상세 URL은
 * edge의 from/result 폼 정보에서 와, 리전폼(알로라 나인테일)·폼체인지(황혼 루가루암)도
 * 정확히 표시·링크된다. 버전마다 조건이 다르면 버전 탭으로 노출한다.
 *
 * 그룹이 하나면 섹션 라벨을 생략하고(불필요), 둘 이상이면 라벨(기본/알로라/…)을 붙인다.
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
  const { pokemonBaseInfo } = useContext(DetailContext)

  const name = pokemonBaseInfo?.name ?? ''

  const groups = pokemonBaseInfo?.evolutionChain?.groups ?? []
  const sections = buildEvolutionGroups(groups)

  // 그룹이 하나뿐이면 섹션 라벨을 숨긴다(폼 구분이 없어 라벨이 불필요).
  const showGroupLabels = sections.length > 1

  if (sections.length > 0) {
    return (
      <section
        className="card-detail w-full"
        aria-labelledby="pokemon-evolution-chain"
      >
        <InfoCardTitleComponent
          title="진화 정보"
          id="pokemon-evolution-chain"
        />
        <div className="flex w-full flex-col gap-5 desktop:gap-6">
          {sections.map((groupSection) => (
            <div key={groupSection.groupKey} className="flex flex-col gap-2">
              {showGroupLabels && (
                <h3 className="text-sm font-semibold text-primary-2 desktop:text-base">
                  {groupSection.label}
                </h3>
              )}
              <div className="grid grid-cols-1 gap-3 desktop:grid-cols-3">
                {groupSection.nodes.map((node) => (
                  <EvolutionConditionCardComponent
                    // targetHref는 번호+폼(타입·index)을 담아 그룹 내 유일하고
                    // 정렬 순서에 안정적이다 — 카드의 버전 탭 상태가 리셋되지 않게
                    // index를 key에 섞지 않는다.
                    key={`evolution-node-${groupSection.groupKey}-${node.targetHref}`}
                    node={node}
                    baseName={name}
                  />
                ))}
              </div>
            </div>
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
