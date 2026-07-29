import { forwardRef, InputHTMLAttributes, useId } from 'react'
import Ball from '~/components/ball/Ball.component'

/**
 * 라디오 (DS 원자). 커스텀 포켓볼 그래픽으로 선택 상태를 표시한다.
 *
 * 선택 시 unchecked 원이 사라지고(scale-0) 포켓볼(Ball)이 나타난다(scale-100) —
 * peer-checked로 토글. label 전체가 클릭 영역이라 라벨 텍스트를 눌러도 선택된다.
 *
 * 라디오 그룹은 같은 name을 공유한다. id는 외부 전달값 우선, 없으면 useId 자동 생성
 * (label htmlFor와 input id 일치 보장). 색은 등록된 토큰만 사용한다.
 */

interface RadioComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const RadioComponent = forwardRef<HTMLInputElement, RadioComponentProps>(
  ({ id: passedId, label, disabled, ...inputProps }, ref) => {
    // 외부 id가 있으면 우선(label htmlFor와 input id가 반드시 일치해야 라벨 클릭이
    // 동작한다). 없으면 useId로 자동 생성해 충돌을 막는다.
    const autoId = useId()
    const id = passedId ?? autoId
    return (
      <label
        htmlFor={id}
        className="inline-flex items-center relative h-5 cursor-pointer"
      >
        <input
          ref={ref}
          id={id}
          type="radio"
          disabled={disabled}
          className="sr-only peer"
          {...inputProps}
        />
        {/* 빈 원 — 항상 깔리는 바탕(크기 변화 없음). 선택 시 포켓볼이 위를 덮는다 */}
        <span
          aria-hidden="true"
          className="w-5 h-5 rounded-full border border-solid border-black-1 bg-white-3 absolute left-0 z-10 peer-disabled:opacity-50"
        />
        {/* 선택 — 포켓볼 (부모 크기 20px에 맞춤). scale로만 등장/퇴장 */}
        <span
          aria-hidden="true"
          className="block w-5 h-5 absolute left-0 z-20 scale-0 transition-transform duration-300 will-change-transform peer-checked:scale-100 peer-disabled:opacity-50"
        >
          <Ball />
        </span>
        <span className="ml-6 h-5 text-base leading-5 text-primary-3 peer-checked:text-primary-4 peer-disabled:text-primary-2">
          {label}
        </span>
      </label>
    )
  },
)

RadioComponent.displayName = 'RadioComponent'

export default RadioComponent
