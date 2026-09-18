/**
 * 제원 카드용 게이지 2종(1.58.0).
 *
 * 두 게이지 모두 **막대는 보조 시각화**다. 실제 정보는 형제 텍스트가 전달하고
 * 막대에는 `aria-hidden`을 준다(스탯 카드 StatBar와 동일 원칙). 스크린리더가
 * 수치를 중복해 읽거나, 막대만 남아 정보가 유실되는 것을 막는다.
 */

interface CaptureRateGaugeProps {
  /** 채움 비율(%) — captureRate/255 */
  percent: number
  /** 뷰포트 진입 모션 진행도(0~1). 기본 1 = 최종 상태 */
  progress?: number
}

/**
 * 포획률 게이지 — 단일 채움.
 *
 * 채움 비율은 captureRate/255로, "255 만점 중 현재값"이라는 척도상 위치다.
 * 실제 포획 확률(체력·볼·상태이상에 좌우됨)과는 다른 개념이므로 확률을
 * 함께 표기하지 않는다. 병기하면 막대 비율과 숫자가 어긋나 오해를 부른다.
 */
export const CaptureRateGaugeComponent = ({
  percent,
  progress = 1,
}: CaptureRateGaugeProps) => {
  return (
    <span
      aria-hidden="true"
      className="block h-2.5 w-full overflow-hidden rounded-full bg-primary-1/10"
    >
      <span
        className="block h-full rounded-full bg-primary-2"
        style={{ width: `${percent * progress}%` }}
      />
    </span>
  )
}

interface GenderBarProps {
  /** 수컷 비율(%). 나머지가 암컷 영역이 된다 */
  male: number
  /** 뷰포트 진입 모션 진행도(0~1). 기본 1 = 최종 상태 */
  progress?: number
}

/**
 * 성비 막대 — 2분할.
 *
 * 트랙 전체를 암컷 색으로 깔고 수컷 막대만 채운다. 두 조각을 각각 자라게 하면
 * 모션 중 오른쪽에 빈 트랙이 드러나 어색하므로, 자라는 요소를 하나로 줄였다.
 * 암컷 영역은 "수컷이 채우지 않은 나머지"로 표현된다.
 *
 * 색상만으로 암수를 구분하지 않는다(WCAG 1.4.1). 실제 "수컷"·"암컷" 레이블은
 * 호출부 텍스트가 담당하며, 여기서는 경계에 구분선을 둬 색 인지가 어려워도
 * 분할 지점이 형태로 드러나게 한다.
 */
export const GenderBarComponent = ({ male, progress = 1 }: GenderBarProps) => {
  // 한쪽이 100%면 분할이 없으므로 구분선을 넣지 않는다(끝에 걸쳐 잘려 보인다)
  const hasBoundary = male > 0 && male < 100

  return (
    <span
      aria-hidden="true"
      className="block h-2.5 w-full overflow-hidden rounded-full bg-primary-3"
    >
      <span
        className={`block h-full bg-primary-2 ${
          hasBoundary ? 'border-r-2 border-primary-4' : ''
        }`}
        style={{ width: `${male * progress}%` }}
      />
    </span>
  )
}
