import { MouseEvent } from 'react'

interface SegmentedControlItem<T extends string> {
  key: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  label: string
  items: ReadonlyArray<SegmentedControlItem<T>>
  value: T
  onChange: (key: T) => void
}

const BUTTON_CLASS =
  'inline-flex min-h-9 flex-1 items-center justify-center whitespace-nowrap rounded-xl px-3 text-xs text-primary-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1 desktop:min-h-touch desktop:rounded-2.5xl desktop:px-4 desktop:text-sm'

const ACTIVE_CLASS = 'bg-primary-1 font-semibold text-primary-4'

const INACTIVE_CLASS = 'bg-transparent font-medium hover:bg-primary-1/10'

const SegmentedControl = <T extends string>({
  label,
  items,
  value,
  onChange,
}: SegmentedControlProps<T>) => {
  const handleClickItem = (e: MouseEvent<HTMLButtonElement>) => {
    const item = items.find((i) => i.key === e.currentTarget.value)
    if (item) onChange(item.key)
  }

  return (
    <div
      role="group"
      aria-label={label}
      className="flex w-full gap-1 rounded-2xl bg-primary-1/10 p-1 desktop:w-72 desktop:rounded-3xl"
    >
      {items.map((item) => {
        const isActive = item.key === value

        return (
          <button
            key={item.key}
            type="button"
            value={item.key}
            aria-pressed={isActive}
            onClick={handleClickItem}
            className={`${BUTTON_CLASS} ${isActive ? ACTIVE_CLASS : INACTIVE_CLASS}`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
