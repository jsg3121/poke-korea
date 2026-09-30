import Link from 'next/link'

import { GetChampionsTournamentsWithTopTeamQuery } from '~/graphql/typeGenerated'
import { formatKstDate } from '~/utils/championsFormat.util'
import { imageMode } from '~/modules/buildMode.module'
import Image from '~/components/Image.component'

type TournamentWithTopTeam =
  GetChampionsTournamentsWithTopTeamQuery['championsTournaments'][number]

interface ChampionsTournamentCardProps {
  tournament: TournamentWithTopTeam
}

const ChampionsTournamentCard = ({
  tournament,
}: ChampionsTournamentCardProps) => {
  const dateLabel = formatKstDate(tournament.date)
  const onlineLabel = tournament.isOnline ? '온라인' : '오프라인'
  const topTeam =
    tournament.teams.find((t) => t.rank === 1) ?? tournament.teams[0]

  return (
    <Link
      href={`/champions/tournaments/${tournament.externalId}`}
      className="block w-full h-full hover:scale-[1.02] transition-transform"
    >
      <article
        className="w-full h-full bg-primary-4 border-[2px] border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-5 flex flex-col"
        aria-label={`${tournament.name} 대회 결과`}
      >
        <div className="flex items-center gap-2 mb-3 text-xs">
          <span
            className={`${
              tournament.isOnline ? 'bg-teal-500' : 'bg-amber-600'
            } text-white font-bold px-2 py-0.5 rounded`}
          >
            {onlineLabel}
          </span>
          {dateLabel && (
            <span className="ml-auto text-primary-2 font-semibold">
              {dateLabel}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-primary-1 line-clamp-2 mb-2 min-h-[3rem]">
          {tournament.name}
        </h3>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs mb-3">
          {tournament.playersCount != null && (
            <span className="text-primary-1 font-bold">
              참가자 {tournament.playersCount}명
            </span>
          )}
          {tournament.organizerName && (
            <span className="text-primary-2">
              {tournament.playersCount != null && (
                <span className="mr-2 text-primary-3" aria-hidden="true">
                  ·
                </span>
              )}
              {tournament.organizerName}
            </span>
          )}
        </div>

        <div className="border-t-2 border-primary-3 my-2" />

        {topTeam && (
          <div className="flex items-center text-xs mb-3">
            <span className="text-primary-1 font-semibold truncate">
              1위: {topTeam.playerName}
            </span>
          </div>
        )}

        {topTeam && topTeam.slots.length > 0 && (
          <ul
            className="flex items-center gap-2 mt-auto"
            aria-label="1위팀 포켓몬 미리보기"
          >
            {topTeam.slots.map((slot) => {
              const name = slot.displayName || slot.rawName
              return (
                <li
                  key={`${slot.pokemonId ?? name}`}
                  className="w-8 h-8 shrink-0"
                >
                  {slot.imagePath ? (
                    <Image
                      src={`${imageMode}/${slot.imagePath}`}
                      alt={`${name} 포켓몬 이미지`}
                      width="2rem"
                      height="2rem"
                      imageSize={{ width: 32, height: 32 }}
                      densities={[1, 1.5]}
                      loading="lazy"
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-primary-3" />
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </article>
    </Link>
  )
}

export default ChampionsTournamentCard
