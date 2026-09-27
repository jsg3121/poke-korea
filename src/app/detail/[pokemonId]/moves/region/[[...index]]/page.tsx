import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { LearnMethod, PokemonFormType } from '~/graphql/typeGenerated'
import { buildMovesPath, parseFormSegments } from '~/modules/movesParams.module'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import DetailMoves from '~/views/detail/DetailMoves.view'

import { fetchLearnsetQueries } from '../../_fetch/learnset.fetch'
import { fetchLearnMethodCounts } from '../../_metadata/fetchLearnMethodCounts'
import { generateRegionMovesMetadata } from '../../_metadata/generateFormMovesMetadata'

export const revalidate = 31536000

interface RegionMovesPageProps {
  params: Promise<{ pokemonId: string; index?: string[] }>
  searchParams: Promise<{
    selectVersion?: string
    movesType?: 'LEVELUP' | 'MACHINE'
  }>
}

export const generateMetadata = async ({
  params,
  searchParams,
}: RegionMovesPageProps): Promise<Metadata> => {
  const { pokemonId, index: segments } = await params
  const { movesType: legacyMovesType, selectVersion: legacySelectVersion } =
    await searchParams

  if (legacyMovesType || legacySelectVersion) {
    return {}
  }

  const { activeIndex, versionGroupId, learnMethod, isValid } =
    parseFormSegments(segments)
  if (!isValid) {
    return {}
  }

  const [{ pokemonInfoData, versionGroups, regionForms }, methodCounts] =
    await Promise.all([
      fetchLearnsetQueries({
        pokemonId,
        formType: PokemonFormType.REGION_FORM,
        formIndex: activeIndex,
        versionGroupId,
      }),
      fetchLearnMethodCounts({
        pokemonId,
        learnMethod,
        versionGroupId,
        formType: PokemonFormType.REGION_FORM,
        formIndex: activeIndex,
      }),
    ])

  if (!pokemonInfoData.getPokemonDetail?.isRegionForm) {
    return {}
  }

  const version = versionGroupId
    ? versionGroups?.find((v) => v.versionGroupId === versionGroupId)
    : versionGroups?.[0]

  const activeRegionForm = regionForms?.[activeIndex]
  const pokemonName =
    activeRegionForm?.name || pokemonInfoData.getPokemonDetail?.name || ''

  const canonicalUrl = `https://poke-korea.com${buildMovesPath({
    pokemonId,
    activeType: 'region',
    activeIndex,
    versionGroupId,
    learnMethod,
  })}`

  return generateRegionMovesMetadata({
    pokemonName,
    methodLabel: methodCounts.methodLabel,
    skillCount: methodCounts.skillCount,
    canonicalUrl,
    version,
    versionGroups,
  })
}

const RegionMovesPage = async ({
  params,
  searchParams,
}: RegionMovesPageProps) => {
  const { pokemonId, index: segments } = await params
  const { movesType: legacyMovesType, selectVersion: legacySelectVersion } =
    await searchParams

  if (legacyMovesType || legacySelectVersion) {
    const firstSegment = segments?.[0]
    const legacyIndex =
      firstSegment && firstSegment !== 'version' && firstSegment !== 'machine'
        ? parseInt(firstSegment, 10)
        : 0
    const resolvedLearnMethod =
      legacyMovesType === 'MACHINE' ? LearnMethod.MACHINE : LearnMethod.LEVEL_UP
    redirect(
      buildMovesPath({
        pokemonId,
        activeType: 'region',
        activeIndex: isNaN(legacyIndex) ? 0 : legacyIndex,
        versionGroupId: legacySelectVersion
          ? parseInt(legacySelectVersion, 10)
          : undefined,
        learnMethod: resolvedLearnMethod,
      }),
    )
  }

  const { activeIndex, versionGroupId, learnMethod, isValid } =
    parseFormSegments(segments)
  if (!isValid) {
    notFound()
  }

  const {
    pokemonInfoData,
    learnset,
    versionGroups,
    regionForms,
    learnMethodLabels,
  } = await fetchLearnsetQueries({
    pokemonId,
    formType: PokemonFormType.REGION_FORM,
    formIndex: activeIndex,
    versionGroupId,
  })

  if (
    !pokemonInfoData.getPokemonDetail ||
    !pokemonInfoData.getPokemonDetail.isRegionForm
  ) {
    notFound()
  }

  const activeRegionForm = regionForms?.[activeIndex]
  const pokemonName =
    activeRegionForm?.name || pokemonInfoData.getPokemonDetail.name

  const pokemonInfoTypes =
    activeRegionForm?.types ?? pokemonInfoData.getPokemonDetail.types

  const formDataLength = regionForms?.length ?? 0

  const initialValue = {
    pokemonInfo: {
      name: pokemonName,
      types: pokemonInfoTypes,
      isFormChange: pokemonInfoData.getPokemonDetail.isFormChange,
      isRegionForm: pokemonInfoData.getPokemonDetail.isRegionForm,
      activeType: 'region' as const,
    },
    versionGroup: versionGroups,
    skillsByMethod: learnset?.skillsByMethod ?? [],
    formDataLength,
    normalFormInfo: {
      name: pokemonName,
      imagePath: undefined,
    },
    currentActiveIndex: activeIndex,
    currentVersionGroupId: versionGroupId,
    currentLearnMethod: learnMethod,
    learnMethodLabels,
  }

  return (
    <DetailMovesProvider {...initialValue}>
      <DetailMoves pokemonName={pokemonName} />
    </DetailMovesProvider>
  )
}

export default RegionMovesPage
