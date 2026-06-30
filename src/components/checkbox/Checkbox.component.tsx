import { forwardRef, InputHTMLAttributes, useId } from 'react'
import Ball from '~/components/ball/Ball.component'

/**
 * 체크박스 (DS 원자). 커스텀 포켓볼 그래픽으로 체크 상태를 표시한다.
 *
 * 체크 시 빈 박스가 사라지고(scale-0) 포켓볼(Ball)이 나타난다(scale-100) — peer-checked로
 * 토글. label 전체가 클릭 영역이라 라벨 텍스트를 눌러도 토글된다.
 *
 * id는 외부 전달값 우선, 없으면 useId 자동 생성(label htmlFor와 input id 일치 보장).
 * 색은 등록된 토큰만 사용한다.
 * (Radio와 같은 패턴 — 차이는 박스 모양(사각)과 크기(16px)뿐.)
 */

interface CheckboxComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const CheckboxComponent = forwardRef<HTMLInputElement, CheckboxComponentProps>(
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
          type="checkbox"
          disabled={disabled}
          className="sr-only peer"
          {...inputProps}
        />
        {/* 빈 박스 — 바탕(크기 변화 없음). 체크 시 페이드아웃해 사각 모서리가 원형
            포켓볼 뒤로 비치지 않게 한다(opacity만, 크기 유지) */}
        <span
          aria-hidden="true"
          className="w-4 h-4 rounded border border-solid border-black-1 bg-white-3 absolute left-0 z-10 opacity-100 transition-opacity duration-300 peer-checked:opacity-0 peer-disabled:opacity-50"
        />
        {/* 체크 — 포켓볼 (16px 박스에 맞춤). scale로만 등장/퇴장 */}
        <span
          aria-hidden="true"
          className="block w-4 h-4 absolute left-0 z-20 scale-0 transition-transform duration-300 will-change-transform peer-checked:scale-100 peer-disabled:opacity-50"
        >
          <Ball />
        </span>
        <span className="ml-5 h-5 text-base leading-5 text-primary-3 peer-checked:text-primary-4 peer-disabled:text-primary-2">
          {label}
        </span>
      </label>
    )
  },
)

CheckboxComponent.displayName = 'CheckboxComponent'

export default CheckboxComponent
