import { TYPE_DETAIL_CONTENT } from '~/constants/typeDetailContent'
import { PokemonType } from '~/graphql/typeGenerated'
import { getTypeLabel } from '~/module/typeParams.module'

/**
 * FAQ — 네이티브 `<details>` 아코디언.
 *
 * `'use client'` 없이 동작하고, **접힌 답변도 DOM에 남아 크롤러가 읽는다.**
 * JS로 접었다 펴는 구현이면 초기 HTML에 답변이 없거나 있어도 숨김 처리라
 * 색인 가치가 떨어진다. 이 페이지는 검색 유입이 목적이라 그 차이가 크다.
 *
 * 같은 내용이 FAQPage JSON-LD로도 나간다(`getTypeDetailFaqJsonLd`). 구조화
 * 데이터와 화면 내용이 일치해야 하므로 **두 곳 모두 같은 상수를 원천으로** 쓴다.
 *
 * 데스크톱에서 아코디언 헤더·테두리는 전체 폭을 쓰고, 답변 본문만 가독 폭으로
 * 제한한다(시안 결정) — 질문 한 줄짜리 목록이 좁은 폭에 갇히면 어색하다.
 */

interface TypeDetailFaqContainerProps {
  pokemonType: PokemonType
}

const TypeDetailFaqContainer = ({
  pokemonType,
}: TypeDetailFaqContainerProps) => {
  const label = getTypeLabel(pokemonType)
  const content = TYPE_DETAIL_CONTENT[pokemonType]

  if (!content || content.faq.length === 0) return null

  return (
    <section
      aria-labelledby="type-detail-faq"
      className="w-full pt-8 desktop:pt-10"
    >
      <h2
        id="type-detail-faq"
        className="mb-4 text-xl font-semibold leading-tight text-primary-4 desktop:text-3xl"
      >
        {label} 타입 자주 묻는 질문
      </h2>
      <div className="flex w-full flex-col gap-2">
        {content.faq.map((item) => (
          <details
            key={item.question}
            className="group w-full rounded-2xl border border-solid border-primary-3 bg-primary-1 px-4 py-3 desktop:px-5"
          >
            <summary className="cursor-pointer list-none text-base font-bold text-primary-4 marker:content-none">
              <span className="flex items-center justify-between gap-3">
                {item.question}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-primary-3 transition-transform group-open:rotate-180"
                >
                  ▾
                </span>
              </span>
            </summary>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-primary-3">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}

export default TypeDetailFaqContainer
