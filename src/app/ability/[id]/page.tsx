import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import { getAbilityDetailJsonLd } from '~/constants/abilityJsonLd'
import { PokemonByAbilityEdge } from '~/graphql/typeGenerated'
import { detectUserAgent } from '~/module/device.module'
import AbilityDetailDesktop from '~/views/desktop/ability/AbilityDetail.desktop'
import AbilityDetailMobile from '~/views/mobile/ability/AbilityDetail.mobile'
import { fetchAbilityDetailQueries } from './_fetch/abilityDetail.fetch'
import { generateAbilityDetailMetadata } from './_metadata/generateAbilityDetailMetadata'

export const revalidate = 31536000 // 1년

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
      title: '특성을 찾을 수 없습니다 - 포케 코리아',
    }
  }

  const { data } = await fetchAbilityDetailQueries({
    abilityId,
    first: 1,
  })

  const ability = data?.getPokemonByAbility?.ability

  if (!ability) {
    return {
      title: '특성을 찾을 수 없습니다 - 포케 코리아',
    }
  }

  return generateAbilityDetailMetadata({
    abilityId,
    abilityName: ability.name,
    abilityDescription: ability.description,
  })
}

const AbilityDetailPage = async ({ params }: PageProps) => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const { id } = await params
  const abilityId = parseInt(id, 10)

  if (isNaN(abilityId)) {
    notFound()
  }

  const { data } = await fetchAbilityDetailQueries({
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

  const jsonLd = getAbilityDetailJsonLd(abilityId, ability.name)

  return (
    <Fragment>
      {isMobile ? (
        <AbilityDetailMobile
          abilityId={abilityId}
          initialAbility={ability}
          initialPokemon={pokemonList}
          totalCount={data.getPokemonByAbility.totalCount ?? 0}
        />
      ) : (
        <AbilityDetailDesktop
          abilityId={abilityId}
          initialAbility={ability}
          initialPokemon={pokemonList}
          totalCount={data.getPokemonByAbility.totalCount ?? 0}
        />
      )}
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
