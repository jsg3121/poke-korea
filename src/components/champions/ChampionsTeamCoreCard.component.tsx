import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import { ChampionsTeamCoreFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'

interface ChampionsTeamCoreCardProps {
  core: ChampionsTeamCoreFragment
  /**
   * 현재 포맷 슬러그. Phase 4에서 폼별 라우트(/champions/[format]/list/[pokemonId])
   * 가 확정되면 멤버 포켓몬 링크 생성에 사용된다. Phase 1 시점엔 미사용.
   */
  formatSlug: ChampionsFormatSlug
}

const ChampionsTeamCoreCard = ({
  core,
  formatSlug: _formatSlug,
}: ChampionsTeamCoreCardProps) => {
  const usageRate = core.usageRate.toFixed(1)
  const teamsCountLabel = core.teamsCount.toLocaleString()

  // 멤버 이름 폴백: displayName ?? rawName
  const members = core.pokemons.map((m) => ({
    pokemonId: m.pokemonId,
    name: m.displayName || m.rawName,
    imagePath: m.imagePath,
  }))

  const buildPokemonHref = (pokemonId: number | null | undefined) => {
    if (pokemonId == null) return null
    // Phase 4 라우트 확정 후 /champions/[format]/list/[pokemonId] 로 갱신 예정
    return `/champions/list/${pokemonId}`
  }

  return (
    <article
      className="w-full h-32 items-center flex gap-4 bg-primary-4 border-[2px] border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4 relative"
      aria-label={`팀 코어 ${core.rank}위: ${members.map((m) => m.name).join(' + ')}`}
    >
      {/* 순위 뱃지 — Lv. 뱃지와 동일 무드 */}
      <p className="w-16 h-24 shrink-0 text-center leading-[calc(6rem+2px)] bg-primary-1 text-white px-2 rounded-md text-base font-bold">
        #{core.rank}
      </p>

      {/* 포켓몬 이미지 그룹 (가로 나란히) */}
      <div className="flex items-center gap-2 shrink-0" aria-hidden="true">
        {members.map((member, index) => (
          <div
            key={`${member.pokemonId ?? member.name}-img-${index}`}
            className="w-16 h-16"
          >
            {member.imagePath ? (
              <ImageComponent
                width="4rem"
                height="4rem"
                imageSize={{ width: 64, height: 64 }}
                densities={[1, 1.5]}
                alt={member.name}
                src={`${imageMode}/${member.imagePath}`}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-primary-3 border-2 border-primary-1" />
            )}
          </div>
        ))}
      </div>

      {/* 조합명 (개별 링크) */}
      <h3 className="flex-1 flex items-center gap-2 flex-wrap text-base font-bold text-primary-1">
        {members.map((member, index) => {
          const href = buildPokemonHref(member.pokemonId)
          return (
            <span
              key={`${member.pokemonId ?? member.name}-name-${index}`}
              className="flex items-center gap-2"
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
        })}
      </h3>

      {/* 통계 — MoveDetailCard 의 dl 그리드 패턴 */}
      <dl className="w-48 h-24 shrink-0 grid grid-cols-2">
        <div className="w-full h-full flex flex-col justify-center text-center relative after:absolute after:-right-0 after:bg-primary-3 after:top-0 after:h-full after:w-[2px]">
          <dt className="text-sm text-gray-600 mb-1">사용률</dt>
          <dd className="text-[1.375rem] font-bold text-primary-1">
            {usageRate}%
          </dd>
        </div>
        <div className="w-full h-full flex flex-col justify-center text-center">
          <dt className="text-sm text-gray-600 mb-1">채용팀</dt>
          <dd className="text-[1.375rem] font-bold text-primary-1">
            {teamsCountLabel}
          </dd>
        </div>
      </dl>
    </article>
  )
}

export default ChampionsTeamCoreCard
