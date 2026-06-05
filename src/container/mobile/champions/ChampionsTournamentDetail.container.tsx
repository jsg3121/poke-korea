import Link from 'next/link'
import ChampionsTournamentTeamCard from '~/components/champions/ChampionsTournamentTeamCard.component'
import { ChampionsTournamentDetailFragment } from '~/graphql/typeGenerated'
import {
  CHAMPIONS_DEFAULT_FORMAT_SLUG,
  formatKstDate,
  getFormatEnumShortLabel,
} from '~/utils/championsFormat.util'

interface ChampionsTournamentDetailContainerProps {
  detail: ChampionsTournamentDetailFragment
}

const ChampionsTournamentDetailContainer = ({
  detail,
}: ChampionsTournamentDetailContainerProps) => {
  const formatLabel = getFormatEnumShortLabel(detail.format)
  const dateLabel = formatKstDate(detail.date)
  const sortedTeams = [...detail.teams].sort((a, b) => a.rank - b.rank)
  const top8 = sortedTeams.filter((t) => t.rank <= 8)
  const top3 = top8.filter((t) => t.rank <= 3)
  const top4to8 = top8.filter((t) => t.rank >= 4)

  return (
    <section className="w-full mt-6 pb-8 px-4">
      <nav aria-label="페이지 경로" className="mb-3 text-xs text-primary-3">
        <Link
          href={`/champions/${CHAMPIONS_DEFAULT_FORMAT_SLUG}`}
          className="hover:text-primary-4"
        >
          챔피언스
        </Link>
        <span className="mx-1">/</span>
        <Link href="/champions/tournaments" className="hover:text-primary-4">
          대회
        </Link>
      </nav>

      <header className="mb-6 bg-primary-4 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3 text-xs">
          <span className="bg-amber-500 text-white font-bold px-2 py-0.5 rounded">
            {formatLabel}
          </span>
          <span
            className={`${
              detail.isOnline ? 'bg-teal-500' : 'bg-amber-600'
            } text-white font-bold px-2 py-0.5 rounded`}
          >
            {detail.isOnline ? '온라인' : '오프라인'}
          </span>
          {dateLabel && (
            <span className="text-primary-2 font-semibold">{dateLabel}</span>
          )}
        </div>
        <h1 className="text-lg font-bold text-primary-1 mb-3">{detail.name}</h1>
        <dl className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-primary-2 border-t-2 border-primary-3 pt-3">
          {detail.playersCount != null && (
            <div>
              <dt className="sr-only">참가자</dt>
              <dd>
                참가자 <b className="text-primary-1">{detail.playersCount}명</b>
              </dd>
            </div>
          )}
          {detail.organizerName && (
            <div>
              <dt className="sr-only">주최자</dt>
              <dd>
                주최 <b className="text-primary-1">{detail.organizerName}</b>
              </dd>
            </div>
          )}
        </dl>
        {detail.sourceUrl && (
          <a
            href={detail.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="외부 사이트에서 원본 대회 결과 보기 (새 창)"
            className="inline-block mt-3 text-xs text-primary-1 hover:text-primary-2 underline underline-offset-2"
          >
            원본 보기 ↗
          </a>
        )}
      </header>

      {top3.length > 0 && (
        <section aria-labelledby="top3-heading-mobile" className="mb-6">
          <h2
            id="top3-heading-mobile"
            className="text-lg font-bold text-primary-4 mb-3"
          >
            입상자 (Top 3)
          </h2>
          <ul className="flex flex-col gap-4" aria-label="Top 3 입상자">
            {top3.map((team) => (
              <li key={team.id}>
                <ChampionsTournamentTeamCard
                  team={team}
                  formatSlug={CHAMPIONS_DEFAULT_FORMAT_SLUG}
                  variant="highlight"
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {top4to8.length > 0 && (
        <section aria-labelledby="top4to8-heading-mobile">
          <h2
            id="top4to8-heading-mobile"
            className="text-lg font-bold text-primary-4 mb-3"
          >
            상위 입상자 (4~8위)
          </h2>
          <ul className="flex flex-col gap-3" aria-label="4~8위 입상자">
            {top4to8.map((team) => (
              <li key={team.id}>
                <ChampionsTournamentTeamCard
                  team={team}
                  formatSlug={CHAMPIONS_DEFAULT_FORMAT_SLUG}
                  variant="compact"
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  )
}

export default ChampionsTournamentDetailContainer
