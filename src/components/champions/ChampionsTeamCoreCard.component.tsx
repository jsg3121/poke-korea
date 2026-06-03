import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import { ChampionsTeamCoreFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'

interface ChampionsTeamCoreCardProps {
  core: ChampionsTeamCoreFragment
  formatSlug: ChampionsFormatSlug
}

const ChampionsTeamCoreCard = ({
  core,
  formatSlug,
}: ChampionsTeamCoreCardProps) => {
  const usageRate = core.usageRate.toFixed(1)
  const teamsCountLabel = `${core.teamsCount.toLocaleString()}팀 채용`

  // 멤버 이름 폴백: displayName ?? rawName
  const members = core.pokemons.map((m) => ({
    pokemonId: m.pokemonId,
    name: m.displayName || m.rawName,
    imagePath: m.imagePath,
  }))

  const buildPokemonHref = (pokemonId: number | null | undefined) => {
    if (pokemonId == null) return null
    // Phase 4 라우트가 확정되면 /champions/[format]/list/[pokemonId] 로 갱신 예정
    // 현재는 기존 라우트 유지 (Phase 2/3/4 에서 자연 갱신)
    return `/champions/list/${pokemonId}`
  }

  return (
    <article
      className="relative bg-primary-4 border border-solid border-primary-3 rounded-xl p-4 desktop:p-5 hover:border-primary-2 hover:shadow-lg transition-all duration-200"
      aria-label={`팀 코어 ${core.rank}위: ${members.map((m) => m.name).join(' + ')}`}
    >
      {/* 순위 뱃지 */}
      <div
        className="absolute -top-2 -left-2 w-7 h-7 flex items-center justify-center rounded-full bg-primary-1 text-primary-4 text-xs font-bold shadow-md"
        aria-label={`${core.rank}위`}
      >
        {core.rank}
      </div>

      {/* 포켓몬 2마리 (겹침 배치) */}
      <div
        className="relative h-20 desktop:h-24 mb-3 flex items-center justify-center"
        aria-hidden="true"
      >
        {members.map((member, index) => (
          <div
            key={`${member.pokemonId ?? member.name}-${index}`}
            className="absolute w-16 h-16 desktop:w-20 desktop:h-20"
            style={{
              left: index === 0 ? 'calc(50% - 48px)' : 'calc(50% - 16px)',
              zIndex: 2 - index,
            }}
          >
            {member.imagePath ? (
              <ImageComponent
                width="100%"
                height="100%"
                imageSize={{ width: 80, height: 80 }}
                densities={[1, 1.5]}
                alt={member.name}
                src={`${imageMode}/${member.imagePath}`}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-primary-3 border-2 border-primary-2" />
            )}
          </div>
        ))}
      </div>

      {/* 멤버 이름 (개별 링크) */}
      <div className="flex items-center justify-center gap-1 desktop:gap-2 text-sm desktop:text-base font-semibold text-primary-1 mb-2 flex-wrap">
        {members.map((member, index) => {
          const href = buildPokemonHref(member.pokemonId)
          return (
            <span key={`${member.pokemonId ?? member.name}-name-${index}`}>
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
                <span className="ml-1 text-primary-3" aria-hidden="true">
                  +
                </span>
              )}
            </span>
          )
        })}
      </div>

      {/* 통계 */}
      <dl className="flex items-center justify-between text-xs desktop:text-sm">
        <div>
          <dt className="sr-only">사용률</dt>
          <dd className="font-bold text-primary-2">{usageRate}%</dd>
        </div>
        <div>
          <dt className="sr-only">채용 팀 수</dt>
          <dd className="text-primary-2">{teamsCountLabel}</dd>
        </div>
      </dl>
    </article>
  )
}

export default ChampionsTeamCoreCard
