import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, permanentRedirect, RedirectType } from 'next/navigation'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import {
  GetDetailMovesPokemonInfoDocument,
  GetPokemonLearnableSkillsDocument,
  GetPokemonNormalFormImageListDocument,
  GetPokemonNormalFormLearnableSkillsDocument,
  GetPokemonNormalFormMetadataDocument,
  GetVersionGroupsDocument,
} from '~/graphql/gqlGenerated'
import {
  GetPokemonNormalFormImageListQuery,
  GetPokemonNormalFormImageListQueryVariables,
  GetPokemonNormalFormMetadataQuery,
  GetPokemonNormalFormMetadataQueryVariables,
  LearnMethod,
  type GetDetailMovesPokemonInfoQuery,
  type GetDetailMovesPokemonInfoQueryVariables,
  type GetPokemonLearnableSkillsQuery,
  type GetPokemonLearnableSkillsQueryVariables,
  type GetPokemonNormalFormLearnableSkillsQuery,
  type GetPokemonNormalFormLearnableSkillsQueryVariables,
  type GetVersionGroupsQuery,
  type GetVersionGroupsQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import { getRobotsConfig } from '~/module/metadata.module'
import DetailMovesDesktop from '~/views/desktop/detail/detail.moves/DetailMoves.desktop'
import DetailMovesMobile from '~/views/mobile/detail/detail.moves/DetailMoves.mobile'

export const revalidate = 31536000

interface FormMovesPageProps {
  params: Promise<{ pokemonId: string; index?: string[] }>
  searchParams: Promise<{
    selectVersion?: string
    movesType?: 'LEVELUP' | 'MACHINE'
  }>
}

const parseIndexParam = (
  index?: string[],
): { activeIndex: number; isValid: boolean } => {
  if (!index || index.length === 0) {
    return { activeIndex: 0, isValid: true }
  }
  const [indexStr] = index
  const activeIndex = parseInt(indexStr, 10)
  if (isNaN(activeIndex) || activeIndex < 0 || activeIndex > 100) {
    return { activeIndex: 0, isValid: false }
  }
  if (index.length > 1) {
    return { activeIndex, isValid: false }
  }
  return { activeIndex, isValid: true }
}

export const generateMetadata = async ({
  params,
  searchParams,
}: FormMovesPageProps): Promise<Metadata> => {
  const { pokemonId, index } = await params
  const { movesType = 'LEVELUP', selectVersion } = await searchParams

  const { activeIndex, isValid } = parseIndexParam(index)
  if (!isValid) {
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

  // isFormChange가 없으면 기본 페이지로
  if (!pokemonDetail.getPokemonDetail?.isFormChange) {
    return {}
  }

  const [{ data: versionInfo }, { data: normalFormData }] = await Promise.all([
    apolloClient.query<GetVersionGroupsQuery, GetVersionGroupsQueryVariables>({
      query: GetVersionGroupsDocument,
      variables: {
        filter: {
          pokemonId: parseInt(pokemonId, 10),
          activeType: 'NORMAL',
          activeIndex,
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
        activeIndex,
      },
    }),
  ])

  const activeVersionInfo = () => {
    return selectVersion
      ? versionInfo.getVersionGroups?.find((version) => {
          return version.versionGroupId === parseInt(selectVersion, 10)
        })
      : versionInfo.getVersionGroups?.[0]
  }
  const version = activeVersionInfo()
  const pokemonName =
    normalFormData.getPokemonNormalForm?.[0]?.name?.replace('_', ' ') ??
    pokemonDetail.getPokemonDetail?.name

  const movesTypeQuery =
    movesType !== 'LEVELUP' ? `movesType=${movesType}` : undefined
  const selectVersionQuery = selectVersion
    ? `selectVersion=${selectVersion}`
    : undefined

  const queryParams = [movesTypeQuery, selectVersionQuery]
    .filter((param) => param !== undefined)
    .join('&')

  const isSingleSeries = versionInfo.getVersionGroups?.length === 1

  const title = `${pokemonName}${version ? ` ${version.generationId}세대 ${version.nameKo} 시리즈` : ''}${movesType === 'LEVELUP' ? ' 레벨업 습득' : ' 머신 습득'} 기술 정보`
  const description = isSingleSeries
    ? `${versionInfo.getVersionGroups?.[0].nameKo}시리즈에 출현한 ${pokemonName}의 모든 기술을 확인하고 다양한 포켓몬의 정보를 확인해보세요!`
    : `${pokemonName}의 ${versionInfo.getVersionGroups?.[versionInfo.getVersionGroups.length - 1].nameKo} 시리즈부터 ${versionInfo.getVersionGroups?.[0].nameKo} 시리즈까지 습득 가능한 모든 기술을 확인하고 다양한 포켓몬의 정보를 확인해보세요!`

  const pathUrl =
    activeIndex > 0
      ? `/detail/${pokemonId}/moves/form/${activeIndex}`
      : `/detail/${pokemonId}/moves/form`
  const canonicalUrl = `https://poke-korea.com${pathUrl}${queryParams ? `?${queryParams}` : ''}`

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

const FormMovesPage = async ({ params, searchParams }: FormMovesPageProps) => {
  const { pokemonId, index } = await params
  const { movesType = 'LEVELUP', selectVersion } = await searchParams

  const { activeIndex, isValid } = parseIndexParam(index)
  if (!isValid) {
    notFound()
  }

  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const apolloClient = initializeApollo()

  const { data: pokemonInfoData } = await apolloClient.query<
    GetDetailMovesPokemonInfoQuery,
    GetDetailMovesPokemonInfoQueryVariables
  >({
    query: GetDetailMovesPokemonInfoDocument,
    variables: {
      pokemonId,
    },
    fetchPolicy: 'cache-first',
  })

  // isFormChange가 없으면 기본 moves 페이지로 리다이렉트
  if (
    !pokemonInfoData.getPokemonDetail ||
    !pokemonInfoData.getPokemonDetail.isFormChange
  ) {
    const queryParams = []
    if (movesType !== 'LEVELUP') queryParams.push(`movesType=${movesType}`)
    if (selectVersion) queryParams.push(`selectVersion=${selectVersion}`)
    const queryString =
      queryParams.length > 0 ? `?${queryParams.join('&')}` : ''
    permanentRedirect(
      `/detail/${pokemonId}/moves${queryString}`,
      RedirectType.replace,
    )
  }

  const [
    { data },
    { data: normalFormLearnableSkill },
    { data: versionGroup },
    { data: normalFormImageList },
  ] = await Promise.all([
    activeIndex === 0
      ? apolloClient.query<
          GetPokemonLearnableSkillsQuery,
          GetPokemonLearnableSkillsQueryVariables
        >({
          query: GetPokemonLearnableSkillsDocument,
          variables: {
            filter: {
              pokemonId: parseInt(pokemonId, 10),
              ...(selectVersion && {
                versionGroupId: parseInt(selectVersion, 10),
              }),
              learnMethod:
                movesType === 'LEVELUP'
                  ? LearnMethod['LEVEL_UP']
                  : LearnMethod['MACHINE'],
            },
          },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
    activeIndex > 0
      ? apolloClient.query<
          GetPokemonNormalFormLearnableSkillsQuery,
          GetPokemonNormalFormLearnableSkillsQueryVariables
        >({
          query: GetPokemonNormalFormLearnableSkillsDocument,
          variables: {
            filter: {
              pokemonId: parseInt(pokemonId, 10),
              ...(selectVersion && {
                versionGroupId: parseInt(selectVersion, 10),
              }),
              formIndex: activeIndex,
              learnMethod:
                movesType === 'LEVELUP'
                  ? LearnMethod['LEVEL_UP']
                  : LearnMethod['MACHINE'],
            },
            pokemonId: parseInt(pokemonId, 10),
            activeIndex,
          },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
    apolloClient.query<GetVersionGroupsQuery, GetVersionGroupsQueryVariables>({
      query: GetVersionGroupsDocument,
      variables: {
        filter: {
          pokemonId: parseInt(pokemonId, 10),
          activeType: 'NORMAL',
          activeIndex,
        },
      },
      fetchPolicy: 'cache-first',
    }),
    apolloClient.query<
      GetPokemonNormalFormImageListQuery,
      GetPokemonNormalFormImageListQueryVariables
    >({
      query: GetPokemonNormalFormImageListDocument,
      variables: {
        pokemonId: parseInt(pokemonId, 10),
      },
      fetchPolicy: 'cache-first',
    }),
  ])

  const getPokemonLearnableData = () => {
    if (activeIndex > 0) {
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
    normalFormLearnableSkill?.getPokemonNormalForm?.[0]?.name ??
    pokemonInfoData.getPokemonDetail.name
  const pokemonName =
    activeIndex > 0 ? normalFormName : pokemonInfoData.getPokemonDetail.name

  const pokemonInfoTypes =
    activeIndex > 0
      ? (normalFormLearnableSkill?.getPokemonNormalForm?.[0]?.types ??
        pokemonInfoData.getPokemonDetail.types)
      : pokemonInfoData.getPokemonDetail.types

  const formDataLength = normalFormImageList.getPokemonNormalFormImageList
    ?.length
    ? normalFormImageList.getPokemonNormalFormImageList.length
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
      imagePath: normalFormLearnableSkill?.getPokemonNormalForm?.[0]?.imagePath,
    },
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

export default FormMovesPage
