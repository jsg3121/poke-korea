'use client'

import { useEnterViewProgress } from '~/hook/useEnterViewProgress'

/**
 * 챔피언스 메타 순위 막대 (인기 기술/도구/특성). 이름 + 채택률(%) 막대를 순위대로
 * 표시한다. 순번(1/2/3) 배지는 두지 않는다(사용자 결정 — 순위는 배치 순서로 충분).
 *
 * 시각 위계(UX-010 결정 3):
 * - 1위 항목은 포인트 색(bg-primary-1, 가장 진한 네이비)으로 강조.
 * - 2위 이하는 bg-primary-2(진한 중립 블루) — 이전 primary-3(연한 회청)가 너무
 *   흐릿하다는 피드백으로 강화. 1위보다는 덜 강조되어 위계는 유지된다.
 *
 * 뷰포트 진입 시 막대 채움 + % 숫자 카운트업(1회). 진행도 계산은
 * useEnterViewProgress가 담당한다(SSR 최종값 유지·reduced-motion 대응 포함).
 */

/** StatBar(0.35)보다 낮다 — 목록이 짧아 더 일찍 채워지는 편이 자연스럽다 */
const ENTER_THRESHOLD = 0.25

interface ChampionsMetaListProps {
  title: string
  items: Array<{ name: string; usageRate: number }>
}

/** usageRate 문자열의 소수 자릿수를 보존해 카운트업 중에도 최종 표기와 일치시킨다 */
const formatRate = (value: number, decimals: number) => value.toFixed(decimals)

const ChampionsMetaList = ({ title, items }: ChampionsMetaListProps) => {
  const { ref: rootRef, progress } = useEnterViewProgress<HTMLDivElement>({
    threshold: ENTER_THRESHOLD,
  })

  const maxRate = Math.max(...items.map((item) => item.usageRate), 1)

  return (
    // 통합 패널(밝은 primary-4) 안에서 섹션을 은은한 배경 블록으로 구분한다
    // (개편 전 카드 내부 구분 방식). 카드 테두리/셸 그림자는 상위 패널이 담당.
    <div ref={rootRef} className="p-3 bg-primary-3/25 rounded-lg">
      <h3 className="font-bold text-sm mb-3 text-primary-1">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, index) => {
          const isTop = index === 0
          const percentage = (item.usageRate / maxRate) * 100
          // 원본 표기의 소수 자릿수를 보존(예: 27.2 → 1자리, 100 → 0자리)
          const decimals = (item.usageRate.toString().split('.')[1] ?? '')
            .length

          return (
            <li key={`${item.name}-${index}`} className="space-y-1">
              <div className="flex justify-between gap-2 text-sm">
                <span className="font-medium text-primary-1 break-keep">
                  {item.name}
                </span>
                <span
                  className={`shrink-0 font-semibold ${
                    isTop ? 'text-primary-1' : 'text-primary-2'
                  }`}
                >
                  <span aria-hidden="true">
                    {formatRate(item.usageRate * progress, decimals)}
                  </span>
                  <span className="sr-only">{item.usageRate}</span>%
                </span>
              </div>
              <div
                aria-hidden="true"
                className="w-full h-2 bg-primary-4 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full rounded-full ${
                    isTop ? 'bg-primary-1' : 'bg-primary-2'
                  }`}
                  style={{ width: `${percentage * progress}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ChampionsMetaList
