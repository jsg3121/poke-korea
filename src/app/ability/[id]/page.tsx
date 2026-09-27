import { Fragment } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getAbilityDetailJsonLd } from '~/constants/abilityJsonLd'
import { PokemonByAbilityEdge } from '~/graphql/typeGenerated'
import AbilityDetail from '~/views/ability/AbilityDetail.view'
import Providers from '~/app/providers'

import { fetchAbilityDetailQueries } from './_fetch/abilityDetail.fetch'
import { generateAbilityDetailMetadata } from './_metadata/generateAbilityDetailMetadata'

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
