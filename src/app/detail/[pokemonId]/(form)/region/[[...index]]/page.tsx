import { Metadata } from 'next'
import { notFound, permanentRedirect, RedirectType } from 'next/navigation'

import { DetailProvider } from '~/context/Detail.context'
import Detail from '~/views/detail/Detail.view'

import { generatePokemonJsonLd } from '../../../../../../constants/pokemonJsonLd'
import {
  fetchAdjacentPokemon,
  fetchPokemonDetail,
  fetchPokemonSummaries,
  fetchRegionFormData,
} from '../../modules/fetchDetailData'
import { generateDetailMetadata } from '../../modules/generateMetadata'
import { parseIndexParam } from '../../modules/parseFormParams'

export const revalidate = 31536000

interface RegionPageProps {
  params: Promise<{ pokemonId: string; index?: string[] }>
  searchParams: Promise<{
    shinyMode?: string
    activeType?: string
    activeIndex?: string
  }>
}

export const generateMetadata = async ({
  params,
  searchParams,
}: RegionPageProps): Promise<Metadata> => {
  const { pokemonId, index } = await params
  const parsedPokemonId = parseInt(pokemonId, 10)

  if (isNaN(parsedPokemonId) || parsedPokemonId <= 0) {
    notFound()
  }

  const { activeIndex } = parseIndexParam(index)
  const query = await searchParams
  const isShiny = query.shinyMode === 'shiny'

  const pokemonDetail = await fetchPokemonDetail(parsedPokemonId)

  if (!pokemonDetail) {
    throw new Error('no pokemon data')
  }

  const { regionFormData } = await fetchRegionFormData(parsedPokemonId)

  if (!regionFormData[activeIndex]) {
    return {}
  }

  return generateDetailMetadata({
    pokemonDetail,
    activeType: 'region',
    activeIndex,
    isShiny,
    regionFormData,
  })
}

const RegionPage = async ({ params, searchParams }: RegionPageProps) => {
  const { pokemonId, index } = await params
  const query = await searchParams

  if (query.activeType || query.activeIndex) {
    const { activeIndex: parsedIndex } = parseIndexParam(index)
    const queryParams = query.shinyMode ? `?shinyMode=${query.shinyMode}` : ''
    const indexPath = parsedIndex > 0 ? `/${parsedIndex}` : ''
    permanentRedirect(
      `/detail/${pokemonId}/region${indexPath}${queryParams}`,
      RedirectType.replace,
    )
  }

  const parsedPokemonId = parseInt(pokemonId, 10)

  if (isNaN(parsedPokemonId)) {
    notFound()
  }

  const { activeIndex, isValid } = parseIndexParam(index)

  if (!isValid) {
    permanentRedirect(`/detail/${pokemonId}/region`, RedirectType.replace)
  }

  const isShiny = query.shinyMode === 'shiny'

  const pokemonDetail = await fetchPokemonDetail(parsedPokemonId)

  if (!pokemonDetail) {
    notFound()
  }

  if (!pokemonDetail.isRegionForm) {
    permanentRedirect(`/detail/${pokemonId}`, RedirectType.replace)
  }

  const [{ regionFormData, versionGroupData }, adjacent, evolutionPokemons] =
    await Promise.all([
      fetchRegionFormData(parsedPokemonId),
      fetchAdjacentPokemon(parsedPokemonId),
      fetchPokemonSummaries(pokemonDetail.evolutionId),
    ])

  if (!regionFormData[activeIndex]) {
    notFound()
  }

  const props = {
    pokemonBaseInfo: pokemonDetail,
    normalForm: [],
    megaEvolutionData: [],
    regionFormData,
    isShinyInfo: isShiny,
    versionGroup: versionGroupData.length > 0 ? versionGroupData : undefined,
    normalFormImageList: [],
    activeType: 'region' as const,
    activeIndex,
  }

  const pokemonJsonLd = generatePokemonJsonLd({
    pokemonDetail,
    activeType: 'region',
    activeIndex,
    isShiny,
    normalForm: [],
    megaEvolutionData: [],
    regionFormData,
  })

  return (
    <DetailProvider {...props}>
      <Detail
        prevPokemon={adjacent.prev}
        nextPokemon={adjacent.next}
        evolutionPokemons={evolutionPokemons}
      />
      <script
        id="pokemon-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pokemonJsonLd),
        }}
      />
    </DetailProvider>
  )
}

export default RegionPage
