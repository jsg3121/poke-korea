import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import { GetChampionsTournamentsWithTopTeamQuery } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import {
  formatKstDate,
  getFormatEnumShortLabel,
} from '~/utils/championsFormat.util'

type TournamentWithTopTeam =
  GetChampionsTournamentsWithTopTeamQuery['championsTournaments'][number]

interface ChampionsTournamentCardProps {
  tournament: TournamentWithTopTeam
}

const ChampionsTournamentCard = ({
  tournament,
}: ChampionsTournamentCardProps) => {
  const dateLabel = formatKstDate(tournament.date)
  const formatLabel = getFormatEnumShortLabel(tournament.format)
  const onlineLabel = tournament.isOnline ? '온라인' : '오프라인'
  // 1위팀 = 응답이 rank 오름차순이라는 가정 하에 rank===1 추출 (없으면 첫 팀 폴백)
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
        {/* 라벨 영역 */}
        <div className="flex items-center gap-2 mb-3 text-xs">
          <span className="bg-amber-500 text-white font-bold px-2 py-0.5 rounded">
            {formatLabel}
          </span>
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

        {/* 대회명 */}
        <h3 className="text-base font-bold text-primary-1 line-clamp-2 mb-2 min-h-[3rem]">
          {tournament.name}
        </h3>

        {/* 주최자 */}
        {tournament.organizerName && (
          <p className="text-xs text-primary-2 mb-3">
            주최: {tournament.organizerName}
          </p>
        )}

        {/* 구분선 */}
        <div className="border-t-2 border-primary-3 my-2" />

        {/* 참가자 + 1위 선수 */}
        <div className="flex items-center justify-between text-xs mb-3">
          {tournament.playersCount != null && (
            <span className="text-primary-1 font-semibold">
              참가자 {tournament.playersCount}명
            </span>
          )}
          {topTeam && (
            <span className="text-primary-1 font-semibold truncate ml-2">
              1위: {topTeam.playerName}
            </span>
          )}
        </div>

        {/* 1위팀 포켓몬 6마리 미리보기 */}
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
                    <ImageComponent
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
