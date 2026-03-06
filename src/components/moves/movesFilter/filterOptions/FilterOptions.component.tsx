'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDevice } from '~/context/Device.context'
import OptionsDesktop from './desktop/Options.desktop'
import OptionsMobile from './mobile/Options.mobile'

const FilterOptionsComponent = () => {
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { isMobile } = useDevice()
  const typeFilter = params.get('typeFilter') ?? ''
  const damageTypeFilter = params.get('damageTypeFilter') ?? ''
  const firstGenerationId = params.get('firstGenerationId') ?? ''

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

  const handleClickSelectFirstGenerationId = (id: string) => {
    const queryString = new URLSearchParams(params)
    if (firstGenerationId === id) {
      queryString.delete('firstGenerationId')
    } else {
      queryString.set('firstGenerationId', id)
    }
    router.replace(`${pathname}?${queryString}`)
  }

  if (isMobile) {
    return (
      <OptionsMobile
        selectDamageTypes={damageTypeFilter}
        selectFirstGenerationId={firstGenerationId}
        selectTypeFilter={typeFilter}
        onClickSelectDamageTypeFilter={handleClickSelectDamageTypeFilter}
        onClickSelectTypeFilter={handleClickSelectTypeFilter}
        onClickSelectFirstGenerationId={handleClickSelectFirstGenerationId}
      />
    )
  }

  return (
    <OptionsDesktop
      selectDamageTypes={damageTypeFilter}
      selectFirstGenerationId={firstGenerationId}
      selectTypeFilter={typeFilter}
      onClickSelectDamageTypeFilter={handleClickSelectDamageTypeFilter}
      onClickSelectTypeFilter={handleClickSelectTypeFilter}
      onClickSelectFirstGenerationId={handleClickSelectFirstGenerationId}
    />
  )
}

export default FilterOptionsComponent
