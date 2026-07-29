import { ReactNode } from 'react'

/**
 * 빈 상태 (DS). 검색/필터 결과 0건 등 "보여줄 항목이 없는" 상태를 안내하고
 * 다음 행동(CTA)을 제시한다.
 *
 * 텍스트만 띄우고 끝나면 사용자가 페이지를 이탈한다(NN/g 오류 복구 휴리스틱) —
 * 반드시 회복 동선(action 슬롯, 예: "필터 초기화" Button)을 함께 받는 구조로
 * 강제하지 않되 권장한다. 도감 리스트 외 기술/특성 등 다른 리스트에서도
 * 재사용하도록 아이콘·문구를 슬롯/prop으로 연다.
 *
 * 아이콘은 장식이라 aria-hidden. 결과 갱신의 스크린리더 알림(role="status")은
 * 리스트 컨테이너 책임이다.
 */

interface EmptyStateProps {
  /** 제목 (예: "검색 결과에 맞는 포켓몬이 없어요") */
  title: string
  /** 보조 설명 (예: "필터 조건을 바꾸거나 초기화해 보세요") */
  description?: string
  /** 상단 아이콘 (SVGR 등 — 래퍼가 64px 크기·primary-3 색 규격화) */
  icon?: ReactNode
  /** 회복 동선 CTA (Button/LinkButton 슬롯) */
  action?: ReactNode
}

const EmptyStateComponent = ({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex w-full flex-col items-center gap-3 py-12 text-center desktop:py-16">
      {icon && (
        <span
          aria-hidden="true"
          className="text-primary-3 [&>svg]:h-16 [&>svg]:w-16"
        >
          {icon}
        </span>
      )}
      <p className="text-lg font-bold text-primary-4 desktop:text-xl">
        {title}
      </p>
      {description && (
        <p className="text-sm text-primary-3 desktop:text-base">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export default EmptyStateComponent
