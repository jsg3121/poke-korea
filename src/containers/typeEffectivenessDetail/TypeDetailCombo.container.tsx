import { Fragment } from 'react'

import { TYPE_DETAIL_CONTENT } from '~/constants/typeDetailContent'
import { PokemonType } from '~/graphql/typeGenerated'
import { getTypeLabel, parseTypeLabel } from '~/modules/typeParams.module'
import Tag from '~/components/tag/Tag.component'

interface TypeDetailComboProps {
  pokemonType: PokemonType
}

const TypeDetailCombo = ({ pokemonType }: TypeDetailComboProps) => {
  const label = getTypeLabel(pokemonType)
  const content = TYPE_DETAIL_CONTENT[pokemonType]

  if (!content) return null

  return (
    <>
      <section
        aria-labelledby="type-detail-combo"
        className="w-full pt-10 desktop:pt-14"
      >
        <h2
          id="type-detail-combo"
          className="mb-2 text-xl font-semibold leading-tight text-primary-4 desktop:text-3xl"
        >
          {label} 타입이 포함된 복합 타입
        </h2>
        <p className="mb-4 text-sm text-primary-3">
          실제로 존재하는 조합이에요. 두 타입의 배율이 곱해져 4배 약점이나
          무효가 생기기도 해요.
        </p>
        <ul className="grid grid-cols-1 gap-4 desktop:grid-cols-2 desktop:gap-5">
          {content.combos.map((combo) => (
            <li
              key={combo.label}
              className="rounded-2xl bg-primary-4 p-5 desktop:p-6"
            >
              <h3 className="flex flex-wrap items-center gap-1.5 text-base font-bold text-primary-1 desktop:text-lg">
                {combo.label.split('/').map((part, index) => {
                  const type = parseTypeLabel(part)
                  return (
                    <Fragment key={`${combo.label}-${part}`}>
                      {index > 0 && (
                        <span aria-hidden="true" className="text-primary-2">
                          /
                        </span>
                      )}
                      {type ? <Tag type={type} /> : <span>{part}</span>}
                    </Fragment>
                  )
                })}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-primary-1 desktop:text-base">
                {combo.description}
              </p>
              <p className="mt-2 text-xs text-primary-2 desktop:text-sm">
                예: {combo.examples}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {content.specialEffect && (
        <section
          aria-labelledby="type-detail-effect"
          className="w-full pt-10 desktop:pt-14"
        >
          <h2
            id="type-detail-effect"
            className="mb-2 text-xl font-semibold leading-tight text-primary-4 desktop:text-3xl"
          >
            {label} 타입의 고유 효과
          </h2>
          <p className=" text-base leading-relaxed text-primary-4">
            {content.specialEffect}
          </p>
        </section>
      )}
    </>
  )
}

export default TypeDetailCombo
