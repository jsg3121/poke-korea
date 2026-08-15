'use client'

import MovesVersionNavComponent, {
  MovesVersionNavItem,
} from '~/components/moves/MovesVersionNav.component'
import { VersionGroup } from '~/graphql/typeGenerated'

/**
 * 기술 상세 버전 선택 sticky 크롬 (UX-008). A그룹(습득기술)에서 승격한
 * MovesVersionNav를 재사용한다 — 버전별 URL 링크 나열·가로 스크롤·우측 페이드·
 * active 자동 스크롤 인이 완전히 동일한 요구라 컴포넌트 변경 없이 items만 조립.
 *
 * "최신"(versionGroupId 없는 /moves/[id])은 컴포넌트가 모르는 특수 항목이라
 * 호출부인 여기서 sentinel(versionGroupId=0)로 맨 앞에 prepend한다.
 *
 * sticky 좌표는 전역 헤더 확정값(top-12/desktop:top-30) — 상세 페이지엔 필터바가
 * 없어 버전 nav가 sticky 크롬 자리를 대신한다. 배경(bg-primary-1)은 전체 폭으로
 * 스크롤 콘텐츠를 가리고, 내부 콘텐츠만 max-w-7xl로 가둔다(A그룹 패턴).
 */

/**
 * "최신" 항목의 sentinel id — 실제 버전 그룹 id(양수)와 충돌하지 않는 값.
 *
 * 백엔드가 VersionGroup.isLatest를 제공하지만 이 sentinel을 대체하지는 않는다 —
 * "최신" 탭은 최신 버전 항목이 아니라 **버전 미지정 URL**(/moves/[id])을 가리키는
 * 별개 항목이기 때문이다. isLatest는 목록 안에서 어느 버전이 최신인지를 알려줄 뿐이다.
 */
const LATEST_SENTINEL_ID = 0

interface MoveDetailVersionNavContainerProps {
  skillId: number
  versionGroups?: Array<VersionGroup> | null
  selectedVersionGroupId?: number
}

const MoveDetailVersionNavContainer = ({
  skillId,
  versionGroups,
  selectedVersionGroupId,
}: MoveDetailVersionNavContainerProps) => {
  if (!versionGroups || versionGroups.length === 0) {
    return null
  }

  const versionItems: MovesVersionNavItem[] = [
    {
      versionGroupId: LATEST_SENTINEL_ID,
      label: '최신',
      href: `/moves/${skillId}`,
      active: !selectedVersionGroupId,
    },
    ...versionGroups.map((vg) => ({
      versionGroupId: vg.versionGroupId,
      // displayName은 백엔드가 DLC를 베이스 시리즈로 정규화한 표시 전용 필드다
      // (예: 왕관설원 → 소드·실드). name/nameKo/baseVersionGroupName 중 무엇을
      // 써야 하는지 화면마다 달랐던 혼선을 이 단일 필드로 정리한다.
      label: vg.displayName ?? vg.nameKo ?? '',
      href: `/moves/${skillId}/version/${vg.versionGroupId}`,
      active: vg.versionGroupId === selectedVersionGroupId,
    })),
  ]

  return (
    <div className="sticky top-12 z-40 border-b border-solid border-primary-3/30 bg-primary-1 desktop:top-30">
      <div className="mx-auto w-full desktop:max-w-7xl">
        <MovesVersionNavComponent items={versionItems} />
      </div>
    </div>
  )
}

export default MoveDetailVersionNavContainer
