import { Metadata } from 'next'
import {
  notFound,
  permanentRedirect,
  redirect,
  RedirectType,
} from 'next/navigation'

import { LearnMethod, PokemonFormType } from '~/graphql/typeGenerated'
import { buildMovesPath, parseFormSegments } from '~/modules/movesParams.module'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import DetailMoves from '~/views/detail/DetailMoves.view'

import { fetchDefaultMovesMetadata } from '../../_fetch/defaultMovesMetadata.fetch'
import { fetchLearnsetQueries } from '../../_fetch/learnset.fetch'
import { fetchLearnMethodCounts } from '../../_metadata/fetchLearnMethodCounts'
import { generateFormMovesMetadata } from '../../_metadata/generateFormMovesMetadata'

export const revalidate = 31536000

interface FormMovesPageProps {
  params: Promise<{ pokemonId: string; index?: string[] }>
  searchParams: Promise<{
    selectVersion?: string
    movesType?: 'LEVELUP' | 'MACHINE'
  }>
}

export const generateMetadata = async ({
  params,
  searchParams,
}: FormMovesPageProps): Promise<Metadata> => {
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

  const [{ pokemonDetail, versionInfo, normalFormData }, methodCounts] =
    await Promise.all([
      fetchDefaultMovesMetadata({
        pokemonId,
        activeIndex,
        activeType: 'NORMAL',
      }),
      fetchLearnMethodCounts({
        pokemonId,
        learnMethod,
        versionGroupId,
        formType: PokemonFormType.NORMAL_FORM,
        formIndex: activeIndex,
      }),
    ])

  if (!pokemonDetail.getPokemonDetail?.isFormChange) {
    return {}
  }

  const version = versionGroupId
    ? versionInfo.getVersionGroups?.find(
        (v) => v.versionGroupId === versionGroupId,
      )
    : versionInfo.getVersionGroups?.[0]

  const pokemonName =
    normalFormData.getPokemonNormalForm?.[0]?.name ??
    pokemonDetail.getPokemonDetail?.name

  const canonicalUrl = `https://poke-korea.com${buildMovesPath({
    pokemonId,
    activeIndex,
    versionGroupId,
    learnMethod,
  })}`

  return generateFormMovesMetadata({
    pokemonName: pokemonName ?? '',
    methodLabel: methodCounts.methodLabel,
    skillCount: methodCounts.skillCount,
    canonicalUrl,
    version,
    versionGroups: versionInfo.getVersionGroups,
  })
}

const FormMovesPage = async ({ params, searchParams }: FormMovesPageProps) => {
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

  const fetchResult = await fetchLearnsetQueries({
    pokemonId,
    formType: PokemonFormType.NORMAL_FORM,
    formIndex: activeIndex,
    versionGroupId,
  })

  const { pokemonInfoData } = fetchResult

  if (
    !pokemonInfoData.getPokemonDetail ||
    !pokemonInfoData.getPokemonDetail.isFormChange
  ) {
    permanentRedirect(
      buildMovesPath({
        pokemonId,
        versionGroupId,
        learnMethod,
      }),
      RedirectType.replace,
    )
  }

  const {
    learnset,
    versionGroups,
    formImageList,
    formInfo,
    learnMethodLabels,
  } = fetchResult

  const normalFormName = formInfo?.name ?? pokemonInfoData.getPokemonDetail.name
  const pokemonName =
    activeIndex > 0 ? normalFormName : pokemonInfoData.getPokemonDetail.name

  const pokemonInfoTypes =
    activeIndex > 0
      ? (formInfo?.types ?? pokemonInfoData.getPokemonDetail.types)
      : pokemonInfoData.getPokemonDetail.types

  const formDataLength =
    formImageList?.getPokemonNormalFormImageList?.length ?? 0

  const initialValue = {
    pokemonInfo: {
      name: pokemonName,
      types: pokemonInfoTypes,
      isFormChange: pokemonInfoData.getPokemonDetail.isFormChange,
      isRegionForm: pokemonInfoData.getPokemonDetail.isRegionForm,
      activeType: undefined,
    },
    versionGroup: versionGroups,
    skillsByMethod: learnset?.skillsByMethod ?? [],
    formDataLength,
    normalFormInfo: {
      name: normalFormName,
      imagePath: formInfo?.imagePath,
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

export default FormMovesPage
