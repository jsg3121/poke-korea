import { Fragment } from 'react'
import { PokemonType } from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import TypeResultChipComponents from './components/TypeResultChip.components'

interface ResultListComponentsProps {
  title: string
  dataList: Array<PokemonType>
  importantPoint: 1 | 2 | 3 | 4 | 5
}

// Helper function to get background color based on importance
const getBackgroundColor = (importantPoint: 1 | 2 | 3 | 4 | 5): string => {
  switch (importantPoint) {
    case 5:
      return '#feb0b0'
    case 4:
      return '#ffae76'
    case 3:
      return '#ffdf61'
    case 2:
      return '#84efff'
    case 1:
    default:
      return '#80f7ac'
  }
}

const ResultListComponents = ({
  title,
  dataList,
  importantPoint,
}: ResultListComponentsProps) => {
  return (
    <Fragment>
      <dt
        className="w-fit h-7 text-base text-aligned-md text-left shadow-[1px_2px_6px_0_var(--color-primary-1)] rounded-2xl px-3"
        style={{ backgroundColor: getBackgroundColor(importantPoint) }}
      >
        {title}
      </dt>
      <dd className="w-full py-4 pb-8 flex flex-wrap items-center gap-4 last:pb-0">
        {dataList.map((type) => {
          return (
            <TypeResultChipComponents
              key={`type-quad-id-${type}`}
              typeLabel={PokemonTypes[type]}
              typeValue={type}
            />
          )
        })}
      </dd>
    </Fragment>
  )
}

export default ResultListComponents
