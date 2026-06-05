'use client'

import Link from 'next/link'
import { ChampionsFormSiblingFragment } from '~/graphql/typeGenerated'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
} from '~/utils/championsFormat.util'
import ChampionsTierBadge from './ChampionsTierBadge.component'

interface ChampionsFormTabProps {
  formSiblings: ChampionsFormSiblingFragment[]
  formatSlug: ChampionsFormatSlug
}

const ChampionsFormTab = ({
  formSiblings,
  formatSlug,
}: ChampionsFormTabProps) => {
  // 형제 폼이 1개뿐이면(자기 자신만) 탭 노출 안 함
  if (formSiblings.length <= 1) {
    return null
  }

  return (
    <nav aria-label="포켓몬 폼 선택" className="w-full mb-4">
      <ul className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-2">
        {formSiblings.map((sibling) => {
          const isActive = sibling.isCurrent
          const href = buildChampionsDetailHref({
            formatSlug,
            pokemonId: sibling.pokemonId,
            formType: sibling.formType,
            formCode: sibling.formCode,
          })

          return (
            <li key={sibling.id} className="shrink-0">
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                title={sibling.name}
                className={`inline-flex items-center justify-between gap-3 min-w-[10rem] px-4 py-2 rounded-lg border-2 transition-colors ${
                  isActive
                    ? 'bg-primary-4 text-primary-1 border-primary-1 shadow-[0_0_0px_3px_var(--color-primary-4)] font-bold'
                    : 'bg-transparent text-primary-3 border-primary-3 hover:text-primary-4 hover:border-primary-4'
                }`}
              >
                <span className="text-sm truncate">{sibling.name}</span>
                {sibling.tier && (
                  <span className="shrink-0">
                    <ChampionsTierBadge tier={sibling.tier} />
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default ChampionsFormTab
