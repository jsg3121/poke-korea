import { Metadata } from 'next'
import { headers } from 'next/headers'
import {
  notFound,
  permanentRedirect,
  redirect,
  RedirectType,
} from 'next/navigation'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import { detectUserAgent } from '~/module/device.module'
import { getRobotsConfig } from '~/module/metadata.module'
import { buildMovesPath, parseFormSegments } from '~/module/movesParams.module'
import DetailMovesDesktop from '~/views/desktop/detail/detail.moves/DetailMoves.desktop'
import DetailMovesMobile from '~/views/mobile/detail/detail.moves/DetailMoves.mobile'
import { fetchFormMovesQueries } from '../../_fetch/formMoves.fetch'
import { fetchDefaultMovesMetadata } from '../../_fetch/defaultMovesMetadata.fetch'

export const revalidate = 31536000

interface FormMovesPageProps {
  params: Promise<{ pokemonId: string; segments?: string[] }>
  searchParams: Promise<{
    selectVersion?: string
    movesType?: 'LEVELUP' | 'MACHINE'
  }>
}

export const generateMetadata = async ({
  params,
  searchParams,
}: FormMovesPageProps): Promise<Metadata> => {
  const { pokemonId, segments } = await params
  const { movesType: legacyMovesType, selectVersion: legacySelectVersion } =
    await searchParams

  // 레거시 쿼리파라미터가 있으면 메타데이터 생성 스킵 (리다이렉트됨)
  if (legacyMovesType || legacySelectVersion) {
    return {}
  }

  const { activeIndex, versionGroupId, movesType, isValid } =
    parseFormSegments(segments)
  if (!isValid) {
    return {}
  }

  const { pokemonDetail, versionInfo, normalFormData } =
    await fetchDefaultMovesMetadata({
      pokemonId,
      activeIndex,
      activeType: 'NORMAL',
    })

  if (!pokemonDetail.getPokemonDetail?.isFormChange) {
    return {}
  }

  const version = versionGroupId
    ? versionInfo.getVersionGroups?.find(
        (v) => v.versionGroupId === versionGroupId,
      )
    : versionInfo.getVersionGroups?.[0]

  const pokemonName =
    normalFormData.getPokemonNormalForm?.[0]?.name?.replace('_', ' ') ??
    pokemonDetail.getPokemonDetail?.name

  const isSingleSeries = versionInfo.getVersionGroups?.length === 1

  const title = `${pokemonName}${version ? ` ${version.generationId}세대 ${version.nameKo} 시리즈` : ''}${movesType === 'LEVELUP' ? ' 레벨업 습득' : ' 머신 습득'} 기술 정보`
  const description = isSingleSeries
    ? `${versionInfo.getVersionGroups?.[0].nameKo}시리즈에 출현한 ${pokemonName}의 모든 기술을 확인하고 다양한 포켓몬의 정보를 확인해보세요!`
    : `${pokemonName}의 ${versionInfo.getVersionGroups?.[versionInfo.getVersionGroups.length - 1].nameKo} 시리즈부터 ${versionInfo.getVersionGroups?.[0].nameKo} 시리즈까지 습득 가능한 모든 기술을 확인하고 다양한 포켓몬의 정보를 확인해보세요!`

  const canonicalUrl = `https://poke-korea.com${buildMovesPath({
    pokemonId,
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

const FormMovesPage = async ({ params, searchParams }: FormMovesPageProps) => {
  const { pokemonId, segments } = await params
  const { movesType: legacyMovesType, selectVersion: legacySelectVersion } =
    await searchParams

  // 레거시 쿼리파라미터가 있으면 Path 기반으로 리다이렉트
  if (legacyMovesType || legacySelectVersion) {
    // 기존 segments에서 activeIndex만 추출
    const firstSegment = segments?.[0]
    const legacyIndex =
      firstSegment && firstSegment !== 'version' && firstSegment !== 'machine'
        ? parseInt(firstSegment, 10)
        : 0
    const resolvedMovesType = legacyMovesType ?? 'LEVELUP'
    redirect(
      buildMovesPath({
        pokemonId,
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

  const fetchResult = await fetchFormMovesQueries({
    pokemonId,
    activeIndex,
    versionGroupId,
    movesType,
  })

  const { pokemonInfoData } = fetchResult

  // isFormChange가 없으면 기본 moves 페이지로 리다이렉트
  if (
    !pokemonInfoData.getPokemonDetail ||
    !pokemonInfoData.getPokemonDetail.isFormChange
  ) {
    permanentRedirect(
      buildMovesPath({
        pokemonId,
        versionGroupId,
        movesType,
      }),
      RedirectType.replace,
    )
  }

  const { data, normalFormLearnableSkill, versionGroup, normalFormImageList } =
    fetchResult

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

  const formDataLength = normalFormImageList?.getPokemonNormalFormImageList
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
    versionGroup: versionGroup?.getVersionGroups,
    pokemonLearnableData,
    formDataLength,
    normalFormInfo: {
      name: normalFormName,
      imagePath: normalFormLearnableSkill?.getPokemonNormalForm?.[0]?.imagePath,
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

export default FormMovesPage
