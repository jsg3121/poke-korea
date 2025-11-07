import Link from 'next/link'
import { AbilityInfoFragment } from '~/graphql/typeGenerated'

interface AbilityCardComponentProps {
  abilityData: AbilityInfoFragment
}

const AbilityCardComponent = ({ abilityData }: AbilityCardComponentProps) => {
  return (
    <Link
      href={`/ability/${abilityData.abilityId}`}
      className="block w-full"
      aria-label={`${abilityData.name} 특성 상세보기`}
    >
      <article className="w-full min-h-40 bg-primary-4 border-[2px] border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-3 relative">
        <header className="mb-3">
          <h3 className="text-[1.25rem] font-bold text-gray-900 mb-1 border-b border-solid border-primary-1">
            <span className="text-[0.875rem] text-primary-2">
              {abilityData.abilityId}.
            </span>
            &nbsp;
            {abilityData.name}
          </h3>
        </header>
        <p className="text-[1rem] text-primary-1">{abilityData.description}</p>
        {abilityData.pokemonCount !== null &&
          abilityData.pokemonCount !== undefined && (
            <p className="text-[1rem] text-primary-2 font-semibold absolute bottom-3 left-3">
              <span className="text-[0.875rem] font-normal">보유 포켓몬:</span>{' '}
              {abilityData.pokemonCount}마리
            </p>
          )}
      </article>
    </Link>
  )
}

export default AbilityCardComponent
