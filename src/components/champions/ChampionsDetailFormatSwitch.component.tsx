import Link from 'next/link'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
  CHAMPIONS_FORMAT_SLUGS,
  getFormatLabel,
} from '~/utils/championsFormat.util'

/**
 * 챔피언스 상세 페이지 전용 더블/싱글 포맷 전환 탭.
 *
 * 홈/도감/티어의 ChampionsFormatTab은 포맷 "홈"(/champions/{slug}{suffix})으로
 * 이동하지만, 상세는 "현재 보고 있는 포켓몬/폼을 유지한 채" 상대 포맷 상세로 가야 한다.
 * 그래서 각 포맷 슬러그로 buildChampionsDetailHref를 다시 계산해 상세 경로를 유지한다.
 *
 * championsbattledata 데이터는 double·single이 동일한 포켓몬 풀(각 310종, 교집합
 * 100%)을 쓰므로, 어느 포켓몬이든 상대 포맷 상세가 항상 존재한다(404 위험 없음).
 * 따라서 존재 확인 없이 단순 링크로 전환한다.
 *
 * pill 스타일은 ChampionsFormatTab과 동일하게 맞춰 화면 간 시각 일관성을 유지한다.
 */
interface ChampionsDetailFormatSwitchProps {
  /** 현재 활성 포맷 슬러그 */
  currentFormat: ChampionsFormatSlug
  /** 상세 대상 포켓몬 id (externalDexId) */
  pokemonId: number
  /** 폼 타입 (BASE/MEGA/REGION/NORMAL) — 상세 경로 유지용 */
  formType: string | null | undefined
  /** 폼 코드 — 상세 경로 유지용 */
  formCode: string | null | undefined
  /** 추가 className (외곽 마진 조정용) */
  className?: string
}

const ChampionsDetailFormatSwitch = ({
  currentFormat,
  pokemonId,
  formType,
  formCode,
  className = '',
}: ChampionsDetailFormatSwitchProps) => {
  return (
    <nav aria-label="포맷 선택" className={`w-full ${className}`}>
      <ul className="flex items-center gap-2 flex-wrap">
        {CHAMPIONS_FORMAT_SLUGS.map((slug) => {
          const isActive = slug === currentFormat
          const href = buildChampionsDetailHref({
            formatSlug: slug,
            pokemonId,
            formType,
            formCode,
          })
          const label = getFormatLabel(slug)

          return (
            <li key={slug}>
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                title={label}
                className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold transition-colors duration-200 border-2 ${
                  isActive
                    ? 'bg-primary-4 text-primary-1 border-primary-4'
                    : 'bg-transparent text-primary-3 border-primary-3 hover:text-gray-300 hover:border-primary-4'
                }`}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default ChampionsDetailFormatSwitch
