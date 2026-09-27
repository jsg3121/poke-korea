import { ChangeEvent, ChangeEventHandler, MouseEvent } from 'react'

import Image from '~/components/Image.component'

interface BaseTypeChipProps {
  value: string
  label: string
  active: boolean
  disabled?: boolean
  onChange: ChangeEventHandler<HTMLInputElement>
}

type TypeChipProps = BaseTypeChipProps &
  (
    | {
        mode?: 'multi'
        name?: string
      }
    | {
        mode: 'single'
        name: string
      }
  )

const TypeChip = ({
  value,
  label,
  active,
  disabled = false,
  onChange,
  mode = 'multi',
  name,
}: TypeChipProps) => {
  const id = `type-chip-${name ? `${name}-` : ''}${value.toLowerCase()}`

  // radio는 이미 checked인 항목을 다시 클릭해도 change 이벤트가 발생하지 않는다
  // (HTML 명세 — 상태가 안 바뀌므로). 선택 해제 토글을 지원하려면 click에서 직접
  // onChange를 불러줘야 한다. MouseEvent도 currentTarget/target이 같은 input이라
  // 호출부(value 읽기)엔 동일하게 동작한다 — 타입만 좁혀서 전달한다.
  const handleActiveReclick = (e: MouseEvent<HTMLInputElement>) => {
    if (mode === 'single' && active) {
      onChange(e as unknown as ChangeEvent<HTMLInputElement>)
    }
  }
  return (
    <label
      htmlFor={id}
      className="group relative inline-flex w-12 shrink-0 cursor-pointer flex-col items-center gap-0.5 has-[:disabled]:cursor-not-allowed desktop:w-14 desktop:gap-1"
    >
      <input
        id={id}
        type={mode === 'single' ? 'radio' : 'checkbox'}
        name={mode === 'single' ? name : undefined}
        value={value}
        checked={active}
        disabled={disabled}
        onChange={onChange}
        onClick={handleActiveReclick}
        className="sr-only peer"
        aria-label={`${label} 타입 필터`}
      />
      <span className="block h-6 w-6 opacity-40 drop-shadow-[1px_2px_0px_var(--color-black-1)] transition-[filter,opacity,transform] group-hover:scale-110 peer-focus-visible:scale-110 peer-checked:opacity-100 peer-focus-visible:opacity-100 peer-disabled:scale-100 peer-disabled:opacity-20 peer-disabled:grayscale desktop:h-8 desktop:w-8">
        <Image
          alt=""
          aria-hidden="true"
          src={`/assets/type/${value.toLowerCase()}.svg`}
          width="100%"
          height="100%"
          imageSize={{ width: 32, height: 32 }}
        />
      </span>
      <span className="text-xs leading-4 text-primary-4 opacity-60 transition-opacity peer-checked:font-bold peer-checked:opacity-100 peer-focus-visible:opacity-100 desktop:text-sm">
        {label}
      </span>
    </label>
  )
}

export default TypeChip
