import Link from 'next/link'

import { TYPE_DETAIL_CONTENT } from '~/constants/typeDetailContent'
import { PokemonType } from '~/graphql/typeGenerated'
import { calculateRelationType } from '~/modules/calculateRelationType.module'
import { getTypeLabel } from '~/modules/typeParams.module'
import Tag from '~/components/tag/Tag.component'

interface TypeDetailSummaryProps {
  pokemonType: PokemonType
}

const TypeDetailSummary = ({ pokemonType }: TypeDetailSummaryProps) => {
  const label = getTypeLabel(pokemonType)
  const content = TYPE_DETAIL_CONTENT[pokemonType]
  const relation = calculateRelationType([pokemonType])

  return (
    <header className="w-full">
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
        <p className="mt-2 text-base leading-relaxed text-primary-3">
          {content.lead}
        </p>
      )}

      <div className="mt-5 rounded-2xl bg-primary-4 p-5 desktop:p-8">
        <dl className="flex flex-col gap-5 desktop:flex-row desktop:gap-8">
          <div className="flex-1 border-l-4 border-solid border-grade-warning pl-3">
            <dt className="text-sm font-bold text-primary-1 desktop:text-base">
              약한 공격 (2배)
            </dt>
            <dd className="m-0 mt-1.5 flex flex-wrap gap-1.5">
              {relation.double.length > 0 ? (
                relation.double.map((type) => <Tag key={type} type={type} />)
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
                relation.half.map((type) => <Tag key={type} type={type} />)
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
                  <Tag key={type} type={type} />
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {content && (
        <p className="mt-4 text-base leading-relaxed text-primary-4">
          {content.uniqueFacts}
        </p>
      )}
    </header>
  )
}

export default TypeDetailSummary
