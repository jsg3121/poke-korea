import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { LearnMethod } from '~/graphql/typeGenerated'
import { detectUserAgent } from '~/modules/device.module'
import {
  DEFAULT_LEARN_METHOD,
  parseLearnMethodSlug,
  VISIBLE_LEARN_METHODS,
} from '~/modules/movesParams.module'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import MobileTabBar from '~/components/MobileTabBar.component'
import DesktopFooter from '~/containers/desktop/footer/Footer.container'
import DesktopHeader from '~/containers/desktop/header/Header.container'
import MobileFooter from '~/containers/mobile/footer/Footer.container'
import MobileHeader from '~/containers/mobile/header/Header.container'
import DetailMoves from '~/views/detail/DetailMoves.view'

import { fetchLearnsetQueries } from '../../../_fetch/learnset.fetch'
import { generateMovesMetadata } from '../../../_metadata/generateMovesMetadata'

export const revalidate = 31536000

/**
 * 버전 + 습득법 지정 습득 기술 페이지
 * — /detail/{id}/moves/version/{vgId}/{machine|egg|tutor}
 *
 * 습득법 슬러그를 동적 세그먼트로 받는다(같은 층의 [method] 라우트와 동일 패턴).
 * 레벨업은 슬러그 없는 /moves/version/{vgId}가 담당하므로 여기서 제외한다.
 */

interface VersionMethodMovesPageProps {
  params: Promise<{
    pokemonId: string
    versionGroupId: string
    method: string
  }>
}

/** 슬러그를 노출 대상 습득법으로 해석. 노출 대상이 아니면 undefined */
const resolveVisibleMethod = (slug: string): LearnMethod | undefined => {
  const method = parseLearnMethodSlug(slug)

  if (!method || method === DEFAULT_LEARN_METHOD) return undefined

  return VISIBLE_LEARN_METHODS.includes(method) ? method : undefined
}

export const generateMetadata = async ({
  params,
}: VersionMethodMovesPageProps): Promise<Metadata> => {
  const { pokemonId, versionGroupId, method: slug } = await params
  const learnMethod = resolveVisibleMethod(slug)

  const parsedVersionId = parseInt(versionGroupId, 10)
  if (!learnMethod || isNaN(parsedVersionId) || parsedVersionId <= 0) {
    return {}
  }

  return generateMovesMetadata({
    pokemonId,
    learnMethod,
    versionGroupId: parsedVersionId,
    canonicalPath: `/detail/${pokemonId}/moves/version/${versionGroupId}/${slug}`,
  })
}

const VersionMethodMovesPage = async ({
  params,
}: VersionMethodMovesPageProps) => {
  const { pokemonId, versionGroupId, method: slug } = await params
  const learnMethod = resolveVisibleMethod(slug)

  const parsedVersionId = parseInt(versionGroupId, 10)
  if (!learnMethod || isNaN(parsedVersionId) || parsedVersionId <= 0) {
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
  } = await fetchLearnsetQueries({
    pokemonId,
    versionGroupId: parsedVersionId,
  })

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
    currentVersionGroupId: parsedVersionId,
    currentLearnMethod: learnMethod,
    learnMethodLabels,
  }

  return (
    <DetailMovesProvider {...initialValue}>
      {/* 콘텐츠는 반응형 단일(DetailMoves, ADR-0007). UA 분기는 전역 크롬
          (헤더/푸터/탭바) 선택으로만 남는다(홈·리스트·상세 개편과 동일 패턴). */}
      {isMobile ? (
        <main className="min-h-screen w-full">
          <MobileHeader />
          <DetailMoves pokemonName={pokemonDetail.name} />
          <MobileFooter />
          <MobileTabBar />
        </main>
      ) : (
        <main className="min-h-screen w-full">
          <DesktopHeader />
          <DetailMoves pokemonName={pokemonDetail.name} />
          <DesktopFooter />
        </main>
      )}
    </DetailMovesProvider>
  )
}

export default VersionMethodMovesPage
