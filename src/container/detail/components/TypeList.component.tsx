import isEqual from 'fast-deep-equal'
import { memo } from 'react'
import TagComponent from '~/components/tag/Tag.component'
import { PokemonType } from '~/graphql/typeGenerated'

/**
 * 상성 배율 그룹 리스트 (기존 데/모 TypeList 이관 — 신규 Tag 조립).
 * 배율은 제목 텍스트("0.5배의 데미지를 받음")로 병기돼 색 단독 의존이 아니다.
 * grade 색상은 기존 값 그대로 이관(토큰화는 구버전 일괄 제거 트랙에서 검토).
 */
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
    <div className="w-full overflow-hidden rounded-2xl border-[3px] border-solid border-primary-1 pb-3 text-center shadow-[inset_-2px_0px_5px_0_#9a9a9a]">
      <dt
        className={`h-6 text-base font-medium text-aligned-sm mb-3 shadow-[inset_-6px_1px_7px_-4px_#9a9a9a] max-[475px]:tracking-[-0.75px] ${gradeColors[grade]}`}
      >
        {title}
      </dt>
      <dd>
        <ul
          className="flex flex-wrap items-center justify-center gap-2 px-2"
          aria-label="상성 타입 리스트"
        >
          {list.map((item) => (
            <li key={item}>
              <TagComponent type={item} />
            </li>
          ))}
        </ul>
      </dd>
    </div>
  )
}

export default memo(TypeListComponent, isEqual)
