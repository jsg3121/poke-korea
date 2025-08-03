import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  GetPokemonNormalFormDocument,
  GetPokemonRegionFormDocument,
  PokemonDetailDocument,
} from '~/graphql/gqlGenerated'
import {
  GetPokemonNormalFormQuery,
  GetPokemonRegionFormQuery,
  PokemonDetailQuery,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import DetailMovesDesktop from '~/views/desktop/DetailMoves.desktop'
import DetailMovesMobile from '~/views/mobile/DetailMoves.mobile'

export const revalidate = 31536000 // 24시간마다 재생성

interface DetailMovesPageProps {
  params: Promise<{ pokemonId: string }>
  searchParams: Promise<{
    pokemonType?: 'region' | 'normalForm'
    activeIndex?: string
  }>
}

const DetailMovesPage = async ({
  params,
  searchParams,
}: DetailMovesPageProps) => {
  const { pokemonId } = await params
  const { pokemonType = 'default' } = await searchParams
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const apolloClient = initializeApollo()

  // 기본 포켓몬 정보는 항상 가져오기
  const { data: pokemonDetailData } =
    await apolloClient.query<PokemonDetailQuery>({
      query: PokemonDetailDocument,
      variables: { pokemonId: parseInt(pokemonId, 10) },
      fetchPolicy: 'cache-first',
    })

  const pokemonDetail = pokemonDetailData.getPokemonDetail

  if (!pokemonDetail) {
    redirect('/')
  }

  // 타입별로 추가 데이터 가져오기
  let normalFormData: GetPokemonNormalFormQuery['getPokemonNormalForm'] = null
  let regionFormData: GetPokemonRegionFormQuery['getPokemonRegionForm'] = null

  if (pokemonType === 'normalForm') {
    const { data } = await apolloClient.query<GetPokemonNormalFormQuery>({
      query: GetPokemonNormalFormDocument,
      variables: { pokemonId: parseInt(pokemonId, 10) },
      fetchPolicy: 'cache-first',
    })
    normalFormData = data.getPokemonNormalForm
  }

  if (pokemonType === 'region') {
    const { data } = await apolloClient.query<GetPokemonRegionFormQuery>({
      query: GetPokemonRegionFormDocument,
      variables: { pokemonId: parseInt(pokemonId, 10) },
      fetchPolicy: 'cache-first',
    })
    regionFormData = data.getPokemonRegionForm
  }

  const providerProps = {
    pokemonDetail,
    normalFormData: normalFormData ?? [],
    regionFormData: regionFormData ?? [],
  }

  return (
    <DetailMovesProvider {...providerProps}>
      {isMobile ? <DetailMovesMobile /> : <DetailMovesDesktop />}
    </DetailMovesProvider>
  )
}

export default DetailMovesPage
