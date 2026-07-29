/**
 * Button / LinkButton 공유 스타일. <button>(액션)과 <Link>(이동)는 시각 CTA가
 * 동일하므로 variant/size 클래스를 여기서 공유한다([[ds-atomic-first-order]]).
 *
 * 토큰 기반 규격(ADR-0009 16px 고정, 모바일 퍼스트). 기존 버튼들의 임의값
 * (rounded-[20px], h-[4rem], px-[2rem] 등)을 표준 토큰으로 정규화한다.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

/** variant별 색상 (배경 + 글자 + hover) — 정적 매핑(purge 안전) */
const VARIANT_CLASS: Record<ButtonVariant, string> = {
  // primary는 페이지/모달 배경(primary-1)과 동색이라 경계가 사라진다 →
  // 1px primary-3 테두리로 시인성을 확보한다(ghost의 2px과 구분되는 두께)
  primary:
    'bg-primary-1 text-primary-4 border border-solid border-primary-3 hover:bg-primary-2 focus-visible:bg-primary-2',
  secondary:
    'bg-primary-3 text-primary-1 hover:bg-primary-2 hover:text-primary-4 focus-visible:bg-primary-2 focus-visible:text-primary-4',
  ghost:
    'bg-transparent text-primary-1 border-2 border-solid border-primary-1 hover:bg-primary-1 hover:text-primary-4 focus-visible:bg-primary-1 focus-visible:text-primary-4',
}

/** size별 높이·패딩·폰트 (모바일 퍼스트, 터치 타겟 보장) */
const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'min-h-touch px-3 desktop:px-4 text-xs desktop:text-sm', // 44px 보장
  md: 'min-h-touch px-4 desktop:px-5 text-xs desktop:text-sm desktop:text-base', // 44px
  lg: 'min-h-touch-lg px-6 text-base desktop:text-lg', // 48px
}

/**
 * 공통 베이스 (레이아웃·모서리·트랜지션·포커스 링·disabled).
 * disabled: 의사클래스는 <button>에만 동작하고 <Link>(LinkButton)엔 무해하므로 공유한다.
 */
const BASE_CLASS =
  'inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4 disabled:opacity-50 disabled:cursor-not-allowed'

interface ButtonStyleParams {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

/** variant·size·fullWidth로 버튼 클래스 문자열을 조합한다. */
export const getButtonClass = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
}: ButtonStyleParams): string =>
  [
    BASE_CLASS,
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    fullWidth ? 'w-full' : '',
  ]
    .filter(Boolean)
    .join(' ')
