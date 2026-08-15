import { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import MobileTabBar from '~/components/MobileTabBar'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { LearnMethod } from '~/graphql/typeGenerated'
import { detectUserAgent } from '~/module/device.module'
import DetailMovesView from '~/views/detail/DetailMoves.view'
import { fetchLearnsetQueries } from './_fetch/learnset.fetch'
import { generateMovesMetadata } from './_metadata/generateMovesMetadata'

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

  return generateMovesMetadata({
    pokemonId,
    learnMethod: LearnMethod.LEVEL_UP,
    canonicalPath: `/detail/${pokemonId}/moves`,
  })
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

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const {
    pokemonInfoData,
    learnset,
    versionGroups,
    formImageList,
    learnMethodLabels,
  } = await fetchLearnsetQueries({ pokemonId })

  if (!pokemonInfoData.getPokemonDetail) return

  const pokemonDetail = pokemonInfoData.getPokemonDetail
  const isFormChange = !!pokemonDetail.isFormChange

  // 폼체인지 포켓몬은 폼 전환 UI가 폼 개수를 알아야 한다
  const formDataLength = isFormChange
    ? (formImageList.getPokemonNormalFormImageList?.length ?? 0)
    : 0

  const initialValue = {
    pokemonInfo: {
      name: pokemonDetail.name,
      types: pokemonDetail.types,
      isFormChange: pokemonDetail.isFormChange,
      isRegionForm: pokemonDetail.isRegionForm,
      activeType: undefined,
    },
    versionGroup: versionGroups,
    skillsByMethod: learnset?.skillsByMethod ?? [],
    formDataLength,
    normalFormInfo: {
      name: pokemonDetail.name,
    },
    currentActiveIndex: 0,
    currentVersionGroupId: undefined,
    currentLearnMethod: LearnMethod.LEVEL_UP,
    learnMethodLabels,
  }

  return (
    <DetailMovesProvider {...initialValue}>
      {/* 콘텐츠는 반응형 단일(DetailMovesView, ADR-0007). UA 분기는 전역 크롬
          (헤더/푸터/탭바) 선택으로만 남는다(홈·리스트·상세 개편과 동일 패턴). */}
      {isMobile ? (
        <main className="min-h-screen w-full">
          <MobileHeaderContainer />
          <DetailMovesView pokemonName={pokemonDetail.name} />
          <MobileFooterContainer />
          <MobileTabBar />
        </main>
      ) : (
        // pt-30(120px) = 데스크톱 fixed 헤더 실높이(리스트 개편에서 실측 확정)
        <main className="min-h-screen w-full pt-30">
          <DesktopHeaderContainer />
          <DetailMovesView pokemonName={pokemonDetail.name} />
          <DesktopFooterContainer />
        </main>
      )}
    </DetailMovesProvider>
  )
}

export default DetailMovesPage
