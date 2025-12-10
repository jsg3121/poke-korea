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
  const generationId = params.get('generationId') ?? ''

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
  const handleClickSelectgenerationId = (id: string) => {
    const queryString = new URLSearchParams(params)
    if (generationId === id) {
      queryString.delete('generationId')
    } else {
      queryString.set('generationId', id)
    }
    router.replace(`${pathname}?${queryString}`)
  }

  if (isMobile) {
    return (
      <OptionsMobile
        selectDamageTypes={damageTypeFilter}
        selectGenerationId={generationId}
        selectTypeFilter={typeFilter}
        onClickSelectDamageTypeFilter={handleClickSelectDamageTypeFilter}
        onClickSelectTypeFilter={handleClickSelectTypeFilter}
        onClickSelectgenerationId={handleClickSelectgenerationId}
      />
    )
  }

  return (
    <OptionsDesktop
      selectDamageTypes={damageTypeFilter}
      selectGenerationId={generationId}
      selectTypeFilter={typeFilter}
      onClickSelectDamageTypeFilter={handleClickSelectDamageTypeFilter}
      onClickSelectTypeFilter={handleClickSelectTypeFilter}
      onClickSelectgenerationId={handleClickSelectgenerationId}
    />
  )
}

export default FilterOptionsComponent
