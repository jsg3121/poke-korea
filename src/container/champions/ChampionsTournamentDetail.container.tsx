import Link from 'next/link'
import ChampionsTournamentTeamCard from '~/components/champions/ChampionsTournamentTeamCard.component'
import { ChampionsTournamentDetailFragment } from '~/graphql/typeGenerated'
import {
  CHAMPIONS_DEFAULT_FORMAT_SLUG,
  formatKstDate,
  getFormatEnumShortLabel,
} from '~/utils/championsFormat.util'

/**
 * 챔피언스 대회 상세 본문 (반응형 단일, ADR-0007 / UX-011, E-3).
 *
 * 구버전 desktop/mobile 2벌 컨테이너를 CSS 반응형 단일로 통합한다.
 * - 상세는 엔티티 페이지라 공용 PageHeader 대신 진한 배경 정보 카드를 자체 헤더로 유지
 *   (champions 포켓몬 상세와 동일 패턴).
 * - "원본 보기"는 아웃라인 버튼으로 승격(데스크톱 우상단 / 모바일 하단 별도 행).
 * - Top1~3 강조(항상 펼침) / Top4~8 컴팩트(접이식 개별). 두 그리드 모두 items-start 로
 *   같은 행에서 한 카드를 펼쳐도 옆 카드 높이가 끌려 늘어나지 않게 한다(UX-011 피드백).
 */
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
    <section className="w-full max-w-[1280px] min-h-dvh mx-auto px-4 pb-12 desktop:px-5">
      <Link
        href="/champions/tournaments"
        aria-label="대회 목록으로 돌아가기"
        className="inline-flex items-center gap-1 mt-4 mb-3 text-sm text-primary-3 hover:text-primary-4"
      >
        ← 대회 목록
      </Link>

      <header className="relative mb-6 bg-primary-4 rounded-xl p-5 desktop:mb-8 desktop:p-6">
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

        <h1 className="text-lg font-bold text-primary-1 mb-4 desktop:text-2xl">
          {detail.name}
        </h1>

        <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-primary-2 border-t-2 border-primary-3 pt-3">
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

        {/* 원본 보기 — 아웃라인 버튼. 데스크톱은 카드 우상단 절대배치,
            모바일은 카드 하단 full-width 별도 행(가로 공간 부족 회피, UX-011). */}
        {detail.sourceUrl && (
          <a
            href={detail.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="외부 사이트에서 원본 대회 결과 보기 (새 창)"
            className="mt-4 flex w-full items-center justify-center gap-1 rounded-md border-[2px] border-solid border-primary-1 px-3 py-2 text-sm font-bold text-primary-1 transition-colors hover:bg-primary-1 hover:text-primary-4 desktop:absolute desktop:right-6 desktop:top-6 desktop:mt-0 desktop:w-auto desktop:px-4 desktop:py-1.5"
          >
            원본 보기 ↗
          </a>
        )}
      </header>

      {/* Top 1~3 강조 */}
      {top3.length > 0 && (
        <section aria-labelledby="top3-heading" className="mb-8">
          <h2
            id="top3-heading"
            className="text-lg font-bold text-primary-4 mb-4 desktop:text-xl"
          >
            입상자 (Top 3)
          </h2>
          {/* items-start: 같은 행에서 한 카드의 슬롯을 접거나 펼쳐도 옆 카드 높이가
              함께 변하지 않도록 각 카드가 자기 콘텐츠 높이만 갖게 한다(UX-011 피드백). */}
          <ul
            className="grid grid-cols-1 items-start gap-6 desktop:grid-cols-3"
            aria-label="Top 3 입상자"
          >
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

      {/* Top 4~8 컴팩트 */}
      {top4to8.length > 0 && (
        <section aria-labelledby="top4to8-heading">
          <h2
            id="top4to8-heading"
            className="text-lg font-bold text-primary-4 mb-4 desktop:text-xl"
          >
            상위 입상자 (4~8위)
          </h2>
          {/* items-start: 각 카드가 펼침/접힘 독립이라 행 높이를 균일화하면 한 카드를
              펼칠 때 같은 행의 다른 카드까지 높이가 끌려 늘어난다. 자연 높이로 둔다. */}
          <ul
            className="grid grid-cols-1 items-start gap-4 desktop:grid-cols-2"
            aria-label="4~8위 입상자"
          >
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
