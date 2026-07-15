import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import MobileTabBar from '~/components/MobileTabBar'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { detectUserAgent } from '~/module/device.module'
import { buildMovesPath, parseFormSegments } from '~/module/movesParams.module'
import DetailMovesView from '~/views/detail/DetailMoves.view'
import { fetchRegionMovesQueries } from '../../_fetch/regionMoves.fetch'
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

  const { activeIndex, versionGroupId, movesType, isValid } =
    parseFormSegments(segments)
  if (!isValid) {
    return {}
  }

  const { pokemonInfoData, regionFormLearnableSkill, versionGroup } =
    await fetchRegionMovesQueries({
      pokemonId,
      activeIndex,
      versionGroupId,
      movesType,
    })

  if (!pokemonInfoData.getPokemonDetail?.isRegionForm) {
    return {}
  }

  const version = versionGroupId
    ? versionGroup?.getVersionGroups?.find(
        (v) => v.versionGroupId === versionGroupId,
      )
    : versionGroup?.getVersionGroups?.[0]

  const regionFormSuffixText = `${regionFormLearnableSkill ? ` ${regionFormLearnableSkill.getPokemonRegionForm?.[activeIndex]?.region}의 모습` : ''} ${regionFormLearnableSkill?.getPokemonRegionForm?.[activeIndex]?.name ? `(${regionFormLearnableSkill.getPokemonRegionForm?.[activeIndex]?.name})` : ''}`
  const pokemonName = `${pokemonInfoData.getPokemonDetail?.name}${regionFormSuffixText}`

  const canonicalUrl = `https://poke-korea.com${buildMovesPath({
    pokemonId,
    activeType: 'region',
    activeIndex,
    versionGroupId,
    movesType,
  })}`

  return generateRegionMovesMetadata({
    pokemonName,
    movesType,
    canonicalUrl,
    version,
    versionGroups: versionGroup?.getVersionGroups,
  })
}

const RegionMovesPage = async ({
  params,
  searchParams,
}: RegionMovesPageProps) => {
  const { pokemonId, index: segments } = await params
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

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const { pokemonInfoData, regionFormLearnableSkill, versionGroup } =
    await fetchRegionMovesQueries({
      pokemonId,
      activeIndex,
      versionGroupId,
      movesType,
    })

  if (
    !pokemonInfoData.getPokemonDetail ||
    !pokemonInfoData.getPokemonDetail.isRegionForm
  ) {
    notFound()
  }

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
    versionGroup: versionGroup?.getVersionGroups,
    pokemonLearnableData,
    formDataLength,
    normalFormInfo: {
      name: pokemonName,
      imagePath: undefined,
    },
    currentActiveIndex: activeIndex,
    currentVersionGroupId: versionGroupId,
    currentMovesType: movesType,
  }

  return (
    <DetailMovesProvider {...initialValue}>
      {/* 콘텐츠는 반응형 단일(DetailMovesView, ADR-0007). UA 분기는 전역 크롬
          (헤더/푸터/탭바) 선택으로만 남는다(홈·리스트·상세 개편과 동일 패턴). */}
      {isMobile ? (
        <main className="min-h-screen w-full">
          <MobileHeaderContainer />
          <DetailMovesView pokemonName={pokemonName} />
          <MobileFooterContainer />
          <MobileTabBar />
        </main>
      ) : (
        // pt-30(120px) = 데스크톱 fixed 헤더 실높이(리스트 개편에서 실측 확정)
        <main className="min-h-screen w-full pt-30">
          <DesktopHeaderContainer />
          <DetailMovesView pokemonName={pokemonName} />
          <DesktopFooterContainer />
        </main>
      )}
    </DetailMovesProvider>
  )
}

export default RegionMovesPage
