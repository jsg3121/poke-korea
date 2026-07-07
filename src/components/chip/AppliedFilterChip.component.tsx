import CloseIcon from '~/assets/close.svg'

/**
 * 적용 필터 칩 (DS). 현재 적용된 필터(타입·세대·메가 등)를 목록 상단에 상시
 * 노출하고 개별 해제(X)를 제공한다 — 적용 필터가 보이지 않으면 사용자가 결과를
 * 오해한다(Baymard: 20% 사이트가 적용 필터 표시에 실패, RES-002).
 *
 * 시각 규격은 Chip 원자(chipStyle)의 기본 칩 기반: h-7(28px)·rounded-lg·
 * font-medium·bg-primary-3·흰 글자. 텍스트는 모바일 text-xs(12px)/데스크톱
 * text-sm — 모바일에서 타입 2개(세 글자) 선택 시 공간 압박(사용자 피드백).
 * 제거 버튼은 실제 <button>(키보드 접근)이고 24px(WCAG 2.5.8 AA 하한) 확보 —
 * 칩 그룹 배치 시 상위에서 간격을 확보한다(chipStyle의 슬림 칩 전제와 동일).
 *
 * shrink-0 필수: 가로 스크롤(flex overflow-x-auto) 로우에서 shrink를 막지
 * 않으면 공간 부족 시 스크롤 대신 칩이 압축되어 라벨이 잘린다("페어리"→"페어").
 */

interface AppliedFilterChipProps {
  /** 표시 텍스트 (예: '불꽃', '3세대', '메가진화 포함') */
  label: string
  /** 개별 해제 콜백 */
  onRemove: () => void
}

const AppliedFilterChipComponent = ({
  label,
  onRemove,
}: AppliedFilterChipProps) => {
  return (
    <span className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg bg-primary-3 pl-3 pr-1 text-xs font-medium text-white desktop:text-sm">
      {/* text-aligned-md(+2px line-height) 보정은 flex items-center와 상쇄되므로,
          라벨을 고정 높이 내부 span으로 감싸 블록 흐름에서 line-height가 글리프를
          내리게 한다(X 버튼 배치 때문에 바깥 flex는 유지) */}
      <span className="h-7 text-aligned-md">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`${label} 필터 해제`}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-primary-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-4"
      >
        <CloseIcon
          width="0.75rem"
          height="0.75rem"
          className="fill-white-1"
          aria-hidden="true"
        />
      </button>
    </span>
  )
}

export default AppliedFilterChipComponent
