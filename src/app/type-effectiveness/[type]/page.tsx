import { Fragment } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  getTypeDetailFaqJsonLd,
  getTypeDetailWebPageJsonLd,
} from '~/constants/typeEffectivenessJsonLd'
import { parseTypeSlug } from '~/modules/typeParams.module'
import TypeEffectivenessDetail from '~/views/typeEffectivenessDetail/TypeEffectivenessDetail.view'

import { fetchTypeDetailData } from './_fetch/typeDetail.fetch'
import { generateTypeDetailMetadata } from './_metadata/generateTypeDetailMetadata'

interface TypeDetailPageProps {
  params: Promise<{ type: string }>
}

export const generateMetadata = async ({
  params,
}: TypeDetailPageProps): Promise<Metadata> => {
  const { type: slug } = await params
  const pokemonType = parseTypeSlug(slug)

  if (!pokemonType) {
    return { title: '타입을 찾을 수 없습니다' }
  }

  return generateTypeDetailMetadata(pokemonType)
}

const TypeDetailPage = async ({ params }: TypeDetailPageProps) => {
  const { type: slug } = await params
  const pokemonType = parseTypeSlug(slug)

  if (!pokemonType) {
    notFound()
  }

  const { pokemons, pokemonTotalCount, champions } =
    await fetchTypeDetailData(pokemonType)

  const webPageJsonLd = getTypeDetailWebPageJsonLd(pokemonType)
  const faqJsonLd = getTypeDetailFaqJsonLd(pokemonType)

  return (
    <Fragment>
      <TypeEffectivenessDetail
        pokemonType={pokemonType}
        pokemons={pokemons}
        pokemonTotalCount={pokemonTotalCount}
        champions={champions}
      />
      <script
        id="type-detail-webpage-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      {faqJsonLd && (
        <script
          id="type-detail-faq-jsonLd"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </Fragment>
  )
}

export default TypeDetailPage
