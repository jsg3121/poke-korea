import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import { GetChampionsTournamentsWithTopTeamQuery } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { formatKstDate } from '~/utils/championsFormat.util'

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
        {/* 라벨 영역 — VGC 배지는 상단 안내 배너가 이미 선언하므로 제거(UX-011).
            온라인/오프라인 배지 + 날짜만 노출. */}
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

        {/* 대회명 */}
        <h3 className="text-base font-bold text-primary-1 line-clamp-2 mb-2 min-h-[3rem]">
          {tournament.name}
        </h3>

        {/* 참가자 수(상단 승격) + 주최 — 스캔성 높은 정보를 대회명 바로 아래로(UX-011) */}
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

        {/* 구분선 */}
        <div className="border-t-2 border-primary-3 my-2" />

        {/* 1위 선수 */}
        {topTeam && (
          <div className="flex items-center text-xs mb-3">
            <span className="text-primary-1 font-semibold truncate">
              1위: {topTeam.playerName}
            </span>
          </div>
        )}

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
