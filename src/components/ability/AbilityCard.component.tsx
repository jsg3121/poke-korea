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
      <article className="w-full min-h-[8rem] bg-white border-2 border-solid border-gray-300 rounded-lg p-4 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer">
        <header className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {abilityData.name}
          </h3>
          {abilityData.pokemonCount !== null &&
            abilityData.pokemonCount !== undefined && (
              <p className="text-sm text-gray-500">
                보유 포켓몬: {abilityData.pokemonCount}마리
              </p>
            )}
        </header>
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
          {abilityData.description}
        </p>
      </article>
    </Link>
  )
}

export default AbilityCardComponent
