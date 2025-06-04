import isEqual from 'fast-deep-equal'
import { memo } from 'react'
import TagComponent from '~/components/Tag.component'
import { PokemonType } from '~/graphql/typeGenerated'

interface TypeListComponentProps {
  list: Array<PokemonType>
  title: string
  grade: 'best' | 'better' | 'good' | 'warning' | 'danger'
}

const gradeColors = {
  best: 'bg-[#6af073]',
  better: 'bg-[#5ce9ff]',
  good: 'bg-[#59a0f5]',
  warning: 'bg-[#f9bd3d]',
  danger: 'bg-[#ff5f42]',
}

const TypeListComponent = ({ list, title, grade }: TypeListComponentProps) => {
  return (
    <div className="w-full text-center pb-3 border-[3px] border-solid border-primary-1 rounded-2xl overflow-hidden shadow-[inset_-2px_0px_5px_0_#9a9a9a]">
      <dt
        className={`h-6 text-base font-medium leading-[calc(1.5rem+2px)] mb-3 shadow-[inset_-6px_1px_7px_-4px_#9a9a9a] max-[475px]:tracking-[-0.75px] ${gradeColors[grade]}`}
      >
        {title}
      </dt>
      <dd className="h-[calc(100%-2.25rem)]">
        <ul
          className="h-full flex items-center justify-center flex-wrap gap-2"
          aria-label="상성 타입 리스트"
        >
          {list.map((item, index) => {
            return (
              <li key={index}>
                <TagComponent type={item} />
              </li>
            )
          })}
        </ul>
      </dd>
    </div>
  )
}

export default memo(TypeListComponent, isEqual)
