'use client'

import Link from 'next/link'
import { useContext } from 'react'
import HorizontalScrollListComponent from '~/components/horizontalScrollList/HorizontalScrollList.component'
import ImageComponent from '~/components/Image.component'
import { DetailContext } from '~/context/Detail.context'
import { imageMode } from '~/module/buildMode'
import InfoCardTitleComponent from './components/InfoCardTitle.component'

/**
 * 진화 체인 카드 (기존 데/모 RelationPokemon 이관 — UX-005 m1).
 * 기존의 맨 이미지 나열은 클릭 가능 여부가 드러나지 않았다 — 각 단계를
 * 밝은 카드 셸(hover scale·focus ring)로 감싸 어포던스를 명시한다.
 * 가로 스크롤은 홈에서 규격화한 HorizontalScrollList(엣지 페이드) 재사용.
 * 진화 데이터가 id뿐이라(이름·타입 없음) 전체 PokemonCard 대신 경량 카드다.
 */

const DetailEvolutionContainer = () => {
  const { pokemonBaseInfo } = useContext(DetailContext)

  const evolutionIds = pokemonBaseInfo?.evolutionId ?? []
  if (evolutionIds.length === 0) return null

  const name = pokemonBaseInfo?.name ?? ''

  return (
    <section
      className="card-detail w-full"
      aria-labelledby="pokemon-evolution-chain"
    >
      <InfoCardTitleComponent title="진화 체인" id="pokemon-evolution-chain" />
      <HorizontalScrollListComponent aria-label="진화 체인 포켓몬 목록">
        {evolutionIds.map((id) => (
          <li key={`relation-pokemon-id-${id}`} className="shrink-0">
            <Link
              href={`/detail/${id}`}
              aria-label={`${name}와(과) 연관된 포켓몬 No.${id} 상세 보기`}
              className="block rounded-2xl bg-white-1 p-2 shadow-md transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
            >
              <ImageComponent
                src={`${imageMode}/${id}`}
                width="9rem"
                height="9rem"
                alt={`포켓몬 ${name} 연관 포켓몬 ${id}`}
                imageSize={{ width: 138, height: 138 }}
                densities={[1, 1.5]}
                sizes="9rem"
                loading="lazy"
              />
              <p className="mt-1 text-center text-xs font-semibold text-primary-2">
                No.{id.toString().padStart(3, '0')}
              </p>
            </Link>
          </li>
        ))}
      </HorizontalScrollListComponent>
    </section>
  )
}

export default DetailEvolutionContainer
