import Link from 'next/link'

import { AbilityInfoFragment } from '~/graphql/typeGenerated'

interface AbilityCardProps {
  abilityData: AbilityInfoFragment
}

const AbilityCard = ({ abilityData }: AbilityCardProps) => {
  return (
    <Link
      href={`/ability/${abilityData.abilityId}`}
      className="block w-full"
      aria-label={`${abilityData.name} 특성 상세보기`}
    >
      <article className="w-full min-h-40 bg-primary-4 border-2 border-solid border-primary-1 rounded-xl shadow-[0_0_0_3px_var(--color-primary-4)] p-3 pb-10 relative transition-transform duration-150 desktop:hover:-translate-y-0.5">
        <header className="mb-3 pb-1 border-b border-solid border-primary-1">
          <h3 className="text-lg desktop:text-xl font-bold text-gray-900 leading-tight">
            <span className="text-sm font-normal text-primary-2">
              {abilityData.abilityId}.
            </span>
            &nbsp;
            {abilityData.name}
          </h3>
        </header>
        <p className="text-base text-primary-1 leading-relaxed">
          {abilityData.description}
        </p>
        {abilityData.pokemonCount !== null &&
          abilityData.pokemonCount !== undefined && (
            <p className="absolute bottom-3 left-3 text-sm desktop:text-xs text-primary-2 font-semibold">
              해당 특성을 가진 포켓몬 보러가기 &gt;
            </p>
          )}
      </article>
    </Link>
  )
}

export default AbilityCard
