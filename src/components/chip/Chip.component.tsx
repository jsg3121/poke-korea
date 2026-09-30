import { ChipColor } from './chip.types'

const BASE_CLASS =
  'inline-block px-3 h-7 rounded-lg text-sm text-aligned-md font-medium whitespace-nowrap transition-all'

const COLOR_CLASS: Record<ChipColor, string> = {
  physical: 'bg-damage-physical text-primary-1',
  special: 'bg-damage-special text-primary-1',
  status: 'bg-damage-status text-primary-1',
}

const DEFAULT_COLOR_CLASS = 'bg-primary-3 text-white'

const CLICKABLE_ACTIVE_CLASS = 'opacity-100 scale-105'
const CLICKABLE_INACTIVE_CLASS =
  'opacity-60 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4'

interface ChipStyleParams {
  color?: ChipColor
  clickable?: boolean
  active?: boolean
}

const getChipClass = ({
  color,
  clickable = false,
  active = false,
}: ChipStyleParams): string =>
  [
    BASE_CLASS,
    color ? COLOR_CLASS[color] : DEFAULT_COLOR_CLASS,
    clickable
      ? `cursor-pointer ${active ? CLICKABLE_ACTIVE_CLASS : CLICKABLE_INACTIVE_CLASS}`
      : '',
  ]
    .filter(Boolean)
    .join(' ')

interface ChipBaseProps {
  label: string
  color?: ChipColor
}

interface ChipDisplayProps extends ChipBaseProps {
  clickable?: false
  active?: never
  onClick?: never
}

interface ChipClickableProps extends ChipBaseProps {
  clickable: true
  active?: boolean
  onClick?: () => void
}

type ChipProps = ChipDisplayProps | ChipClickableProps

const Chip = (props: ChipProps) => {
  const { label, color } = props

  if (!props.clickable) {
    return <span className={getChipClass({ color })}>{label}</span>
  }

  const { active = false, onClick } = props
  return (
    <button
      type="button"
      className={getChipClass({ color, clickable: true, active })}
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default Chip
