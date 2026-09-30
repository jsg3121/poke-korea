'use client'

import { VersionGroup } from '~/graphql/typeGenerated'
import MovesVersionNav, {
  MovesVersionNavItem,
} from '~/components/moves/MovesVersionNav.component'

const LATEST_SENTINEL_ID = 0

interface MoveDetailVersionNavProps {
  skillId: number
  versionGroups?: Array<VersionGroup> | null
  selectedVersionGroupId?: number
}

const MoveDetailVersionNav = ({
  skillId,
  versionGroups,
  selectedVersionGroupId,
}: MoveDetailVersionNavProps) => {
  if (!versionGroups || versionGroups.length === 0) {
    return null
  }

  const versionItems: MovesVersionNavItem[] = [
    {
      versionGroupId: LATEST_SENTINEL_ID,
      label: '최신',
      href: `/moves/${skillId}`,
      active: !selectedVersionGroupId,
    },
    ...versionGroups.map((vg) => ({
      versionGroupId: vg.versionGroupId,
      label: vg.displayName ?? vg.nameKo ?? '',
      href: `/moves/${skillId}/version/${vg.versionGroupId}`,
      active: vg.versionGroupId === selectedVersionGroupId,
    })),
  ]

  return (
    <div className="sticky top-12 z-40 border-b border-solid border-primary-3/30 bg-primary-1 desktop:top-30">
      <div className="mx-auto w-full desktop:max-w-7xl">
        <MovesVersionNav items={versionItems} storageKey={`move:${skillId}`} />
      </div>
    </div>
  )
}

export default MoveDetailVersionNav
