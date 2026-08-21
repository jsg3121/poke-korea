import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import LinkButtonComponent from '~/components/button/LinkButton.component'
import { TYPE_ORDER } from '~/constants/typeEffectivenessChart'
import { PokemonType } from '~/graphql/typeGenerated'
import {
  buildTypeDetailPath,
  buildTypeSlug,
  getTypeLabel,
  parseTypeLabel,
} from '~/module/typeParams.module'

/**
 * 하단 이동 영역 — 계산기 복귀 CTA + 다른 타입 18개 링크.
 *
 * ## 계산기로 되돌리는 이유
 *
 * 이 페이지는 단일 타입 정보만 다룬다. 복합 타입 조합을 계산하려는 사용자는
 * 메인 계산기로 보내야 한다(§12 — 상세 페이지에 계산기를 복제하지 않는다).
 * 메인은 `포켓몬 상성 계산기` 검색에서 1위를 유지 중이라(§26.8.5) 그 자산을
 * 해치지 않고 트래픽을 순환시키는 것이 낫다.
 *
 * ## 18개 상호 링크
 *
 * 타입 페이지끼리 서로 링크하면 크롤 경로가 조밀해져 신규 URL 색인이 빨라진다
 * ([Crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)).
 * 18개 전부 출시하므로 404 걱정 없이 전체를 링크할 수 있다 — 이것이 1차 범위를
 * 3개에서 18개로 넓힌 실질적 근거였다(§26.9.4).
 */

interface TypeDetailNavContainerProps {
  pokemonType: PokemonType
}

/**
 * 도감 순서. `Object.values(PokemonType)`는 GraphQL enum이라 알파벳순
 * (벌레·악·드래곤…)으로 나오는데, 메인 페이지의 타입 링크·상성표는 도감 순
 * (노말·불꽃·물…)이다. 같은 18개 목록이 화면마다 다른 순서로 보이면 사용자가
 * 같은 타입을 두 번 찾게 된다.
 */
const TYPE_LINK_ORDER: ReadonlyArray<PokemonType> = TYPE_ORDER.map(
  (label) => parseTypeLabel(label) as PokemonType,
)

const TypeDetailNavContainer = ({
  pokemonType,
}: TypeDetailNavContainerProps) => {
  const label = getTypeLabel(pokemonType)

  return (
    <>
      <section
        aria-labelledby="type-detail-cta"
        className="w-full pt-10 desktop:pt-14"
      >
        <h2
          id="type-detail-cta"
          className="mb-2 text-xl font-semibold leading-tight text-primary-4 desktop:text-3xl"
        >
          복합 타입 조합이 궁금하다면
        </h2>
        <p className="mb-4 text-base leading-relaxed text-primary-3">
          이 페이지는 {label} 타입 단독 기준이에요. 상대가 두 가지 타입을 가지고
          있다면 계산기에서 조합 배율을 바로 확인할 수 있어요.
        </p>
        {/* 모바일 1열, 데스크톱 2열 균등. fullWidth로 각 칼럼을 채워 두 CTA의
            폭이 같아지게 한다(문구 길이에 따라 버튼 크기가 달라지지 않도록). */}
        <div className="grid grid-cols-1 gap-3 desktop:grid-cols-2 desktop:gap-4">
          <LinkButtonComponent href="/type-effectiveness" fullWidth showArrow>
            타입 상성 계산기로 이동
          </LinkButtonComponent>
          <LinkButtonComponent
            href="/quiz/type-effectiveness"
            variant="secondary"
            fullWidth
            showArrow
          >
            타입 상성 퀴즈 풀어보기
          </LinkButtonComponent>
        </div>
      </section>

      <nav
        aria-labelledby="type-detail-others"
        className="w-full pt-10 desktop:pt-14"
      >
        <h2
          id="type-detail-others"
          className="mb-4 text-xl font-semibold leading-tight text-primary-4 desktop:text-3xl"
        >
          다른 타입 상성 보기
        </h2>
        {/* Tag(타입 배지)를 링크로 쓰지 않는다 — Tag는 "이 포켓몬의 타입"을
            나타내는 표시용 DS라 링크로 전용하면 의미가 흐려지고, 배지 형태만으로는
            누를 수 있다는 신호도 약하다. 여기서는 타입 아이콘 + 타입명 + 화살표를
            갖춘 링크 카드로 만들어 이동 가능함을 형태로 드러낸다.
            아이콘은 계산기의 TypeChip과 같은 `public/assets/type/*.svg`를 쓴다 —
            svgr 컴포넌트 import는 `src/assets/` 하위만 대상이라 여기서는
            ImageComponent로 불러온다(TypeChip과 동일한 방식). */}
        <ul className="grid grid-cols-2 gap-2 desktop:grid-cols-6 desktop:gap-3">
          {TYPE_LINK_ORDER.filter((type) => type !== pokemonType).map(
            (type) => (
              <li key={type}>
                <Link
                  href={buildTypeDetailPath(type)}
                  aria-label={`${getTypeLabel(type)} 타입 약점과 상성 보기`}
                  className="flex min-h-touch w-full min-w-0 items-center justify-between gap-2 whitespace-nowrap rounded-2xl border border-solid border-primary-3 px-3 py-2 text-base font-semibold text-primary-4 transition-colors hover:border-primary-4 hover:bg-primary-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
                >
                  <span className="flex items-center gap-2">
                    <span className="block h-5 w-5 shrink-0 drop-shadow-[1px_2px_0px_var(--color-black-1)] desktop:h-6 desktop:w-6">
                      <ImageComponent
                        alt=""
                        aria-hidden="true"
                        src={`/assets/type/${buildTypeSlug(type)}.svg`}
                        width="100%"
                        height="100%"
                        imageSize={{ width: 24, height: 24 }}
                      />
                    </span>
                    {getTypeLabel(type)}
                  </span>
                  <span aria-hidden="true" className="text-primary-3">
                    ›
                  </span>
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>
    </>
  )
}

export default TypeDetailNavContainer
