import { AbilityInfoFragment } from '~/graphql/typeGenerated'

interface AbilityDetailComponentProps {
  abilityData: AbilityInfoFragment
}

const AbilityDetailComponent = ({
  abilityData,
}: AbilityDetailComponentProps) => {
  return (
    <section className="w-[calc(100%-2.5rem)] mx-auto min-h-32 pb-4 relative">
      <h1 className="text-[2.5rem] text-primary-4 font-bold mb-4">
        {abilityData.name}
      </h1>
      <h2 className="text-[1.5em] font-semibold text-primary-4 mb-2">
        {abilityData.description}
      </h2>
    </section>
  )
}

export default AbilityDetailComponent
