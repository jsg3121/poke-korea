import { Fragment } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getAbilityDetailJsonLd } from '~/constants/abilityJsonLd'
import { PokemonByAbilityEdge } from '~/graphql/typeGenerated'
import AbilityDetail from '~/views/ability/AbilityDetail.view'
import Providers from '~/app/providers'

import { fetchAbilityDetailQueries } from './_fetch/abilityDetail.fetch'
import { generateAbilityDetailMetadata } from './_metadata/generateAbilityDetailMetadata'

// 이 페이지는 동적 렌더다: headers() UA 감지(크롬 선택)가 매 요청 평가된다.
// 기존 revalidate=1년 선언은 headers() 때문에 실효가 없던 거짓 신호라 제거(UX-007).

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const abilityId = parseInt(id, 10)

  if (isNaN(abilityId)) {
    return {
      title: '특성을 찾을 수 없습니다',
    }
  }

  const { data } = await fetchAbilityDetailQueries({
    abilityId,
    first: 1,
  })

  const ability = data?.getPokemonByAbility?.ability

  if (!ability) {
    return {
      title: '특성을 찾을 수 없습니다',
    }
  }

  return generateAbilityDetailMetadata({
    abilityId,
    abilityName: ability.name,
    abilityDescription: ability.description,
  })
}

const AbilityDetailPage = async ({ params }: PageProps) => {
  const { id } = await params
  const abilityId = parseInt(id, 10)

  if (isNaN(abilityId)) {
    notFound()
  }

  const { data, initialApolloState } = await fetchAbilityDetailQueries({
    abilityId,
    first: 20,
  })

  const ability = data?.getPokemonByAbility?.ability
  const pokemonList =
    data?.getPokemonByAbility?.edges.map((edge: PokemonByAbilityEdge) => {
      return edge.node
    }) || []

  if (!ability) {
    notFound()
  }

  const totalCount = data.getPokemonByAbility.totalCount ?? 0
  const jsonLd = getAbilityDetailJsonLd(abilityId, ability.name)

  return (
    <Fragment>
      {/* 콘텐츠는 반응형 단일(AbilityDetail, ADR-0007). UA 분기는 전역 크롬
          (헤더/푸터/탭바) 선택으로만 남는다(list·홈 개편과 동일 패턴). */}
      <Providers initialApolloState={initialApolloState}>
        <AbilityDetail
          abilityId={abilityId}
          initialAbility={ability}
          initialPokemon={pokemonList}
          totalCount={totalCount}
        />
      </Providers>
      <script
        id="ability-detail-webpage-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
    </Fragment>
  )
}

export default AbilityDetailPage
