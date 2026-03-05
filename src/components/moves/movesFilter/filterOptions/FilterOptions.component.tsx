'use client'

import { useContext } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDevice } from '~/context/Device.context'
import { MovesContext } from '~/context/Moves.context'
import OptionsDesktop from './desktop/Options.desktop'
import OptionsMobile from './mobile/Options.mobile'

const FilterOptionsComponent = () => {
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { isMobile } = useDevice()
  const { versionGroups } = useContext(MovesContext)
  const typeFilter = params.get('typeFilter') ?? ''
  const damageTypeFilter = params.get('damageTypeFilter') ?? ''
  const versionGroupId = params.get('versionGroupId') ?? ''

  const handleClickSelectTypeFilter = (types: string) => {
    const queryString = new URLSearchParams(params)
    if (typeFilter === types) {
      queryString.delete('typeFilter')
    } else {
      queryString.set('typeFilter', types)
    }
    router.replace(`${pathname}?${queryString}`)
  }

  const handleClickSelectDamageTypeFilter = (damageTypes: string) => {
    const queryString = new URLSearchParams(params)
    if (damageTypeFilter === damageTypes) {
      queryString.delete('damageTypeFilter')
    } else {
      queryString.set('damageTypeFilter', damageTypes)
    }
    router.replace(`${pathname}?${queryString}`)
  }
  const handleClickSelectVersionGroupId = (id: string) => {
    const queryString = new URLSearchParams(params)
    if (versionGroupId === id) {
      queryString.delete('versionGroupId')
    } else {
      queryString.set('versionGroupId', id)
    }
    router.replace(`${pathname}?${queryString}`)
  }

  if (isMobile) {
    return (
      <OptionsMobile
        selectDamageTypes={damageTypeFilter}
        selectVersionGroupId={versionGroupId}
        selectTypeFilter={typeFilter}
        versionGroups={versionGroups}
        onClickSelectDamageTypeFilter={handleClickSelectDamageTypeFilter}
        onClickSelectTypeFilter={handleClickSelectTypeFilter}
        onClickSelectVersionGroupId={handleClickSelectVersionGroupId}
      />
    )
  }

  return (
    <OptionsDesktop
      selectDamageTypes={damageTypeFilter}
      selectVersionGroupId={versionGroupId}
      selectTypeFilter={typeFilter}
      versionGroups={versionGroups}
      onClickSelectDamageTypeFilter={handleClickSelectDamageTypeFilter}
      onClickSelectTypeFilter={handleClickSelectTypeFilter}
      onClickSelectVersionGroupId={handleClickSelectVersionGroupId}
    />
  )
}

export default FilterOptionsComponent
