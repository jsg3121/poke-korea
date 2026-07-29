import LinkButtonComponent from '~/components/button/LinkButton.component'
import ChampionsTopCardComponent from '~/components/champions/ChampionsTopCard.component'
import HorizontalScrollListComponent from '~/components/horizontalScrollList/HorizontalScrollList.component'
import SectionHeadingComponent from '~/components/SectionHeading.component'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import {
  CHAMPIONS_DEFAULT_FORMAT_SLUG,
  getFormatLabel,
} from '~/utils/championsFormat.util'

/**
 * 홈 "이번 주 챔피언스 TOP 3" 섹션 (폴드 위, 반응형 단일 DS 조립 — UX-003 개정).
 *
 * 최근 챔피언스 유입이 많아 홈 최상단에 배치해 유입을 확대한다(사용자 결정).
 * CTA("챔피언스 전체 도감 보기")는 카드 직하 — 모바일 폴드 안 노출이 목적의 핵심이라
 * 섹션 맨 아래가 아니라 리스트 바로 밑에 둔다.
 *
 * 리스트는 모바일에서 가로 스크롤(다음 카드 peek), 데스크톱은 3장이 폭에 다 들어가
 * `max-w-fit + mx-auto` 래퍼로 중앙 정렬한다 — overflow 컨테이너에 justify-center를
 * 직접 주면 넘칠 때 좌측 카드가 잘려 스크롤 불가능해지므로 래퍼 방식을 쓴다
 * (넘치면 래퍼가 부모 폭에 캡되어 자연히 전폭 스크롤로 복귀).
 *
 * 빈 상태(length===0)면 섹션을 렌더하지 않는다 — 다음의 정적 섹션(허브 그리드)이
 * 첫 섹션이 되므로 폴드가 광고로 시작하지 않는다(광고는 허브 뒤, UX-003 §5).
 */

interface HomeChampionsContainerProps {
  topPokemons: Array<ChampionsMetaSummaryFragment>
}

const HomeChampionsContainer = ({
  topPokemons,
}: HomeChampionsContainerProps) => {
  if (topPokemons.length === 0) return null

  return (
    <section
      className="w-full px-4 desktop:px-8"
      aria-labelledby="home-champions-heading"
    >
      <SectionHeadingComponent id="home-champions-heading">
        이번 주 챔피언스 TOP 3
      </SectionHeadingComponent>
      <p className="mt-1 text-center text-sm desktop:text-base text-primary-3">
        {getFormatLabel(CHAMPIONS_DEFAULT_FORMAT_SLUG)} 채택 순위 기준
      </p>

      <div className="desktop:max-w-fit desktop:mx-auto">
        <HorizontalScrollListComponent aria-label="이번 주 챔피언스 TOP 3 목록">
          {topPokemons.map((pokemon) => (
            <ChampionsTopCardComponent
              key={`${pokemon.pokemonId}-${pokemon.formCode ?? 'base'}`}
              pokemonData={pokemon}
              formatSlug={CHAMPIONS_DEFAULT_FORMAT_SLUG}
              isHighPriority
            />
          ))}
        </HorizontalScrollListComponent>
      </div>

      <div className="mt-2 flex justify-center">
        <LinkButtonComponent
          href={`/champions/${CHAMPIONS_DEFAULT_FORMAT_SLUG}/list`}
          variant="primary"
          showArrow
        >
          챔피언스 전체 도감 보기
        </LinkButtonComponent>
      </div>
    </section>
  )
}

export default HomeChampionsContainer
