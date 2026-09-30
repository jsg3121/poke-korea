import CloseIcon from '~/assets/close.svg'

type CloseIconColor = 'dark' | 'light'

interface CloseIconButtonProps {
  onClick: () => void
  'aria-label': string
  color?: CloseIconColor
}

const ICON_FILL: Record<CloseIconColor, string> = {
  dark: 'fill-primary-1',
  light: 'fill-primary-4',
}

const BUTTON_CLASS =
  'inline-flex items-center justify-center min-h-touch min-w-touch desktop:min-h-9 desktop:min-w-9 rounded-md transition-colors hover:bg-primary-2/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1'

const CloseIconButton = ({
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

export default CloseIconButton
