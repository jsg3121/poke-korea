import { useContext } from 'react'
import { DetailContext } from '~/context/Detail.context'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'
import Link from 'next/link'

const AbilitiesInfoComponent = () => {
  const { activeTypeInfo } = useContext(DetailContext)
  const { abilities } = activeTypeInfo

  return (
    <section
      className="w-full h-full bg-primary-4 border-[3px] border-solid border-primary-1 rounded-2xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4"
      aria-label="포켓몬 특성 정보"
    >
      <InfoCardTitleComponent title="특성" />
      <dl className="w-full h-[calc(100%-4.25rem)] flex flex-col gap-4">
        {abilities.map((ability, index) => {
          return (
            <div
              key={`ability-id-${index}`}
              className="w-full border-b border-solid border-primary-3 py-2 last:border-b-0 last:p-0"
            >
              <dt className="w-full h-7 text-xl font-bold leading-6 pb-2 relative">
                {ability.name}&nbsp;
                {ability.isHidden && (
                  <span className="text-xs font-normal">(숨겨진 특성)</span>
                )}
                <Link
                  href={`/ability/${ability.abilityId}`}
                  className="text-[0.75rem] text-primary-1 absolute right-0 underline underline-offset-4"
                >
                  특성 정보 보러가기
                </Link>
              </dt>
              <dd className="w-full min-h-6 text-base leading-6">
                {ability.description}
              </dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}

export default AbilitiesInfoComponent
