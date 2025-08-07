import { Metadata } from 'next'
import { headers } from 'next/headers'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import {
  GetDetailMovesPokemonInfoDocument,
  GetPokemonLearnableSkillsDocument,
  GetPokemonNormalFormLearnableSkillsDocument,
  GetPokemonNormalFormMetadataDocument,
  GetPokemonRegionFormLearnableSkillsDocument,
  GetVersionGroupsDocument,
} from '~/graphql/gqlGenerated'
import {
  GetPokemonNormalFormMetadataQuery,
  GetPokemonNormalFormMetadataQueryVariables,
  LearnMethod,
  type GetDetailMovesPokemonInfoQuery,
  type GetDetailMovesPokemonInfoQueryVariables,
  type GetPokemonLearnableSkillsQuery,
  type GetPokemonLearnableSkillsQueryVariables,
  type GetPokemonNormalFormLearnableSkillsQuery,
  type GetPokemonNormalFormLearnableSkillsQueryVariables,
  type GetPokemonRegionFormLearnableSkillsQuery,
  type GetPokemonRegionFormLearnableSkillsQueryVariables,
  type GetVersionGroupsQuery,
  type GetVersionGroupsQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import DetailMovesDesktop from '~/views/desktop/detail/detail.moves/DetailMoves.desktop'
import DetailMovesMobile from '~/views/mobile/detail/detail.moves/DetailMoves.mobile'

export const revalidate = 31536000 // 24시간마다 재생성

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
          ...(activeType === 'region' && {
            activeType: 'REGION',
            activeIndex: parseInt(activeIndex, 10),
          }),
          ...(isNormalForm && {
            activeType: 'NORMAL',
            activeIndex: parseInt(activeIndex, 10),
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
  const pokemonName = isNormalForm
    ? normalFormData.getPokemonNormalForm?.[
        parseInt(activeIndex, 10)
      ].name.replace('_', ' ')
    : pokemonDetail.getPokemonDetail?.name

  const activeIndexQuery =
    activeIndex !== '0' ? `activeIndex=${activeIndex}` : undefined
  const activeTypeQuery = activeType ? `activeType=${activeType}` : undefined
  const movesTypeQuery =
    movesType !== 'LEVELUP' ? `movesType=${movesType}` : undefined
  const selectVersionQuery = selectVersion
    ? `selectVersion=${selectVersion}`
    : undefined

  const queryParams = [
    activeIndexQuery,
    activeTypeQuery,
    movesTypeQuery,
    selectVersionQuery,
  ]
    .filter((param) => param !== undefined)
    .join('&')

  const title = `${pokemonName}${pokemonDetail.getPokemonDetail?.isRegionForm ? ' 리전폼' : ''}${version ? ` ${version.generationId}세대 ${version.nameKo} 시리즈` : ''}${movesType === 'LEVELUP' ? ' 레벨업 습득' : ' 머신 습득'} 기술 정보`
  const description = `${pokemonName}의 ${versionInfo.getVersionGroups?.[versionInfo.getVersionGroups.length - 1].nameKo} 시리즈부터 ${versionInfo.getVersionGroups?.[0].nameKo} 시리즈까지 습득 가능한 모든 기술을 확인하고 다른 포켓몬의 기술 정보를 확인해보세요!`
  const canonicalUrl = `https://poke-korea.com/detail/${pokemonId}${queryParams ? `?${queryParams}` : ''}`

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
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
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const apolloClient = initializeApollo()

  const [{ data: pokemonInfoData }] = await Promise.all([
    apolloClient.query<
      GetDetailMovesPokemonInfoQuery,
      GetDetailMovesPokemonInfoQueryVariables
    >({
      query: GetDetailMovesPokemonInfoDocument,
      variables: {
        pokemonId,
      },
      fetchPolicy: 'cache-first',
    }),
  ])

  const isNormalForm = !!pokemonInfoData.getPokemonDetail?.isFormChange

  const [
    { data },
    { data: regionFormLearnableSkill },
    { data: normalFormLearnableSkill },
    { data: versionGroup },
  ] = await Promise.all([
    activeType !== 'region' && !isNormalForm
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
    activeType === 'region'
      ? apolloClient.query<
          GetPokemonRegionFormLearnableSkillsQuery,
          GetPokemonRegionFormLearnableSkillsQueryVariables
        >({
          query: GetPokemonRegionFormLearnableSkillsDocument,
          variables: {
            filter: {
              pokemonId: parseInt(pokemonId, 10),
              formIndex: parseInt(activeIndex, 10),
              learnMethod:
                movesType === 'LEVELUP'
                  ? LearnMethod['LEVEL_UP']
                  : LearnMethod['MACHINE'],
              ...(selectVersion && {
                versionGroupId: parseInt(selectVersion, 10),
              }),
            },
            pokemonId: parseInt(pokemonId, 10),
          },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
    isNormalForm
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
              formIndex: parseInt(activeIndex, 10),
              learnMethod:
                movesType === 'LEVELUP'
                  ? LearnMethod['LEVEL_UP']
                  : LearnMethod['MACHINE'],
            },
            pokemonId: parseInt(pokemonId, 10),
          },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
    apolloClient.query<GetVersionGroupsQuery, GetVersionGroupsQueryVariables>({
      query: GetVersionGroupsDocument,
      variables: {
        filter: {
          pokemonId: parseInt(pokemonId, 10),
          ...(activeType === 'region' && {
            activeType: 'REGION',
            activeIndex: parseInt(activeIndex, 10),
          }),
          ...(isNormalForm && {
            activeType: 'NORMAL',
            activeIndex: parseInt(activeIndex, 10),
          }),
        },
      },
      fetchPolicy: 'cache-first',
    }),
  ])

  if (!pokemonInfoData.getPokemonDetail) return

  const getPokemonLearnableData = () => {
    switch (activeType) {
      case 'region': {
        return {
          levelUpSkills:
            regionFormLearnableSkill?.getPokemonRegionFormLearnableSkills
              ?.levelUpSkills || [],
          machineSkills:
            regionFormLearnableSkill?.getPokemonRegionFormLearnableSkills
              ?.machineSkills || [],
        }
      }
      default: {
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
    }
  }

  const pokemonLearnableData = getPokemonLearnableData()

  const regionFormSuffixText = `${regionFormLearnableSkill ? ` ${regionFormLearnableSkill.getPokemonRegionForm?.[parseInt(activeIndex, 10)].region}의 모습` : ''} ${regionFormLearnableSkill?.getPokemonRegionForm?.[parseInt(activeIndex, 10)].name ? `(${regionFormLearnableSkill.getPokemonRegionForm?.[parseInt(activeIndex, 10)].name})` : ''}`
  const normalFormName =
    normalFormLearnableSkill?.getPokemonNormalForm?.[parseInt(activeIndex, 10)]
      .name ?? pokemonInfoData.getPokemonDetail.name
  const pokemonName = isNormalForm
    ? normalFormName
    : `${pokemonInfoData.getPokemonDetail.name}${activeType === 'region' ? regionFormSuffixText : ''}`

  const pokemonInfoTypes =
    (activeType === 'region'
      ? regionFormLearnableSkill?.getPokemonRegionForm?.[
          parseInt(activeIndex, 10)
        ].types
      : isNormalForm
        ? normalFormLearnableSkill?.getPokemonNormalForm?.[
            parseInt(activeIndex, 10)
          ].types
        : pokemonInfoData.getPokemonDetail.types) ??
    pokemonInfoData.getPokemonDetail.types

  const formDataLength =
    activeType === 'region'
      ? (regionFormLearnableSkill?.getPokemonRegionForm?.length ?? 0)
      : isNormalForm
        ? (normalFormLearnableSkill?.getPokemonNormalForm?.length ?? 0)
        : 0

  const initialValue = {
    pokemonInfo: {
      name: pokemonName,
      types: pokemonInfoTypes,
      isFormChange: pokemonInfoData.getPokemonDetail.isFormChange,
      isRegionForm: pokemonInfoData.getPokemonDetail.isRegionForm,
      activeType: activeType,
    },
    versionGroup: versionGroup.getVersionGroups,
    pokemonLearnableData,
    formDataLength,
    normalFormInfo: {
      name: normalFormName,
      imagePath:
        normalFormLearnableSkill?.getPokemonNormalForm?.[
          parseInt(activeIndex, 10)
        ].imagePath,
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

export default DetailMovesPage
