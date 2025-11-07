import { AbilityInfoFragment } from '~/graphql/typeGenerated'

interface AbilityDetailComponentProps {
  abilityData: AbilityInfoFragment
}

const AbilityDetailComponent = ({
  abilityData,
}: AbilityDetailComponentProps) => {
  return (
    <section className="w-full bg-white border-2 border-solid border-gray-300 rounded-lg p-6 mb-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {abilityData.name}
        </h1>
        {abilityData.pokemonCount !== null &&
          abilityData.pokemonCount !== undefined && (
            <p className="text-sm text-gray-500">
              이 특성을 가진 포켓몬: {abilityData.pokemonCount}마리
            </p>
          )}
      </header>
      <div className="bg-gray-50 rounded-lg p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">특성 설명</h2>
        <p className="text-base text-gray-800 leading-relaxed">
          {abilityData.description}
        </p>
      </div>
    </section>
  )
}

export default AbilityDetailComponent
