'use client'

import { ChangeEvent } from 'react'

interface ToggleButtonComponentProps {
  defaultChecked?: boolean
  onClickToggle: (value: string) => void
}

const ToggleButtonComponent = ({
  defaultChecked = true,
  onClickToggle,
}: ToggleButtonComponentProps) => {
  const handleToggle = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.currentTarget.checked
    onClickToggle(checked ? 'LEVELUP' : 'MACHINE')
  }

  return (
    <label
      htmlFor="table-type-toggle"
      className="relative inline-flex h-[2rem] w-[6rem] items-center rounded-full transition-colors duration-300 cursor-pointer"
    >
      <input
        id="table-type-toggle"
        type="checkbox"
        className="sr-only peer"
        defaultChecked={defaultChecked}
        onChange={handleToggle}
      />
      <i className="absolute h-full w-full rounded-full transition-colors duration-300 bg-primary-2 peer-checked:bg-primary-3 " />
      <span className="absolute h-[1.5rem] w-[1.5rem] rounded-full bg-white transition-transform duration-300 transform peer-checked:translate-x-[4.25rem] translate-x-[0.25rem]" />
      <span className="text-sm font-bold absolute transition-transform duration-300 transform translate-x-[3.5rem] text-primary-4 peer-checked:translate-x-[0.75rem] peer-checked:text-primary-1">
        {defaultChecked ? '레벨업' : '머신'}
      </span>
    </label>
  )
}

export default ToggleButtonComponent
