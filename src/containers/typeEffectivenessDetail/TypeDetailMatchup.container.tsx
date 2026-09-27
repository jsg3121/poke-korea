import { PokemonType } from '~/graphql/typeGenerated'
import { calculateRelationType } from '~/modules/calculateRelationType.module'
import { calculateAttackEffectiveness } from '~/modules/typeAttackEffectiveness.module'
import { getTypeLabel } from '~/modules/typeParams.module'
import TypeAttackMatchup from '~/components/typeMatchup/TypeAttackMatchup.component'
import TypeMatchup from '~/components/typeMatchup/TypeMatchup.component'

interface TypeDetailMatchupProps {
  pokemonType: PokemonType
}

const TypeDetailMatchup = ({ pokemonType }: TypeDetailMatchupProps) => {
  const label = getTypeLabel(pokemonType)
  const defense = calculateRelationType([pokemonType])
  const attack = calculateAttackEffectiveness(pokemonType)

  return (
    <>
      <section
        aria-labelledby="type-detail-defense"
        className="w-full pt-10 desktop:pt-14"
      >
        <h2
          id="type-detail-defense"
          className="mb-2 text-xl font-semibold leading-tight text-primary-4 desktop:text-3xl"
        >
          {label} 타입이 받는 데미지
        </h2>
        <p className="mb-4 text-sm text-primary-3">
          {label} 타입 포켓몬이 각 타입 공격을 받을 때의 배율이에요. 복합 타입은
          두 타입의 배율이 곱해져요.
        </p>
        <div className="rounded-2xl bg-primary-4 p-5 desktop:p-8">
          <TypeMatchup
            quad={defense.quad}
            double={defense.double}
            half={defense.half}
            quarter={defense.quarter}
            zero={defense.zero}
          />
        </div>
      </section>

      <section
        aria-labelledby="type-detail-attack"
        className="w-full pt-10 desktop:pt-14"
      >
        <h2
          id="type-detail-attack"
          className="mb-2 text-xl font-semibold leading-tight text-primary-4 desktop:text-3xl"
        >
          {label} 타입이 주는 데미지
        </h2>
        <p className="mb-4 text-sm text-primary-3">
          {label} 타입 기술로 공격할 때의 배율이에요. 단일 타입 상대 기준이에요.
        </p>
        <div className="rounded-2xl bg-primary-4 p-5 desktop:p-8">
          <TypeAttackMatchup
            double={attack.double}
            half={attack.half}
            zero={attack.zero}
          />
        </div>
      </section>
    </>
  )
}

export default TypeDetailMatchup
