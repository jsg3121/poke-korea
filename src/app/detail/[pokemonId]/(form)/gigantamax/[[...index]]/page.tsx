import { Metadata } from 'next'
import { notFound, permanentRedirect, RedirectType } from 'next/navigation'

import { DetailProvider } from '~/context/Detail.context'
import Detail from '~/views/detail/Detail.view'

import { generatePokemonJsonLd } from '../../../../../../constants/pokemonJsonLd'
import {
  fetchAdjacentPokemon,
  fetchGigantamaxData,
  fetchPokemonDetail,
  fetchPokemonSummaries,
} from '../../modules/fetchDetailData'
import { generateDetailMetadata } from '../../modules/generateMetadata'
import { parseIndexParam } from '../../modules/parseFormParams'

export const revalidate = 31536000

interface GigantamaxPageProps {
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
}: GigantamaxPageProps): Promise<Metadata> => {
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

  const { gigantamaxData } = await fetchGigantamaxData(parsedPokemonId)

  if (!gigantamaxData[activeIndex]) {
    return {}
  }

  return generateDetailMetadata({
    pokemonDetail,
    activeType: 'gigantamax',
    activeIndex,
    isShiny,
    gigantamaxData,
  })
}

const GigantamaxPage = async ({
  params,
  searchParams,
}: GigantamaxPageProps) => {
  const { pokemonId, index } = await params
  const query = await searchParams

  if (query.activeType || query.activeIndex) {
    const { activeIndex: parsedIndex } = parseIndexParam(index)
    const queryParams = query.shinyMode ? `?shinyMode=${query.shinyMode}` : ''
    const indexPath = parsedIndex > 0 ? `/${parsedIndex}` : ''
    permanentRedirect(
      `/detail/${pokemonId}/gigantamax${indexPath}${queryParams}`,
      RedirectType.replace,
    )
  }

  const parsedPokemonId = parseInt(pokemonId, 10)

  if (isNaN(parsedPokemonId)) {
    notFound()
  }

  const { activeIndex, isValid } = parseIndexParam(index)

  if (!isValid) {
    permanentRedirect(`/detail/${pokemonId}/gigantamax`, RedirectType.replace)
  }

  const isShiny = query.shinyMode === 'shiny'

  const pokemonDetail = await fetchPokemonDetail(parsedPokemonId)

  if (!pokemonDetail) {
    notFound()
  }

  if (!pokemonDetail.isGigantamax) {
    permanentRedirect(`/detail/${pokemonId}`, RedirectType.replace)
  }

  const [{ gigantamaxData }, adjacent, evolutionPokemons] = await Promise.all([
    fetchGigantamaxData(parsedPokemonId),
    fetchAdjacentPokemon(parsedPokemonId),
    fetchPokemonSummaries(pokemonDetail.evolutionId),
  ])

  // 존재하지 않는 폼 인덱스는 404.
  if (!gigantamaxData[activeIndex]) {
    notFound()
  }

  const props = {
    pokemonBaseInfo: pokemonDetail,
    normalForm: [],
    megaEvolutionData: [],
    regionFormData: [],
    gigantamaxData,
    isShinyInfo: isShiny,
    versionGroup: undefined,
    normalFormImageList: [],
    activeType: 'gigantamax' as const,
    activeIndex,
  }

  const pokemonJsonLd = generatePokemonJsonLd({
    pokemonDetail,
    activeType: 'gigantamax',
    activeIndex,
    isShiny,
    normalForm: [],
    megaEvolutionData: [],
    regionFormData: [],
    gigantamaxData,
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

export default GigantamaxPage
