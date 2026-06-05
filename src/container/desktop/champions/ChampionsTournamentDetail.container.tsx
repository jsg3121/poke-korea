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
  // 응답이 rank 오름차순이 아닐 수 있으니 안전하게 정렬 + Top 8 만 추출
  const sortedTeams = [...detail.teams].sort((a, b) => a.rank - b.rank)
  const top8 = sortedTeams.filter((t) => t.rank <= 8)
  const top3 = top8.filter((t) => t.rank <= 3)
  const top4to8 = top8.filter((t) => t.rank >= 4)

  return (
    <section className="w-full max-w-[1280px] mx-auto pb-12 mt-12 px-5">
      <nav aria-label="페이지 경로" className="mb-3 text-sm text-primary-3">
        <Link
          href={`/champions/${CHAMPIONS_DEFAULT_FORMAT_SLUG}`}
          className="hover:text-primary-4"
        >
          챔피언스
        </Link>
        <span className="mx-2">/</span>
        <Link href="/champions/tournaments" className="hover:text-primary-4">
          대회
        </Link>
      </nav>

      <header className="mb-8 bg-primary-4 rounded-xl p-6">
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
        <h1 className="text-2xl font-bold text-primary-1 mb-4">
          {detail.name}
        </h1>
        <dl className="flex flex-wrap items-center gap-4 text-sm text-primary-2 border-t-2 border-primary-3 pt-3">
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
          {detail.sourceUrl && (
            <a
              href={detail.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="외부 사이트에서 원본 대회 결과 보기 (새 창)"
              className="ml-auto inline-flex items-center gap-1 text-primary-1 hover:text-primary-2 underline underline-offset-2"
            >
              원본 보기 ↗
            </a>
          )}
        </dl>
      </header>

      {/* Top 1~3 강조 */}
      {top3.length > 0 && (
        <section aria-labelledby="top3-heading" className="mb-8">
          <h2
            id="top3-heading"
            className="text-xl font-bold text-primary-4 mb-4"
          >
            입상자 (Top 3)
          </h2>
          <ul
            className="grid grid-cols-1 desktop:grid-cols-3 gap-6 auto-rows-fr"
            aria-label="Top 3 입상자"
          >
            {top3.map((team) => (
              <li key={team.id} className="h-full">
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

      {/* Top 4~8 컴팩트 */}
      {top4to8.length > 0 && (
        <section aria-labelledby="top4to8-heading">
          <h2
            id="top4to8-heading"
            className="text-xl font-bold text-primary-4 mb-4"
          >
            상위 입상자 (4~8위)
          </h2>
          <ul
            className="grid grid-cols-1 desktop:grid-cols-2 gap-4 auto-rows-fr"
            aria-label="4~8위 입상자"
          >
            {top4to8.map((team) => (
              <li key={team.id} className="h-full">
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
