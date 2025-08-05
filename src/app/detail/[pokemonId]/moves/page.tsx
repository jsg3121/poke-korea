import { headers } from 'next/headers'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import {
  GetDetailMovesPokemonInfoDocument,
  GetPokemonLearnableSkillsDocument,
  GetPokemonNormalFormLearnableSkillsDocument,
  GetPokemonRegionFormLearnableSkillsDocument,
} from '~/graphql/gqlGenerated'
import type {
  GetDetailMovesPokemonInfoQuery,
  GetDetailMovesPokemonInfoQueryVariables,
  GetPokemonLearnableSkillsQuery,
  GetPokemonLearnableSkillsQueryVariables,
  GetPokemonNormalFormLearnableSkillsQuery,
  GetPokemonNormalFormLearnableSkillsQueryVariables,
  GetPokemonRegionFormLearnableSkillsQuery,
  GetPokemonRegionFormLearnableSkillsQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import DetailMovesDesktop from '~/views/desktop/detail/detail.moves/DetailMoves.desktop'

export const revalidate = 31536000 // 24시간마다 재생성

interface DetailMovesPageProps {
  params: Promise<{ pokemonId: string }>
  searchParams: Promise<{
    activeType?: 'region' | 'normalForm'
    activeIndex?: string
  }>
}

const DetailMovesPage = async ({
  params,
  searchParams,
}: DetailMovesPageProps) => {
  const { pokemonId } = await params
  const { activeType, activeIndex = '0' } = await searchParams
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

  const isNormalForm = !!pokemonInfoData.getPokemonDetail?.isFormChange

  const [
    { data },
    { data: regionFormLearnableSkill },
    { data: normalFormLearnableSkill },
  ] = await Promise.all([
    activeType !== 'region' && !isNormalForm
      ? apolloClient.query<
          GetPokemonLearnableSkillsQuery,
          GetPokemonLearnableSkillsQueryVariables
        >({
          query: GetPokemonLearnableSkillsDocument,
          variables: {
            filter: {
              pokemonNumber: parseInt(pokemonId, 10),
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
            },
            pokemonId: parseInt(pokemonId, 10),
          },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
  ])

  if (!pokemonInfoData.getPokemonDetail) return

  const getPokemonLearnableData = () => {
    switch (activeType) {
      case 'region': {
        return regionFormLearnableSkill?.getPokemonRegionFormLearnableSkills?.[
          parseInt(activeIndex, 10)
        ].learnableSkills?.map((learnableData) => {
          return {
            versionGroup: learnableData.versionGroup,
            levelUpSkills: learnableData.levelUpSkills ?? [],
            machineSkills: learnableData.machineSkills ?? [],
          }
        })
      }
      default: {
        if (isNormalForm) {
          return normalFormLearnableSkill?.getPokemonNormalFormLearnableSkills?.[
            parseInt(activeIndex, 10)
          ].learnableSkills?.map((learnableData) => {
            return {
              versionGroup: learnableData.versionGroup,
              levelUpSkills: learnableData.levelUpSkills ?? [],
              machineSkills: learnableData.machineSkills ?? [],
            }
          })
        } else {
          return data?.getPokemonLearnableSkills?.map((learnableData) => {
            return {
              versionGroup: learnableData.versionGroup,
              levelUpSkills: learnableData.levelUpSkills ?? [],
              machineSkills: learnableData.machineSkills ?? [],
            }
          })
        }
      }
    }
  }

  const pokemonLearnableData = getPokemonLearnableData() ?? []

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
        <DetailMovesDesktop pokemonName={pokemonName} />
      ) : (
        <DetailMovesDesktop pokemonName={pokemonName} />
      )}
    </DetailMovesProvider>
  )
}

export default DetailMovesPage
