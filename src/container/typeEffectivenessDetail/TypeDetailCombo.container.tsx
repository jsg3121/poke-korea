import { TYPE_DETAIL_CONTENT } from '~/constants/typeDetailContent'
import { PokemonType } from '~/graphql/typeGenerated'
import { getTypeLabel } from '~/module/typeParams.module'

/**
 * 복합 타입 사례 + 고유 효과.
 *
 * 복합 타입 조합은 상성표로 무한히 계산할 수 있지만, **실제 게임에 존재하는
 * 조합만** 다룬다(§26.9.4 장치 3). 계산 가능한 조합을 나열하는 것은 §22가
 * 금지한 "얇은 페이지 대량 생성"과 같은 성격이다. 각 조합에 실존 포켓몬을
 * 붙여 그 조합이 실재함을 보인다.
 *
 * 고유 효과는 메인 페이지 "타입별 추가 효과"에서 해당 타입 항목을 가져온
 * 것이다. 효과가 없는 타입은 섹션 자체를 렌더하지 않는다 — 빈 섹션을 두면
 * 18개 페이지의 구성이 같아 보이지만 내용이 없는 상태가 된다.
 */

interface TypeDetailComboContainerProps {
  pokemonType: PokemonType
}

const TypeDetailComboContainer = ({
  pokemonType,
}: TypeDetailComboContainerProps) => {
  const label = getTypeLabel(pokemonType)
  const content = TYPE_DETAIL_CONTENT[pokemonType]

  if (!content) return null

  return (
    <>
      <section
        aria-labelledby="type-detail-combo"
        className="w-full pt-8 desktop:pt-10"
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
        <ul className="grid grid-cols-1 gap-3 desktop:grid-cols-2 desktop:gap-4">
          {content.combos.map((combo) => (
            <li
              key={combo.label}
              className="rounded-2xl bg-primary-4 p-4 desktop:p-5"
            >
              <h3 className="text-base font-bold text-primary-1 desktop:text-lg">
                {combo.label}
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
          className="w-full pt-8 desktop:pt-10"
        >
          <h2
            id="type-detail-effect"
            className="mb-2 text-xl font-semibold leading-tight text-primary-4 desktop:text-3xl"
          >
            {label} 타입의 고유 효과
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-primary-4">
            {content.specialEffect}
          </p>
        </section>
      )}
    </>
  )
}

export default TypeDetailComboContainer
