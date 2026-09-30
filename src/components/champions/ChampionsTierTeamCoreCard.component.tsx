import Link from 'next/link'

import { ChampionsTeamCoreFragment } from '~/graphql/typeGenerated'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
} from '~/utils/championsFormat.util'
import { imageMode } from '~/modules/buildMode.module'
import Image from '~/components/Image.component'

interface ChampionsTierTeamCoreCardProps {
  core: ChampionsTeamCoreFragment
  formatSlug: ChampionsFormatSlug
}

const IMAGE_DIM = {
  className: 'w-14 h-14',
  rem: '3.5rem',
  px: 56,
} as const

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
      <h3 className="flex items-center gap-2 flex-wrap text-xs font-bold text-primary-1 mb-3 desktop:text-sm">
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

      <div className="flex items-center gap-2 border-t-2 border-primary-3">
        {members.map((member) => {
          const href = buildPokemonHref(
            member.pokemonId,
            member.formType,
            member.formCode,
          )
          const imageContent = member.imagePath ? (
            <Image
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
