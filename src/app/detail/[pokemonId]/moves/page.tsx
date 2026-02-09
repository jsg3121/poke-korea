import { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import {
  GetDetailMovesPokemonInfoDocument,
  GetPokemonNormalFormMetadataDocument,
  GetVersionGroupsDocument,
} from '~/graphql/gqlGenerated'
import {
  GetPokemonNormalFormMetadataQuery,
  GetPokemonNormalFormMetadataQueryVariables,
  LearnMethod,
  type GetDetailMovesPokemonInfoQuery,
  type GetDetailMovesPokemonInfoQueryVariables,
  type GetVersionGroupsQuery,
  type GetVersionGroupsQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import { getRobotsConfig } from '~/module/metadata.module'
import DetailMovesDesktop from '~/views/desktop/detail/detail.moves/DetailMoves.desktop'
import DetailMovesMobile from '~/views/mobile/detail/detail.moves/DetailMoves.mobile'
import { fetchDefaultMovesQueries } from './_fetch/defaultMoves.fetch'

export const revalidate = 31536000

interface DetailMovesPageProps {
  params: Promise<{ pokemonId: string }>
  searchParams: Promise<{
    activeType?: 'region' | 'normalForm'
    activeIndex?: string
    selectVersion?: string
    movesType?: 'LEVELUP' | 'MACHINE'
  }>
}

export const generateMetadata = async ({
  params,
  searchParams,
}: DetailMovesPageProps): Promise<Metadata> => {
  const { pokemonId } = await params
  const {
    activeIndex = '0',
    activeType,
    movesType = 'LEVELUP',
    selectVersion,
  } = await searchParams

  // 쿼리 파라미터가 있으면 메타데이터 생성 스킵 (리다이렉트됨)
  if (
    activeType === 'region' ||
    activeIndex !== '0' ||
    selectVersion ||
    movesType !== 'LEVELUP'
  ) {
    return {}
  }

  const apolloClient = initializeApollo()

  const { data: pokemonDetail } = await apolloClient.query<
    GetDetailMovesPokemonInfoQuery,
    GetDetailMovesPokemonInfoQueryVariables
  >({
    query: GetDetailMovesPokemonInfoDocument,
    variables: {
      pokemonId,
    },
    fetchPolicy: 'cache-first',
  })
  const isNormalForm = !!pokemonDetail.getPokemonDetail?.isFormChange

  const [{ data: versionInfo }, { data: normalFormData }] = await Promise.all([
    apolloClient.query<GetVersionGroupsQuery, GetVersionGroupsQueryVariables>({
      query: GetVersionGroupsDocument,
      variables: {
        filter: {
          pokemonId: parseInt(pokemonId, 10),
          ...(isNormalForm && {
            activeType: 'NORMAL',
            activeIndex: 0,
          }),
        },
      },
      fetchPolicy: 'cache-first',
    }),
    apolloClient.query<
      GetPokemonNormalFormMetadataQuery,
      GetPokemonNormalFormMetadataQueryVariables
    >({
      query: GetPokemonNormalFormMetadataDocument,
      variables: {
        pokemonId: parseInt(pokemonId, 10),
        activeIndex: 0,
      },
    }),
  ])

  const version = versionInfo.getVersionGroups?.[0]
  const pokemonName = isNormalForm
    ? normalFormData.getPokemonNormalForm?.[0].name.replace('_', ' ')
    : pokemonDetail.getPokemonDetail?.name

  const isSingleSeries = versionInfo.getVersionGroups?.length === 1

  const title = `${pokemonName}${version ? ` ${version.generationId}세대 ${version.nameKo} 시리즈` : ''} 레벨업 습득 기술 정보`
  const description = isSingleSeries
    ? `${versionInfo.getVersionGroups?.[0].nameKo}시리즈에 출현한 ${pokemonName}의 모든 기술을 확인하고 다양한 포켓몬의 정보를 확인해보세요!`
    : `${pokemonName}의 ${versionInfo.getVersionGroups?.[versionInfo.getVersionGroups.length - 1].nameKo} 시리즈부터 ${versionInfo.getVersionGroups?.[0].nameKo} 시리즈까지 습득 가능한 모든 기술을 확인하고 다양한 포켓몬의 정보를 확인해보세요!`

  const canonicalUrl = `https://poke-korea.com/detail/${pokemonId}/moves`

  return {
    title,
    description,
    robots: getRobotsConfig(),
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      locale: 'ko_KR',
      images: [
        {
          url: 'https://poke-korea.com/assets/image/ogImage.png',
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
      siteName: '포케 코리아',
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

const DetailMovesPage = async ({
  params,
  searchParams,
}: DetailMovesPageProps) => {
  const { pokemonId } = await params
  const {
    activeType,
    movesType = 'LEVELUP',
    activeIndex = '0',
    selectVersion,
  } = await searchParams

  // region 쿼리 파라미터가 있으면 Path 기반 URL로 리다이렉트
  if (activeType === 'region') {
    const basePath =
      activeIndex !== '0'
        ? `/detail/${pokemonId}/moves/region/${activeIndex}`
        : `/detail/${pokemonId}/moves/region`
    const versionPath = selectVersion ? `/version/${selectVersion}` : ''
    const machinePath = movesType === 'MACHINE' ? '/machine' : ''
    redirect(`${basePath}${versionPath}${machinePath}`)
  }

  // activeIndex 쿼리 파라미터가 있으면 Path 기반 URL로 리다이렉트
  if (activeIndex !== '0') {
    const basePath = `/detail/${pokemonId}/moves/form/${activeIndex}`
    const versionPath = selectVersion ? `/version/${selectVersion}` : ''
    const machinePath = movesType === 'MACHINE' ? '/machine' : ''
    redirect(`${basePath}${versionPath}${machinePath}`)
  }

  // selectVersion 또는 movesType 쿼리파라미터가 있으면 Path 기반으로 리다이렉트
  if (selectVersion || movesType !== 'LEVELUP') {
    const basePath = `/detail/${pokemonId}/moves`
    const versionPath = selectVersion ? `/version/${selectVersion}` : ''
    const machinePath = movesType === 'MACHINE' ? '/machine' : ''
    redirect(`${basePath}${versionPath}${machinePath}`)
  }

  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const {
    pokemonInfoData,
    isNormalForm,
    data,
    normalFormLearnableSkill,
    versionGroup,
    normalFormImageList,
  } = await fetchDefaultMovesQueries({
    pokemonId,
    learnMethod: LearnMethod['LEVEL_UP'],
  })

  if (!pokemonInfoData.getPokemonDetail) return

  const getPokemonLearnableData = () => {
    if (isNormalForm) {
      return {
        levelUpSkills:
          normalFormLearnableSkill?.getPokemonNormalFormLearnableSkills
            ?.levelUpSkills || [],
        machineSkills:
          normalFormLearnableSkill?.getPokemonNormalFormLearnableSkills
            ?.machineSkills || [],
      }
    } else {
      return {
        levelUpSkills: data?.getPokemonLearnableSkills?.levelUpSkills || [],
        machineSkills: data?.getPokemonLearnableSkills?.machineSkills || [],
      }
    }
  }

  const pokemonLearnableData = getPokemonLearnableData()

  const normalFormName =
    normalFormLearnableSkill?.getPokemonNormalForm?.[0].name ??
    pokemonInfoData.getPokemonDetail.name
  const pokemonName = isNormalForm
    ? normalFormName
    : pokemonInfoData.getPokemonDetail.name

  const pokemonInfoTypes = isNormalForm
    ? (normalFormLearnableSkill?.getPokemonNormalForm?.[0].types ??
      pokemonInfoData.getPokemonDetail.types)
    : pokemonInfoData.getPokemonDetail.types

  const formDataLength = isNormalForm
    ? (normalFormImageList.getPokemonNormalFormImageList?.length ?? 0)
    : 0

  const initialValue = {
    pokemonInfo: {
      name: pokemonName,
      types: pokemonInfoTypes,
      isFormChange: pokemonInfoData.getPokemonDetail.isFormChange,
      isRegionForm: pokemonInfoData.getPokemonDetail.isRegionForm,
      activeType: undefined,
    },
    versionGroup: versionGroup.getVersionGroups,
    pokemonLearnableData,
    formDataLength,
    normalFormInfo: {
      name: normalFormName,
      imagePath: normalFormLearnableSkill?.getPokemonNormalForm?.[0].imagePath,
    },
    currentVersionGroupId: undefined,
    currentMovesType: 'LEVELUP' as const,
  }

  return (
    <DetailMovesProvider {...initialValue}>
      {isMobile ? (
        <DetailMovesMobile pokemonName={pokemonName} />
      ) : (
        <DetailMovesDesktop pokemonName={pokemonName} />
      )}
    </DetailMovesProvider>
  )
}

export default DetailMovesPage
