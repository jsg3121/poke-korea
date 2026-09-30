export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-1 text-primary-4 border border-solid border-primary-3 hover:bg-primary-2 focus-visible:bg-primary-2',
  secondary:
    'bg-primary-3 text-primary-1 hover:bg-primary-2 hover:text-primary-4 focus-visible:bg-primary-2 focus-visible:text-primary-4',
  ghost:
    'bg-transparent text-primary-1 border-2 border-solid border-primary-1 hover:bg-primary-1 hover:text-primary-4 focus-visible:bg-primary-1 focus-visible:text-primary-4',
}

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'min-h-touch px-3 desktop:px-4 text-xs desktop:text-sm', // 44px 보장
  md: 'min-h-touch px-4 desktop:px-5 text-xs desktop:text-sm desktop:text-base', // 44px
  lg: 'min-h-touch-lg px-6 text-base desktop:text-lg', // 48px
}

const BASE_CLASS =
  'inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4 disabled:opacity-50 disabled:cursor-not-allowed'

interface ButtonStyleParams {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

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
