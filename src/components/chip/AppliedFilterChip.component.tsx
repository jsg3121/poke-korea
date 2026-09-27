import CloseIcon from '~/assets/close.svg'

// shrink-0 필수: 가로 스크롤 로우에서 shrink를 막지 않으면 공간 부족 시
// 스크롤 대신 칩이 압축되어 라벨이 잘린다.
interface AppliedFilterChipProps {
  label: string
  onRemove: () => void
}

const AppliedFilterChip = ({ label, onRemove }: AppliedFilterChipProps) => {
  return (
    <span className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg bg-primary-3 pl-3 pr-1 text-xs font-medium text-white desktop:text-sm">
      <span className="inline-block h-7 text-aligned-md">{label}</span>
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

export default AppliedFilterChip
