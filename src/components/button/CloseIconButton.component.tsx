import CloseIcon from '~/assets/close.svg'

/**
 * 닫기 아이콘 버튼 (DS 원자). 모달/다이얼로그 등을 닫는 X 아이콘 버튼.
 *
 * 텍스트 CTA(Button)와 분리: 아이콘만 있는 버튼이라 접근명(aria-label)이 필수이고,
 * 색이 배경(모달)에 따라 반전된다. color로 진한/밝은 아이콘을 고른다.
 * - dark: 진한 아이콘(fill-primary-1) — 밝은 배경 모달용(기본)
 * - light: 밝은 아이콘(fill-primary-4) — 진한 배경 모달용
 *
 * 터치 타겟: 시각은 아이콘(24px) 중심이되, 터치 영역은 모바일 44px / 데스크톱 36px로
 * 확보한다(시각 != 터치). 색은 등록된 토큰만 사용.
 */

type CloseIconColor = 'dark' | 'light'

interface CloseIconButtonProps {
  onClick: () => void
  /** 접근명 (필수) — 예: "팝업 닫기" */
  'aria-label': string
  /** 아이콘 색: dark(진한, 밝은 배경용·기본) / light(밝은, 진한 배경용) */
  color?: CloseIconColor
}

const ICON_FILL: Record<CloseIconColor, string> = {
  dark: 'fill-primary-1',
  light: 'fill-primary-4',
}

const BUTTON_CLASS =
  'inline-flex items-center justify-center min-h-touch min-w-touch desktop:min-h-9 desktop:min-w-9 rounded-md transition-colors hover:bg-primary-2/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1'

const CloseIconButtonComponent = ({
  onClick,
  'aria-label': ariaLabel,
  color = 'dark',
}: CloseIconButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={BUTTON_CLASS}
    >
      <CloseIcon
        width="1.5rem"
        height="1.5rem"
        className={ICON_FILL[color]}
        aria-hidden="true"
      />
    </button>
  )
}

export default CloseIconButtonComponent
