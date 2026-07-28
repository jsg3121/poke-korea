import ChampionsFormatTab from '~/components/champions/ChampionsFormatTab.component'
import {
  ChampionsFormatSlug,
  getFormatIntro,
} from '~/utils/championsFormat.util'

/**
 * 챔피언스 공통 포맷 인트로 (포맷 탭 + 포맷 안내 캡션).
 *
 * 챔피언스 3화면(홈/티어/도감)은 공통 제목 헤더(PageHeaderComponent)를 쓰되,
 * champions 고유 요소인 포맷 토글(VGC/BSS)과 포맷 소개 캡션은 헤더와 분리해
 * 이 컴포넌트가 담당한다(관심사 분리, 사용자 결정 2026-07-22). 헤더 바로 아래에
 * 배치한다.
 *
 * - `suffix`로 각 화면의 포맷 탭 이동 경로를 구분한다('' | '/tier' | '/list').
 * - `showIntro`로 포맷 안내 캡션 노출을 제어한다(홈은 노출, 티어/도감은 선택).
 * - 페이지별 고유 캡션(예: 티어의 "채택 순위 기반 · 총 N종")은 이 컴포넌트가 아니라
 *   각 페이지가 별도로 렌더한다.
 */
interface ChampionsFormatIntroProps {
  formatSlug: ChampionsFormatSlug
  /** 포맷 탭 이동 경로 suffix. 예: '/tier' → /champions/vgc/tier */
  suffix?: string
  /** 포맷 안내 캡션(getFormatIntro) 노출 여부 */
  showIntro?: boolean
  /** 추가 className (외곽 마진 조정용) */
  className?: string
}

const ChampionsFormatIntro = ({
  formatSlug,
  suffix = '',
  showIntro = false,
  className = '',
}: ChampionsFormatIntroProps) => {
  return (
    <div className={className}>
      <ChampionsFormatTab
        currentFormat={formatSlug}
        basePath="/champions"
        suffix={suffix}
      />
      {showIntro && (
        <p className="mt-3 text-xs text-primary-3 leading-relaxed desktop:text-sm">
          {getFormatIntro(formatSlug)}
        </p>
      )}
    </div>
  )
}

export default ChampionsFormatIntro
