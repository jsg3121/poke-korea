import TypeAttackMatchupComponent from '~/components/typeMatchup/TypeAttackMatchup.component'
import TypeMatchupComponent from '~/components/typeMatchup/TypeMatchup.component'
import { PokemonType } from '~/graphql/typeGenerated'
import { calculateRelationType } from '~/module/calculateRelationType'
import { getTypeLabel } from '~/module/typeParams.module'
import { calculateAttackEffectiveness } from '~/module/typeAttackEffectiveness'

/**
 * 방어·공격 상성 전체.
 *
 * 방어는 기존 DS(`TypeMatchup`)를 그대로 쓰고, 공격은 전용 컴포넌트
 * (`TypeAttackMatchup`)를 쓴다 — 전자는 라벨이 "받는 데미지"로 고정돼 있어
 * 공격 관점에 맞지 않는다.
 *
 * 단일 타입 입력이라 방어 쪽 `quad`·`quarter`는 항상 비고, `TypeMatchup`이
 * 빈 행을 자동 생략하므로 2배·0.5배·0배 3행만 렌더된다. 복합 타입의 4배는
 * 아래 복합 타입 블록이 담당한다.
 */

interface TypeDetailMatchupContainerProps {
  pokemonType: PokemonType
}

const TypeDetailMatchupContainer = ({
  pokemonType,
}: TypeDetailMatchupContainerProps) => {
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
          <TypeMatchupComponent
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
          <TypeAttackMatchupComponent
            double={attack.double}
            half={attack.half}
            zero={attack.zero}
          />
        </div>
      </section>
    </>
  )
}

export default TypeDetailMatchupContainer
