import { ChangeEvent, ChangeEventHandler, MouseEvent } from 'react'
import ImageComponent from '~/components/Image.component'

/**
 * 타입 필터 칩 (DS 원자). 포켓몬 18종 타입 중 하나를 나타내는 **선택 가능한 아이콘 토글**.
 *
 * 텍스트 Chip/Tag와 역할이 다르다 — 이건 타입 아이콘(SVG)을 grayscale↔컬러로 토글하는
 * 인터랙티브 필터 컨트롤이다. 색 라벨 표시용 Chip과 구분해 별도 원자로 둔다.
 *
 * 선택 시맨틱은 mode로 고른다(UX-008 §10-3, 사용자 확정):
 * - 'multi'(기본): checkbox — 도감 리스트처럼 여러 타입 동시 선택. 기존 호출부 무영향.
 * - 'single': radio — 기술 목록처럼 그룹당 1개만 선택(name으로 그룹을 묶는다).
 *   호출부 로직만으로 단일 선택을 흉내내면 스크린리더에는 여전히 "여러 개 선택
 *   가능한 체크박스"로 안내되므로 input 시맨틱 자체를 radio로 바꾼다. 그룹
 *   시맨틱(role="radiogroup"·aria-label)은 상위(organism) 책임이다.
 *
 * 라벨(타입명) 노출은 CSS 반응형 단일로 통합한다(데/모 2벌 → 단일, ADR-0007):
 * - 모바일(base): 아이콘 하단에 라벨 항상 표시
 * - 데스크톱(`desktop:`): 라벨은 기본 숨김, hover/focus-visible 시에만 노출
 *
 * 라벨 텍스트는 시각 숨김 상태에서도 DOM에 유지돼 스크린리더가 항상 읽는다(접근성).
 * 상태: active(선택됨=컬러), disabled(2개 선택 시 나머지 잠금=흐림). 색·크기는 토큰만 사용.
 */

interface TypeChipProps {
  /** 타입 식별자 (예: 'FIRE') — 폼 value 및 아이콘 파일명(소문자)로 사용 */
  value: string
  /** 타입 표시명 (예: '불꽃') */
  label: string
  /** 선택 여부 */
  active: boolean
  /** 잠금 여부 (예: 최대 선택 수 도달 시 미선택 항목) */
  disabled?: boolean
  onChange: ChangeEventHandler<HTMLInputElement>
  /** 선택 시맨틱 — 'multi'(기본, checkbox 다중) | 'single'(radio 단일) */
  mode?: 'multi' | 'single'
  /** single 모드의 radio 그룹명 (single일 때 필수). id 접두사로도 써 그룹 간 충돌 방지 */
  name?: string
}

const TypeChipComponent = ({
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
      {/* input은 sr-only + label relative가 세트다. sr-only는 position:absolute라
          positioned 조상이 없으면 컨테이닝 블록이 바깥(sticky 래퍼 등)으로 잡혀
          overflow-x-auto 클리핑을 벗어나고, 뒤쪽 칩의 input이 페이지 가로 스크롤을
          만든다. label relative로 input을 칩 내부에 가둬 해결한다.
          display:none(hidden)으로 바꾸면 스크롤은 잡히지만 키보드 포커스·스크린리더
          접근이 불가능해진다(peer-focus-visible도 전부 무효) — 금지. */}
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
      {/* 아이콘 — 미선택은 흐린 흑백, 선택 시 컬러. 잠금 시 더 흐림.
          hover/focus 시 살짝 확대(라벨은 흔들리지 않게 아이콘 span에만). peer(input 형제)와
          group(label 조상)을 한 클래스에 체이닝하면 셀렉터가 깨지므로 group-hover만 쓰고,
          잠금(disabled) 시엔 뒤에 오는 peer-disabled:scale-100으로 확대를 상쇄한다 */}
      <span className="block h-6 w-6 grayscale opacity-40 drop-shadow-[1px_2px_0px_var(--color-black-1)] transition-[filter,opacity,transform] group-hover:scale-110 peer-focus-visible:scale-110 peer-checked:grayscale-0 peer-checked:opacity-100 peer-focus-visible:opacity-100 peer-disabled:scale-100 peer-disabled:opacity-20 peer-disabled:grayscale desktop:h-8 desktop:w-8">
        <ImageComponent
          alt=""
          aria-hidden="true"
          src={`/assets/type/${value.toLowerCase()}.svg`}
          width="100%"
          height="100%"
          imageSize={{ width: 32, height: 32 }}
        />
      </span>
      {/* 라벨 — 모바일 항상 표시, 데스크톱 hover/focus 시에만. DOM엔 항상 유지(SR용).
          데스크톱 focus 노출은 desktop:opacity-0(미디어쿼리 안, 소스 뒤)을 이겨야 하므로
          desktop: 접두사를 붙인 desktop:peer-focus-visible:opacity-100을 써야 우선한다
          (접두사 없는 peer-focus-visible은 미디어쿼리 밖·앞이라 데스크톱에서 밀린다) */}
      {/* 라벨 색은 text-primary-4(밝은색) — 필터바가 놓이는 페이지 배경이
          bg-primary-1(짙은 남색)이라 text-primary-1이면 배경에 묻혀 보이지 않는다 */}
      <span className="text-xs leading-4 text-primary-4 opacity-60 transition-opacity peer-checked:font-bold peer-checked:opacity-100 peer-focus-visible:opacity-100 desktop:text-sm desktop:opacity-0 desktop:group-hover:opacity-100 desktop:peer-focus-visible:opacity-100">
        {label}
      </span>
    </label>
  )
}

export default TypeChipComponent
