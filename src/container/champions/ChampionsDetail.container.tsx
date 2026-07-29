import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import ChampionsDetailStatsBanner from '~/components/adSlot/ChampionsDetailStatsBanner'
import ChampionsInContentBanner from '~/components/adSlot/ChampionsInContentBanner'
import StatBarComponent, {
  StatBarItem,
} from '~/components/statBar/StatBar.component'
import TagComponent from '~/components/tag/Tag.component'
import ChampionsDetailMetaSummaryBar from '~/components/champions/ChampionsDetailMetaSummaryBar.component'
import ChampionsFormTab from '~/components/champions/ChampionsFormTab.component'
import ChampionsMetaList from '~/components/champions/ChampionsMetaList.component'
import ChampionsPartnerList from '~/components/champions/ChampionsPartnerList.component'
import { CHAMPIONS_SLOTS } from '~/constants/adSense'
import { ChampionsPokemonDetailFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import {
  getBackgroundColor,
  pokemonNumberFormat,
} from '~/module/pokemonCard.module'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'

interface ChampionsDetailContainerProps {
  detail: ChampionsPokemonDetailFragment
  formatSlug: ChampionsFormatSlug
}

/**
 * 일반 도감 상세 페이지 URL 빌더 ("도감 보기" 외부 링크용).
 * 챔피언스 컨텍스트가 아닌 일반 도감 영역으로 진입한다.
 */
const getGeneralDetailUrl = (
  pokemonNumber: number,
  formType: string | null | undefined,
  formIndex: number | null | undefined,
) => {
  const baseUrl = `/detail/${pokemonNumber}`
  const index = formIndex ?? 0

  switch (formType) {
    case 'NORMAL':
      return index > 0 ? `${baseUrl}/form/${index}` : baseUrl
    case 'MEGA':
      return index > 0 ? `${baseUrl}/mega/${index}` : baseUrl
    case 'REGION':
      return index > 0 ? `${baseUrl}/region/${index}` : `${baseUrl}/region`
    default:
      return baseUrl
  }
}

/**
 * 챔피언스 상세 컨테이너 (반응형 단일, ADR-0013).
 *
 * 구버전 desktop/mobile 2벌 컨테이너(ChampionsDetail.container desktop/mobile)를
 * 통합한다(UX-010). 레이아웃은 모바일 세로 스택 → 데스크톱 "완화된 2단"(히어로
 * 전폭 → 좌측 능력치 + 우측 메타)으로 CSS 브레이크포인트만으로 전환한다.
 *
 * - 능력치는 레이더(canvas)가 아니라 StatBar(가로막대, 일반 상세와 시각 언어 통일,
 *   접근성 수치 DOM — ADR-0013 결정 5).
 * - 타입 배지는 신규 tag/Tag.component(토큰 기반).
 * - 좌측 능력치 컬럼 폭은 desktop:w-96(384px), 우측은 flex-1(우측 우세 비율 유지).
 */
const ChampionsDetailContainer = ({
  detail,
  formatSlug,
}: ChampionsDetailContainerProps) => {
  const { pokemon, meta, formSiblings } = detail
  const pokemonNumber = pokemonNumberFormat(pokemon.pokemonNumber)
  const backgroundColor = getBackgroundColor(pokemon.types)
  // 백엔드 응답 그대로 사용 (Phase 2/3 결정 — 합성 로직 제거)
  const displayName = pokemon.name

  const generalDetailUrl = getGeneralDetailUrl(
    pokemon.pokemonNumber,
    pokemon.formType,
    pokemon.formIndex,
  )

  const gradientStyle =
    backgroundColor.length === 1
      ? { backgroundColor: backgroundColor[0] }
      : {
          backgroundImage: `linear-gradient(135deg, ${backgroundColor[0]} 35%, ${backgroundColor[1]} 65%)`,
        }

  // StatBar 매핑 (라벨 순서는 일반 상세 DetailStats와 동일하게 통일)
  const statItems: StatBarItem[] = pokemon.stats
    ? [
        { label: '체력', value: pokemon.stats.hp },
        { label: '공격', value: pokemon.stats.attack },
        { label: '특수공격', value: pokemon.stats.specialAttack },
        { label: '방어', value: pokemon.stats.defense },
        { label: '특수방어', value: pokemon.stats.specialDefense },
        { label: '스피드', value: pokemon.stats.speed },
      ]
    : []

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 py-6 desktop:px-5 desktop:py-8">
      <ChampionsFormTab formSiblings={formSiblings} formatSlug={formatSlug} />

      {/* 히어로 카드 (타입 그라데이션, 전폭) */}
      <div
        className="rounded-xl p-4 desktop:p-6 mb-6 desktop:mb-8"
        style={gradientStyle}
      >
        {/* items-start = 도감 보기 링크를 항상 상단에 고정(브레드크럼 줄바꿈 무관) */}
        <nav className="mb-2 desktop:mb-3 flex items-start justify-between gap-2">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs desktop:text-sm text-black-2/70">
            <li>
              <Link
                href={`/champions/${formatSlug}`}
                className="hover:text-black-2 transition-colors break-keep"
              >
                챔피언스
              </Link>
            </li>
            <li className="text-black-2/50">/</li>
            <li>
              <Link
                href={`/champions/${formatSlug}/list`}
                className="hover:text-black-2 transition-colors break-keep"
              >
                포켓몬 도감
              </Link>
            </li>
            <li className="text-black-2/50">/</li>
            <li className="text-black-2 font-bold break-keep">{displayName}</li>
          </ol>
          <Link
            href={generalDetailUrl}
            className="shrink-0 text-xs desktop:text-sm text-black-2/80 hover:text-black-2 underline underline-offset-2 break-keep"
          >
            ↗ 도감 보기
          </Link>
        </nav>

        <div className="flex justify-between items-center">
          <span className="text-base desktop:text-lg font-medium text-black-2">
            No.{pokemonNumber}
          </span>
          <h1 className="text-lg desktop:text-xl font-bold text-black-2 break-keep">
            {displayName}
          </h1>
        </div>

        {/* w-full + mx-auto 컨테이너로 이미지를 확실히 중앙 정렬 */}
        <div className="my-2 desktop:my-3 flex justify-center mx-auto w-48 h-48 desktop:w-72 desktop:h-72">
          {pokemon.imagePath && (
            <ImageComponent
              src={`${imageMode}/${pokemon.imagePath}`}
              alt={displayName}
              height="100%"
              width="100%"
              sizes="(min-width: 769px) 10rem, 7rem"
              imageSize={{ height: 288, width: 288 }}
              fetchPriority="high"
            />
          )}
        </div>

        <div className="flex gap-2 justify-center">
          {pokemon.types.map((type) => (
            <TagComponent key={type} type={type} />
          ))}
        </div>

        <ChampionsDetailMetaSummaryBar meta={meta} />
      </div>

      {/* 모바일 전용 광고 — 히어로↔능력치 사이(진입 시 조기 노출로 노출 수
          극대화). 세로 스택인 모바일에서만 이 위치가 유효하다. 데스크톱 슬롯은
          빈 값(데스크톱은 좌측 능력치 컬럼 아래에 300×250로 별도 배치 —
          컴포넌트가 데스크톱에선 slot='' → null 반환, DOM에 안 들어간다). */}
      {meta && (
        <div className="mb-6">
          <ChampionsInContentBanner
            mobileSlot={CHAMPIONS_SLOTS.detailMobile}
            desktopSlot=""
          />
        </div>
      )}

      {/* 모바일: 세로 스택 / 데스크톱: 완화된 2단 (좌 능력치 + 우 메타).
          카드는 E-1 카드 셸과 동일한 라인(테두리 2px + 3px 셸 그림자)으로 통일. */}
      <div className="flex flex-col desktop:flex-row gap-7 desktop:gap-8">
        <aside className="w-full desktop:w-96 desktop:shrink-0">
          <div className="bg-primary-4 border-2 border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4">
            {/* 총합/스탯 구분선은 StatBar가 그리므로 제목엔 border를 두지 않는다(선 중복 회피) */}
            <h2 className="mb-3 text-lg desktop:text-xl font-extrabold text-primary-1">
              능력치
            </h2>
            {statItems.length > 0 && <StatBarComponent stats={statItems} />}
          </div>

          {/* 데스크톱 전용 광고(300×250) — 좌측 능력치 컬럼은 우측 메타패널보다
              짧아 하단에 빈 공간이 생긴다. 그 공간을 채워 콘텐츠를 밀어내지 않는다.
              384px 컬럼에 인아티클을 넣으면 소재 폭에 따라 삐져나갈 수 있어 폭
              고정 사각형을 쓴다. 모바일에선 렌더 안 함(모바일 광고는 메타패널 뒤). */}
          {meta && <ChampionsDetailStatsBanner />}
        </aside>

        <div className="flex-1 min-w-0">
          {meta ? (
            <div className="space-y-4 desktop:space-y-6">
              {meta.isStale && (
                <div className="p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                  데이터가 최신이 아닐 수 있습니다. (업데이트:{' '}
                  {new Date(meta.updatedAt).toLocaleDateString('ko-KR')})
                </div>
              )}

              {/* 메타 통합 패널: 하나의 카드(테두리+셸 그림자) 안에서, 각 섹션을
                  은은한 배경 블록(bg-primary-3/25)으로 구분한다(개편 전 카드 내부
                  구분 방식). 섹션 간 간격(space-y-3)으로 그룹감을 준다. */}
              <div className="bg-primary-4 border-2 border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4 space-y-3">
                <ChampionsMetaList title="인기 기술" items={meta.topMoves} />
                <ChampionsMetaList title="인기 도구" items={meta.topItems} />
                <ChampionsMetaList
                  title="인기 특성"
                  items={meta.topAbilities}
                />
                <ChampionsPartnerList
                  title="추천 파트너"
                  items={meta.topPartners}
                  formatSlug={formatSlug}
                />
              </div>

              <p className="text-xs text-primary-3 text-right">
                출처: <b className="font-bold">{meta.source}</b> <br />
                업데이트:{' '}
                <b className="font-bold">
                  {new Date(meta.updatedAt).toLocaleDateString('ko-KR')}
                </b>
              </p>
            </div>
          ) : (
            <div className="bg-primary-4 border-2 border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-6 text-center">
              <p className="text-primary-2 mb-4">
                아직 메타 데이터가 없습니다.
                <br />
                시즌이 시작되면 업데이트됩니다.
              </p>
              <Link
                href={`/champions/${formatSlug}/list`}
                className="inline-block px-4 py-2 bg-primary-1 text-primary-4 rounded-lg hover:bg-primary-2 transition-colors text-sm"
              >
                목록으로 돌아가기
              </Link>
            </div>
          )}
        </div>
      </div>

      <Link
        href={generalDetailUrl}
        className="block w-full mt-6 desktop:mt-8 py-3 text-center text-sm text-primary-3 hover:text-primary-1 underline underline-offset-2 transition-colors"
      >
        ↗ 일반 도감에서 자세히 보기
      </Link>
    </section>
  )
}

export default ChampionsDetailContainer
