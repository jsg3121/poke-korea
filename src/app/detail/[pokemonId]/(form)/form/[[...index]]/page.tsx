import { Metadata } from 'next'
import { notFound, permanentRedirect, RedirectType } from 'next/navigation'

import { DetailProvider } from '~/context/Detail.context'
import Detail from '~/views/detail/Detail.view'

import { generatePokemonJsonLd } from '../../../../../../constants/pokemonJsonLd'
import {
  fetchAdjacentPokemon,
  fetchNormalFormData,
  fetchPokemonDetail,
  fetchPokemonSummaries,
} from '../../modules/fetchDetailData'
import { generateDetailMetadata } from '../../modules/generateMetadata'
import { parseIndexParam } from '../../modules/parseFormParams'

export const revalidate = 31536000

interface NormalFormPageProps {
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
}: NormalFormPageProps): Promise<Metadata> => {
  const { pokemonId, index } = await params
  const parsedPokemonId = parseInt(pokemonId, 10)

  if (isNaN(parsedPokemonId) || parsedPokemonId <= 0) {
    notFound()
  }

  const { activeIndex, isValid } = parseIndexParam(index)

  if (!isValid) {
    return {}
  }

  const query = await searchParams
  const isShiny = query.shinyMode === 'shiny'

  const pokemonDetail = await fetchPokemonDetail(parsedPokemonId)

  if (!pokemonDetail) {
    throw new Error('no pokemon data')
  }

  const { normalFormData } = await fetchNormalFormData(
    parsedPokemonId,
    activeIndex,
  )

  if (normalFormData.length === 0) {
    return {}
  }

  return generateDetailMetadata({
    pokemonDetail,
    activeType: 'normal',
    activeIndex,
    isShiny,
    normalFormData,
  })
}

const NormalFormPage = async ({
  params,
  searchParams,
}: NormalFormPageProps) => {
  const { pokemonId, index } = await params
  const query = await searchParams

  if (query.activeType || query.activeIndex) {
    const { activeIndex: parsedIndex } = parseIndexParam(index)
    const queryParams = query.shinyMode ? `?shinyMode=${query.shinyMode}` : ''
    const indexPath = parsedIndex > 0 ? `/${parsedIndex}` : ''
    permanentRedirect(
      `/detail/${pokemonId}/form${indexPath}${queryParams}`,
      RedirectType.replace,
    )
  }

  const parsedPokemonId = parseInt(pokemonId, 10)

  if (isNaN(parsedPokemonId)) {
    notFound()
  }

  const { activeIndex, isValid } = parseIndexParam(index)

  if (!isValid) {
    permanentRedirect(`/detail/${pokemonId}/form`, RedirectType.replace)
  }

  const isShiny = query.shinyMode === 'shiny'

  const pokemonDetail = await fetchPokemonDetail(parsedPokemonId)

  if (!pokemonDetail) {
    notFound()
  }

  if (!pokemonDetail.isFormChange) {
    permanentRedirect(`/detail/${pokemonId}`, RedirectType.replace)
  }

  const [
    { normalFormData, versionGroupData, normalFormImageList },
    adjacent,
    evolutionPokemons,
  ] = await Promise.all([
    fetchNormalFormData(parsedPokemonId, activeIndex),
    fetchAdjacentPokemon(parsedPokemonId),
    fetchPokemonSummaries(pokemonDetail.evolutionId),
  ])

  // 백엔드가 범위 밖 activeIndex에 빈 배열을 반환한다. 가드가 없으면 폼이
  // 없는데도 200으로 원종 내용을 보여줘 중복 URL이 색인된다.
  if (normalFormData.length === 0) {
    notFound()
  }

  const props = {
    pokemonBaseInfo: pokemonDetail,
    normalForm: normalFormData,
    megaEvolutionData: [],
    regionFormData: [],
    isShinyInfo: isShiny,
    versionGroup: versionGroupData.length > 0 ? versionGroupData : undefined,
    normalFormImageList,
    activeType: 'normal' as const,
    activeIndex,
  }

  const pokemonJsonLd = generatePokemonJsonLd({
    pokemonDetail,
    activeType: 'normal',
    activeIndex,
    isShiny,
    normalForm: normalFormData,
    megaEvolutionData: [],
    regionFormData: [],
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

export default NormalFormPage
