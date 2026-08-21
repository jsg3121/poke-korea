import Link from 'next/link'
import TagComponent from '~/components/tag/Tag.component'
import { TYPE_DETAIL_CONTENT } from '~/constants/typeDetailContent'
import { PokemonType } from '~/graphql/typeGenerated'
import { calculateRelationType } from '~/module/calculateRelationType'
import { getTypeLabel } from '~/module/typeParams.module'

/**
 * 폴드 영역 — Breadcrumb + H1 + 리드 + 약점 즉답 + 고유 사실.
 *
 * ## 이 블록이 폴드를 독점하는 이유
 *
 * 이 페이지의 유입은 `독타입 약점` 계열 검색이다. 검색으로 들어온 사용자가
 * **스크롤 없이 약점을 확인**하는 것이 페이지의 존재 이유이므로, 375×812
 * 기준 실가용 690px 안에 답이 들어가야 한다. 광고를 폴드에 두지 않는 것도
 * 같은 이유다(시안 결정).
 *
 * 약점을 문장이 아니라 **타입 배지로 즉답**한다 — 문장은 읽어야 하지만 배지는
 * 훑으면 된다. 상세 배율표는 아래 블록에서 다시 전체를 보여주므로, 여기서의
 * 중복은 "요약 먼저, 상세는 아래" 패턴으로 의도된 것이다.
 */

interface TypeDetailSummaryContainerProps {
  pokemonType: PokemonType
}

const TypeDetailSummaryContainer = ({
  pokemonType,
}: TypeDetailSummaryContainerProps) => {
  const label = getTypeLabel(pokemonType)
  const content = TYPE_DETAIL_CONTENT[pokemonType]
  const relation = calculateRelationType([pokemonType])

  return (
    <header className="w-full">
      {/* Breadcrumb — JSON-LD BreadcrumbList와 짝을 이루는 시각 표시 */}
      <nav aria-label="현재 위치" className="mb-3">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-primary-3 desktop:text-sm">
          <li>
            <Link href="/" className="hover:text-primary-4 hover:underline">
              홈
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link
              href="/type-effectiveness"
              className="hover:text-primary-4 hover:underline"
            >
              타입 상성 계산기
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" className="font-bold text-primary-4">
            {label} 타입
          </li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold leading-tight text-primary-4 desktop:text-4xl">
        {label} 타입 약점과 상성
      </h1>

      {content && (
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-primary-3">
          {content.lead}
        </p>
      )}

      {/* 약점 즉답 카드 — 폴드의 핵심. 배율표 전체가 아니라 2배/0.5배만 */}
      <div className="mt-4 rounded-2xl bg-primary-4 p-4 desktop:p-6">
        <dl className="flex flex-col gap-4 desktop:flex-row desktop:gap-8">
          <div className="flex-1 border-l-4 border-solid border-grade-warning pl-3">
            <dt className="text-sm font-bold text-primary-1 desktop:text-base">
              약한 공격 (2배)
            </dt>
            <dd className="m-0 mt-1.5 flex flex-wrap gap-1.5">
              {relation.double.length > 0 ? (
                relation.double.map((type) => (
                  <TagComponent key={type} type={type} />
                ))
              ) : (
                <span className="text-sm text-primary-2">없어요</span>
              )}
            </dd>
          </div>
          <div className="flex-1 border-l-4 border-solid border-grade-good pl-3">
            <dt className="text-sm font-bold text-primary-1 desktop:text-base">
              잘 견디는 공격 (0.5배)
            </dt>
            <dd className="m-0 mt-1.5 flex flex-wrap gap-1.5">
              {relation.half.length > 0 ? (
                relation.half.map((type) => (
                  <TagComponent key={type} type={type} />
                ))
              ) : (
                <span className="text-sm text-primary-2">없어요</span>
              )}
            </dd>
          </div>
          {relation.zero.length > 0 && (
            <div className="flex-1 border-l-4 border-solid border-grade-best pl-3">
              <dt className="text-sm font-bold text-primary-1 desktop:text-base">
                받지 않는 공격 (0배)
              </dt>
              <dd className="m-0 mt-1.5 flex flex-wrap gap-1.5">
                {relation.zero.map((type) => (
                  <TagComponent key={type} type={type} />
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* 고유 사실 — 이 타입에만 성립하는 서술(§26.9.5 복제 회피 슬롯) */}
      {content && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-4">
          {content.uniqueFacts}
        </p>
      )}
    </header>
  )
}

export default TypeDetailSummaryContainer
