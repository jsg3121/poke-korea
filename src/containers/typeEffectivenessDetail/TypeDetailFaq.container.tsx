import { TYPE_DETAIL_CONTENT } from '~/constants/typeDetailContent'
import { PokemonType } from '~/graphql/typeGenerated'
import { getTypeLabel } from '~/modules/typeParams.module'

interface TypeDetailFaqProps {
  pokemonType: PokemonType
}

const TypeDetailFaq = ({ pokemonType }: TypeDetailFaqProps) => {
  const label = getTypeLabel(pokemonType)
  const content = TYPE_DETAIL_CONTENT[pokemonType]

  if (!content || content.faq.length === 0) return null

  return (
    <section
      aria-labelledby="type-detail-faq"
      className="w-full pt-10 desktop:pt-14"
    >
      <h2
        id="type-detail-faq"
        className="mb-4 text-xl font-semibold leading-tight text-primary-4 desktop:text-3xl"
      >
        {label} 타입 자주 묻는 질문
      </h2>
      <div className="flex w-full flex-col gap-3">
        {content.faq.map((item) => (
          <details
            key={item.question}
            className="group w-full overflow-hidden rounded-2xl border border-solid border-primary-3 bg-primary-1 transition-colors hover:border-primary-4 hover:bg-primary-2"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-base font-bold text-primary-4 marker:content-none desktop:px-6 desktop:py-5 [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                aria-hidden="true"
                className="shrink-0 text-primary-3 transition-transform group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <p className="px-5 pb-4 text-base leading-relaxed text-primary-3 desktop:px-6 desktop:pb-5">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}

export default TypeDetailFaq
