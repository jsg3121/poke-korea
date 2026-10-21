'use client'

import { FormEvent, MouseEvent, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useBodyScrollLock } from '~/hooks/useBodyScrollLock'
import Button from '~/components/button/Button.component'
import CloseIconButton from '~/components/button/CloseIconButton.component'
import Checkbox from '~/components/checkbox/Checkbox.component'
import Portal from '~/components/Portal.component'
import RadioGroup from '~/components/RadioGroup.component'

interface FilterModalFormProps {
  onClose: () => void
}

const INCLUDE_OPTIONS = [
  { label: '존재', value: 'true' },
  { label: '존재하지 않음', value: 'false' },
  { label: '모두', value: 'all' },
]

const GENERATIONS = Array.from({ length: 9 }, (_, i) => i + 1)

const RADIO_FIELDS = [
  { name: 'isMega', label: '메가진화 가능 포켓몬 포함' },
  { name: 'isRegion', label: '리전폼 존재 포켓몬 포함' },
  { name: 'isEvolution', label: '진화 가능 포켓몬 포함' },
  { name: 'isGigantamax', label: '거다이맥스 가능 포켓몬 포함' },
] as const

const FilterModalForm = ({ onClose }: FilterModalFormProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useBodyScrollLock(true)

  const generationParams = searchParams.getAll('generation')

  const handleSubmitFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const params = new URLSearchParams(searchParams)

    params.delete('generation')
    formData
      .getAll('generation')
      .forEach((gen) => params.append('generation', String(gen)))

    RADIO_FIELDS.forEach(({ name }) => {
      const value = formData.get(name)
      if (!value || value === 'all') {
        params.delete(name)
      } else {
        params.set(name, String(value))
      }
    })

    router.replace(`${pathname}?${params.toString()}`)
    onClose()
  }

  const handleClickForm = (e: MouseEvent<HTMLFormElement>) => {
    e.stopPropagation()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[600] bg-black-1/70 flex items-stretch desktop:items-center desktop:justify-center"
        onClick={onClose}
      >
        <form
          onSubmit={handleSubmitFilter}
          onClick={handleClickForm}
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-modal-title"
          className="flex w-full h-full flex-col bg-primary-1 p-5 desktop:h-auto desktop:max-h-[90vh] desktop:w-[28rem] desktop:rounded-2xl desktop:p-8"
        >
          <header className="mb-3 flex items-center justify-between border-b border-solid border-primary-3 pb-3 desktop:mb-4 desktop:pb-4">
            <h2
              id="filter-modal-title"
              className="text-xl font-semibold leading-7 text-primary-4 desktop:text-2xl desktop:leading-8"
            >
              추가 필터 검색
            </h2>
            <CloseIconButton
              color="light"
              aria-label="필터 창 닫기"
              onClick={onClose}
            />
          </header>

          <div className="flex-1 overflow-y-auto">
            <fieldset className="mb-6 desktop:mb-8">
              <legend className="mb-2 text-base font-medium text-primary-3 desktop:text-lg">
                포켓몬 세대
              </legend>
              <ul className="grid grid-cols-3 gap-2 desktop:gap-3">
                {GENERATIONS.map((gen) => (
                  <li key={`filter-generation-${gen}`}>
                    <Checkbox
                      id={`filter-generation-${gen}`}
                      label={`${gen}세대`}
                      name="generation"
                      value={`${gen}`}
                      defaultChecked={generationParams.includes(`${gen}`)}
                    />
                  </li>
                ))}
              </ul>
            </fieldset>

            {RADIO_FIELDS.map((field) => (
              <fieldset key={field.name} className="mb-6 desktop:mb-8">
                <legend className="mb-2 text-base font-medium text-primary-3 desktop:text-lg">
                  {field.label}
                </legend>
                <RadioGroup
                  name={field.name}
                  options={INCLUDE_OPTIONS}
                  defaultValue={searchParams.get(field.name) ?? undefined}
                />
              </fieldset>
            ))}
          </div>

          <div className="mt-4 shrink-0">
            <Button type="submit" fullWidth>
              필터 조건으로 검색하기
            </Button>
          </div>
        </form>
      </div>
    </Portal>
  )
}

export default FilterModalForm
