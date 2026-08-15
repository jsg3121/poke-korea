import { Metadata } from 'next'
import { headers } from 'next/headers'
import {
  notFound,
  permanentRedirect,
  redirect,
  RedirectType,
} from 'next/navigation'
import MobileTabBar from '~/components/MobileTabBar'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { detectUserAgent } from '~/module/device.module'
import { LearnMethod, PokemonFormType } from '~/graphql/typeGenerated'
import { buildMovesPath, parseFormSegments } from '~/module/movesParams.module'
import DetailMovesView from '~/views/detail/DetailMoves.view'
import { fetchDefaultMovesMetadata } from '../../_fetch/defaultMovesMetadata.fetch'
import { fetchLearnsetQueries } from '../../_fetch/learnset.fetch'
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

  // 레거시 쿼리파라미터가 있으면 메타데이터 생성 스킵 (리다이렉트됨)
  if (legacyMovesType || legacySelectVersion) {
    return {}
  }

  const { activeIndex, versionGroupId, learnMethod, isValid } =
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

  const canonicalUrl = `https://poke-korea.com${buildMovesPath({
    pokemonId,
    activeIndex,
    versionGroupId,
    learnMethod,
  })}`

  return generateFormMovesMetadata({
    pokemonName: pokemonName ?? '',
    movesType: learnMethod === LearnMethod.LEVEL_UP ? 'LEVELUP' : 'MACHINE',
    canonicalUrl,
    version,
    versionGroups: versionInfo.getVersionGroups,
  })
}

const FormMovesPage = async ({ params, searchParams }: FormMovesPageProps) => {
  const { pokemonId, index: segments } = await params
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

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const fetchResult = await fetchLearnsetQueries({
    pokemonId,
    formType: PokemonFormType.NORMAL_FORM,
    formIndex: activeIndex,
    versionGroupId,
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

  // 폼별 이름·타입은 러닝셋에 없어 폼 조회 결과를 쓴다(히트로토무 등 폼마다
  // 이름·타입이 다른 경우). 기본 폼(index 0)은 포켓몬 기본 정보를 그대로 쓴다.
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

export default FormMovesPage
