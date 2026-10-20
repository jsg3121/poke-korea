import { MOVE_TABLE_COL } from './shared/moveTable.constants'

interface MoveTableStatProps {
  label: string
  value?: number | null
}

const MoveTableStat = ({ label, value }: MoveTableStatProps) => (
  <span
    className={`text-2xs text-primary-2 desktop:text-xs ${MOVE_TABLE_COL.stat} desktop:shrink-0 desktop:text-center`}
  >
    <span className="desktop:sr-only">{label} </span>
    <b className="text-xs font-bold text-primary-1 desktop:text-sm">
      {value ?? '-'}
    </b>
  </span>
)

export default MoveTableStat
