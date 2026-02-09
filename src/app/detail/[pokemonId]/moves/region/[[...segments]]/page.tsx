import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import {
  GetDetailMovesPokemonInfoDocument,
  GetPokemonRegionFormLearnableSkillsDocument,
  GetVersionGroupsDocument,
} from '~/graphql/gqlGenerated'
import {
  LearnMethod,
  type GetDetailMovesPokemonInfoQuery,
  type GetDetailMovesPokemonInfoQueryVariables,
  type GetPokemonRegionFormLearnableSkillsQuery,
  type GetPokemonRegionFormLearnableSkillsQueryVariables,
  type GetVersionGroupsQuery,
  type GetVersionGroupsQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import { getRobotsConfig } from '~/module/metadata.module'
import { buildMovesPath, parseFormSegments } from '~/module/movesParams.module'
import DetailMovesDesktop from '~/views/desktop/detail/detail.moves/DetailMoves.desktop'
import DetailMovesMobile from '~/views/mobile/detail/detail.moves/DetailMoves.mobile'

export const revalidate = 31536000

interface RegionMovesPageProps {
  params: Promise<{ pokemonId: string; segments?: string[] }>
  searchParams: Promise<{
    selectVersion?: string
    movesType?: 'LEVELUP' | 'MACHINE'
  }>
}

export const generateMetadata = async ({
  params,
  searchParams,
}: RegionMovesPageProps): Promise<Metadata> => {
  const { pokemonId, segments } = await params
  const { movesType: legacyMovesType, selectVersion: legacySelectVersion } =
    await searchParams

  if (legacyMovesType || legacySelectVersion) {
    return {}
  }

  const { activeIndex, versionGroupId, movesType, isValid } =
    parseFormSegments(segments)
  if (!isValid) {
    return {}
  }

  const apolloClient = initializeApollo()

  const { data: pokemonDetail } = await apolloClient.query<
    GetDetailMovesPokemonInfoQuery,
    GetDetailMovesPokemonInfoQueryVariables
  >({
    query: GetDetailMovesPokemonInfoDocument,
    variables: { pokemonId },
    fetchPolicy: 'cache-first',
  })

  if (!pokemonDetail.getPokemonDetail?.isRegionForm) {
    return {}
  }

  const [{ data: versionInfo }, { data: regionFormData }] = await Promise.all([
    apolloClient.query<GetVersionGroupsQuery, GetVersionGroupsQueryVariables>({
      query: GetVersionGroupsDocument,
      variables: {
        filter: {
          pokemonId: parseInt(pokemonId, 10),
          activeType: 'REGION',
          activeIndex,
        },
      },
      fetchPolicy: 'cache-first',
    }),
    apolloClient.query<
      GetPokemonRegionFormLearnableSkillsQuery,
      GetPokemonRegionFormLearnableSkillsQueryVariables
    >({
      query: GetPokemonRegionFormLearnableSkillsDocument,
      variables: {
        filter: {
          pokemonId: parseInt(pokemonId, 10),
          formIndex: activeIndex,
          learnMethod:
            movesType === 'LEVELUP'
              ? LearnMethod['LEVEL_UP']
              : LearnMethod['MACHINE'],
          ...(versionGroupId && { versionGroupId }),
        },
        pokemonId: parseInt(pokemonId, 10),
      },
      fetchPolicy: 'cache-first',
    }),
  ])

  const version = versionGroupId
    ? versionInfo.getVersionGroups?.find(
        (v) => v.versionGroupId === versionGroupId,
      )
    : versionInfo.getVersionGroups?.[0]

  const regionFormSuffixText = `${regionFormData ? ` ${regionFormData.getPokemonRegionForm?.[activeIndex]?.region}의 모습` : ''} ${regionFormData.getPokemonRegionForm?.[activeIndex]?.name ? `(${regionFormData.getPokemonRegionForm?.[activeIndex]?.name})` : ''}`
  const pokemonName = `${pokemonDetail.getPokemonDetail?.name}${regionFormSuffixText}`

  const isSingleSeries = versionInfo.getVersionGroups?.length === 1

  const title = `${pokemonName} 리전폼${version ? ` ${version.generationId}세대 ${version.nameKo} 시리즈` : ''}${movesType === 'LEVELUP' ? ' 레벨업 습득' : ' 머신 습득'} 기술 정보`
  const description = isSingleSeries
    ? `${versionInfo.getVersionGroups?.[0].nameKo}시리즈에 출현한 ${pokemonName}의 모든 기술을 확인하고 다양한 포켓몬의 정보를 확인해보세요!`
    : `${pokemonName}의 ${versionInfo.getVersionGroups?.[versionInfo.getVersionGroups.length - 1].nameKo} 시리즈부터 ${versionInfo.getVersionGroups?.[0].nameKo} 시리즈까지 습득 가능한 모든 기술을 확인하고 다양한 포켓몬의 정보를 확인해보세요!`

  const canonicalUrl = `https://poke-korea.com${buildMovesPath({
    pokemonId,
    activeType: 'region',
    activeIndex,
    versionGroupId,
    movesType,
  })}`

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

const RegionMovesPage = async ({
  params,
  searchParams,
}: RegionMovesPageProps) => {
  const { pokemonId, segments } = await params
  const { movesType: legacyMovesType, selectVersion: legacySelectVersion } =
    await searchParams

  // 레거시 쿼리파라미터가 있으면 Path 기반으로 리다이렉트
  if (legacyMovesType || legacySelectVersion) {
    const firstSegment = segments?.[0]
    const legacyIndex =
      firstSegment && firstSegment !== 'version' && firstSegment !== 'machine'
        ? parseInt(firstSegment, 10)
        : 0
    const resolvedMovesType = legacyMovesType ?? 'LEVELUP'
    redirect(
      buildMovesPath({
        pokemonId,
        activeType: 'region',
        activeIndex: isNaN(legacyIndex) ? 0 : legacyIndex,
        versionGroupId: legacySelectVersion
          ? parseInt(legacySelectVersion, 10)
          : undefined,
        movesType: resolvedMovesType,
      }),
    )
  }

  const { activeIndex, versionGroupId, movesType, isValid } =
    parseFormSegments(segments)
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
    variables: { pokemonId },
    fetchPolicy: 'cache-first',
  })

  if (
    !pokemonInfoData.getPokemonDetail ||
    !pokemonInfoData.getPokemonDetail.isRegionForm
  ) {
    notFound()
  }

  const [{ data: regionFormLearnableSkill }, { data: versionGroup }] =
    await Promise.all([
      apolloClient.query<
        GetPokemonRegionFormLearnableSkillsQuery,
        GetPokemonRegionFormLearnableSkillsQueryVariables
      >({
        query: GetPokemonRegionFormLearnableSkillsDocument,
        variables: {
          filter: {
            pokemonId: parseInt(pokemonId, 10),
            formIndex: activeIndex,
            learnMethod:
              movesType === 'LEVELUP'
                ? LearnMethod['LEVEL_UP']
                : LearnMethod['MACHINE'],
            ...(versionGroupId && { versionGroupId }),
          },
          pokemonId: parseInt(pokemonId, 10),
        },
        fetchPolicy: 'cache-first',
      }),
      apolloClient.query<GetVersionGroupsQuery, GetVersionGroupsQueryVariables>(
        {
          query: GetVersionGroupsDocument,
          variables: {
            filter: {
              pokemonId: parseInt(pokemonId, 10),
              activeType: 'REGION',
              activeIndex,
            },
          },
          fetchPolicy: 'cache-first',
        },
      ),
    ])

  const regionFormSuffixText = `${regionFormLearnableSkill ? ` ${regionFormLearnableSkill.getPokemonRegionForm?.[activeIndex]?.region}의 모습` : ''} ${regionFormLearnableSkill?.getPokemonRegionForm?.[activeIndex]?.name ? `(${regionFormLearnableSkill.getPokemonRegionForm?.[activeIndex]?.name})` : ''}`
  const pokemonName = `${pokemonInfoData.getPokemonDetail.name}${regionFormSuffixText}`

  const pokemonLearnableData = {
    levelUpSkills:
      regionFormLearnableSkill?.getPokemonRegionFormLearnableSkills
        ?.levelUpSkills || [],
    machineSkills:
      regionFormLearnableSkill?.getPokemonRegionFormLearnableSkills
        ?.machineSkills || [],
  }

  const pokemonInfoTypes =
    regionFormLearnableSkill?.getPokemonRegionForm?.[activeIndex]?.types ??
    pokemonInfoData.getPokemonDetail.types

  const formDataLength =
    regionFormLearnableSkill?.getPokemonRegionForm?.length ?? 0

  const initialValue = {
    pokemonInfo: {
      name: pokemonName,
      types: pokemonInfoTypes,
      isFormChange: pokemonInfoData.getPokemonDetail.isFormChange,
      isRegionForm: pokemonInfoData.getPokemonDetail.isRegionForm,
      activeType: 'region' as const,
    },
    versionGroup: versionGroup.getVersionGroups,
    pokemonLearnableData,
    formDataLength,
    normalFormInfo: {
      name: pokemonName,
      imagePath: undefined,
    },
    currentVersionGroupId: versionGroupId,
    currentMovesType: movesType,
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

export default RegionMovesPage
