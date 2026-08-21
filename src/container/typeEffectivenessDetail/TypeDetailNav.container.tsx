import Link from 'next/link'
import LinkButtonComponent from '~/components/button/LinkButton.component'
import TagComponent from '~/components/tag/Tag.component'
import { PokemonType } from '~/graphql/typeGenerated'
import { buildTypeDetailPath, getTypeLabel } from '~/module/typeParams.module'

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

const TYPE_ORDER: ReadonlyArray<PokemonType> = Object.values(PokemonType)

const TypeDetailNavContainer = ({
  pokemonType,
}: TypeDetailNavContainerProps) => {
  const label = getTypeLabel(pokemonType)

  return (
    <>
      <section
        aria-labelledby="type-detail-cta"
        className="w-full pt-8 desktop:pt-10"
      >
        <h2
          id="type-detail-cta"
          className="mb-2 text-xl font-semibold leading-tight text-primary-4 desktop:text-3xl"
        >
          복합 타입 조합이 궁금하다면
        </h2>
        <p className="mb-4 max-w-2xl text-base leading-relaxed text-primary-3">
          이 페이지는 {label} 타입 단독 기준이에요. 상대가 두 가지 타입을 가지고
          있다면 계산기에서 조합 배율을 바로 확인할 수 있어요.
        </p>
        <LinkButtonComponent href="/type-effectiveness" showArrow>
          타입 상성 계산기로 이동
        </LinkButtonComponent>
      </section>

      <nav
        aria-labelledby="type-detail-others"
        className="w-full pt-8 desktop:pt-10"
      >
        <h2
          id="type-detail-others"
          className="mb-4 text-xl font-semibold leading-tight text-primary-4 desktop:text-3xl"
        >
          다른 타입 상성 보기
        </h2>
        <ul className="flex flex-wrap gap-2">
          {TYPE_ORDER.filter((type) => type !== pokemonType).map((type) => (
            <li key={type}>
              <Link
                href={buildTypeDetailPath(type)}
                aria-label={`${getTypeLabel(type)} 타입 약점과 상성 보기`}
                className="block rounded-lg transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
              >
                <TagComponent type={type} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

export default TypeDetailNavContainer
