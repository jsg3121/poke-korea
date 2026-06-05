import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import { ChampionsTeamCoreFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
} from '~/utils/championsFormat.util'

interface ChampionsTierTeamCoreCardProps {
  core: ChampionsTeamCoreFragment
  /**
   * 현재 포맷 슬러그. Phase 4 에서 폼별 라우트 확정 시 멤버 링크에 사용 예정.
   */
  formatSlug: ChampionsFormatSlug
}

/**
 * 모든 조합 크기(2/3/4) 동일한 이미지 크기로 통일.
 * 좁은 폭 3열 그리드 환경에서 카드 높이 일관성을 위해 48px 고정.
 */
const IMAGE_DIM = {
  className: 'w-13 h-13',
  rem: '4rem',
  px: 64,
} as const

/**
 * 순위별 뱃지 색상 — ChampionsTierBadge 의 메달 컬러 체계와 일관성 유지.
 * 1위 = S 티어(amber, 골드), 2위 = A 티어(slate, 실버), 3위 = B 티어(amber-dark, 브론즈).
 * 4위 이하는 기본 primary-1 사용.
 */
const RANK_BADGE_COLORS: Record<number, string> = {
  1: 'bg-gradient-to-br from-amber-400 to-amber-600',
  2: 'bg-gradient-to-br from-slate-300 to-slate-500',
  3: 'bg-gradient-to-br from-amber-600 to-amber-800',
}

const getRankBadgeColor = (rank: number): string =>
  RANK_BADGE_COLORS[rank] ?? 'bg-primary-1'

const ChampionsTierTeamCoreCard = ({
  core,
  formatSlug,
}: ChampionsTierTeamCoreCardProps) => {
  const usageRate = core.usageRate
  const teamsCountLabel = core.teamsCount.toLocaleString()

  // 멤버 이름 폴백: displayName ?? rawName
  const members = core.pokemons.map((m) => ({
    pokemonId: m.pokemonId,
    formType: m.formType,
    formCode: m.formCode,
    name: m.displayName || m.rawName,
    imagePath: m.imagePath,
  }))

  const buildPokemonHref = (
    pokemonId: number | null | undefined,
    formType: string | null | undefined,
    formCode: string | null | undefined,
  ) => {
    if (pokemonId == null) return null
    return buildChampionsDetailHref({
      formatSlug,
      pokemonId,
      formType,
      formCode,
    })
  }

  const renderMemberName = (
    member: (typeof members)[number],
    index: number,
  ) => {
    const href = buildPokemonHref(
      member.pokemonId,
      member.formType,
      member.formCode,
    )
    return (
      <span
        key={`${member.pokemonId ?? member.name}-name-${index}`}
        className="flex items-center gap-1"
      >
        {href ? (
          <Link
            href={href}
            className="hover:text-primary-2 underline-offset-2 hover:underline"
          >
            {member.name}
          </Link>
        ) : (
          <span>{member.name}</span>
        )}
        {index < members.length - 1 && (
          <span className="text-primary-3" aria-hidden="true">
            +
          </span>
        )}
      </span>
    )
  }

  return (
    <article
      className="w-full bg-primary-4 border-[2px] border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4"
      aria-label={`팀 코어 ${core.rank}위: ${members.map((m) => m.name).join(' + ')}`}
    >
      {/* 헤더: 인라인 순위 뱃지 + 조합명 */}
      <h3 className="flex items-center gap-2 flex-wrap text-sm font-bold text-primary-1 mb-3">
        <span
          className={`inline-flex items-center justify-center ${getRankBadgeColor(core.rank)} text-white rounded text-xs font-bold px-1.5 py-0.5 shrink-0`}
          aria-hidden="true"
        >
          #{core.rank}
        </span>
        <span className="flex items-center gap-1 flex-wrap">
          {members.map((member, index) => renderMemberName(member, index))}
        </span>
      </h3>

      {/* 이미지들 — 각 포켓몬 이미지 클릭 시 상세 페이지 진입 */}
      <div className="flex items-center gap-2 border-t-2 border-primary-3">
        {members.map((member) => {
          const href = buildPokemonHref(
      member.pokemonId,
      member.formType,
      member.formCode,
    )
          const imageContent = member.imagePath ? (
            <ImageComponent
              width={IMAGE_DIM.rem}
              height={IMAGE_DIM.rem}
              imageSize={{ width: IMAGE_DIM.px, height: IMAGE_DIM.px }}
              densities={[1, 1.5]}
              alt={member.name}
              src={`${imageMode}/${member.imagePath}`}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-primary-3 border-2 border-primary-1" />
          )

          return (
            <div
              key={`${member.pokemonId ?? member.name}-img`}
              className={IMAGE_DIM.className}
            >
              {href ? (
                <Link
                  href={href}
                  className="block w-full h-full hover:scale-110 transition-transform"
                  aria-label={`${member.name} 챔피언스 상세보기`}
                >
                  {imageContent}
                </Link>
              ) : (
                imageContent
              )}
            </div>
          )
        })}
      </div>

      {/* 통계: 사용률 + 채용팀 */}
      <dl className="grid grid-cols-2 border-t-2 border-primary-3 pt-3">
        <div className="flex flex-col items-center text-center relative after:absolute after:right-0 after:top-0 after:h-full after:w-[2px] after:bg-primary-3">
          <dt className="text-xs text-gray-600 mb-1">사용률</dt>
          <dd className="text-base font-bold text-primary-1">{usageRate}%</dd>
        </div>
        <div className="flex flex-col items-center text-center">
          <dt className="text-xs text-gray-600 mb-1">채용팀</dt>
          <dd className="text-base font-bold text-primary-1">
            {teamsCountLabel}
          </dd>
        </div>
      </dl>
    </article>
  )
}

export default ChampionsTierTeamCoreCard
