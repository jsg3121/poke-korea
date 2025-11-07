import { AbilityInfoFragment } from '~/graphql/typeGenerated'

interface AbilityDetailComponentProps {
  abilityData: AbilityInfoFragment
  totalCount: number
}

const AbilityDetailComponent = ({
  abilityData,
  totalCount,
}: AbilityDetailComponentProps) => {
  return (
    <section className="w-full h-48 pb-4 relative">
      <h1 className="text-[2.5rem] text-primary-4 font-bold mb-4">
        {abilityData.name}
      </h1>
      <h2 className="text-[1.5em] font-semibold text-primary-4 mb-2">
        {abilityData.description}
      </h2>
      <p className="text-[1rem] text-primary-3 absolute bottom-4 left-0">
        <span className="text-[1.25rem] font-bold">{totalCount}마리</span>의
        포켓몬이 이 특성을 가지고 있어요
      </p>
    </section>
  )
}

export default AbilityDetailComponent
