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
  const usageRate = core.usageRate
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

  const renderImage = (
    member: (typeof members)[number],
    keySuffix: string,
  ) => (
    <div
      key={`${member.pokemonId ?? member.name}-img-${keySuffix}`}
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
  )

  const renderMemberName = (
    member: (typeof members)[number],
    index: number,
  ) => {
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
  }

  return (
    <article
      className="w-full bg-primary-4 border-[2px] border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4 relative desktop:h-32 desktop:flex desktop:items-center desktop:gap-4"
      aria-label={`팀 코어 ${core.rank}위: ${members.map((m) => m.name).join(' + ')}`}
    >
      {/* === 모바일 레이아웃: 세로 스택 === */}
      <div className="desktop:hidden">
        {/* 상단: 순위 뱃지 + 이미지 + 조합명 */}
        <div className="flex items-center gap-3 mb-3">
          <p className="w-12 h-12 shrink-0 flex items-center justify-center bg-primary-1 text-white rounded-md text-base font-bold">
            #{core.rank}
          </p>
          <div className="flex items-center gap-2 shrink-0" aria-hidden="true">
            {members.map((member) => renderImage(member, 'mobile'))}
          </div>
        </div>

        <h3 className="flex items-center gap-2 flex-wrap text-base font-bold text-primary-1 mb-3">
          {members.map((member, index) => renderMemberName(member, index))}
        </h3>

        {/* 하단: 통계 (가로 분할) */}
        <dl className="grid grid-cols-2 border-t-2 border-primary-3 pt-3">
          <div className="flex flex-col items-center text-center relative after:absolute after:right-0 after:top-0 after:h-full after:w-[2px] after:bg-primary-3">
            <dt className="text-xs text-gray-600 mb-1">사용률</dt>
            <dd className="text-lg font-bold text-primary-1">{usageRate}%</dd>
          </div>
          <div className="flex flex-col items-center text-center">
            <dt className="text-xs text-gray-600 mb-1">채용팀</dt>
            <dd className="text-lg font-bold text-primary-1">
              {teamsCountLabel}
            </dd>
          </div>
        </dl>
      </div>

      {/* === 데스크탑 레이아웃: 가로 한 줄 === */}
      <p className="hidden desktop:flex w-16 h-24 shrink-0 items-center justify-center bg-primary-1 text-white rounded-md text-base font-bold">
        #{core.rank}
      </p>

      <div
        className="hidden desktop:flex items-center gap-2 shrink-0"
        aria-hidden="true"
      >
        {members.map((member) => renderImage(member, 'desktop'))}
      </div>

      <h3 className="hidden desktop:flex flex-1 items-center gap-2 flex-wrap text-base font-bold text-primary-1">
        {members.map((member, index) => renderMemberName(member, index))}
      </h3>

      <dl className="hidden desktop:grid w-48 h-24 shrink-0 grid-cols-2">
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
