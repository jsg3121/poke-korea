import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import MobileTabBar from '~/components/MobileTabBar'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { LearnMethod } from '~/graphql/typeGenerated'
import { detectUserAgent } from '~/module/device.module'
import {
  DEFAULT_LEARN_METHOD,
  VISIBLE_LEARN_METHODS,
  parseLearnMethodSlug,
} from '~/module/movesParams.module'
import DetailMovesView from '~/views/detail/DetailMoves.view'
import { fetchLearnsetQueries } from '../_fetch/learnset.fetch'
import { generateMovesMetadata } from '../_metadata/generateMovesMetadata'

export const revalidate = 31536000

/**
 * 습득법별 습득 기술 페이지 — /detail/{id}/moves/{machine|egg|tutor}
 *
 * 기존엔 습득법마다 라우트 파일이 필요해(machine/page.tsx) 알 기술·기술 가르침을
 * 추가하려면 파일을 계속 늘려야 했다. 동적 세그먼트로 통합해 슬러그 매핑
 * (movesParams.module)에만 값을 추가하면 라우트가 따라오게 한다.
 *
 * 레벨업은 슬러그 없는 기본 경로(/moves)라 이 라우트에 오지 않는다 — 오더라도
 * notFound()로 막아 같은 내용이 두 URL에 중복 노출되는 것을 방지한다.
 */

interface MethodMovesPageProps {
  params: Promise<{ pokemonId: string; method: string }>
}

/** 슬러그를 노출 대상 습득법으로 해석. 노출 대상이 아니면 undefined */
const resolveVisibleMethod = (slug: string): LearnMethod | undefined => {
  const method = parseLearnMethodSlug(slug)

  // 기본 습득법(레벨업)은 /moves가 담당하므로 이 라우트에서 제외한다
  if (!method || method === DEFAULT_LEARN_METHOD) return undefined

  return VISIBLE_LEARN_METHODS.includes(method) ? method : undefined
}

export const generateMetadata = async ({
  params,
}: MethodMovesPageProps): Promise<Metadata> => {
  const { pokemonId, method: slug } = await params
  const learnMethod = resolveVisibleMethod(slug)

  if (!learnMethod) return {}

  return generateMovesMetadata({
    pokemonId,
    movesType: learnMethod === LearnMethod.MACHINE ? 'MACHINE' : 'LEVELUP',
    canonicalPath: `/detail/${pokemonId}/moves/${slug}`,
  })
}

const MethodMovesPage = async ({ params }: MethodMovesPageProps) => {
  const { pokemonId, method: slug } = await params
  const learnMethod = resolveVisibleMethod(slug)

  if (!learnMethod) {
    notFound()
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

  if (!pokemonInfoData.getPokemonDetail) {
    notFound()
  }

  const pokemonDetail = pokemonInfoData.getPokemonDetail

  // 폼체인지 포켓몬은 폼 전환 UI가 폼 개수를 알아야 한다
  const formDataLength = pokemonDetail.isFormChange
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

export default MethodMovesPage
