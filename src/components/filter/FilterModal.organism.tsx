'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import Button from '~/components/button/Button.component'
import CloseIconButton from '~/components/button/CloseIconButton.component'
import Checkbox from '~/components/checkbox/Checkbox.component'
import Portal from '~/components/Portal.component'
import RadioGroup from '~/components/RadioGroup.component'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'

/**
 * 추가 필터 검색 모달 (organism). CloseIconButton·Checkbox·RadioGroup·Button 원자를
 * 조립하고, 필터 폼 상태(react-hook-form)와 URL 쿼리 동기화를 담당한다.
 *
 * 데/모 2벌(components/filter·container/desktop/header/filter, 크기만 다른 사실상 복붙)을
 * CSS 반응형 단일로 통합한다(UA 분기·display:none 없음, ADR-0007). 모바일 퍼스트 —
 * base가 모바일 풀스크린 시트, 데스크톱(`desktop:`)은 중앙 고정 카드다. 좁은 화면에서
 * 고정폭 카드(27rem)가 잘리던 문제를 시트로 해결한다.
 *
 * 딤 오버레이는 Portal로 body 밖 portal-root에 렌더해 부모 stacking context·overflow에
 * 종속되지 않게 한다. 열림 상태(open)와 데이터(초기값)는 호출부가 주입한다 — organism은
 * 표현과 폼 로직만 담당한다.
 */

interface FilterFormValues {
  generation: string[]
  isMega: string | null
  isRegion: string | null
  isGigantamax: string | null
  isEvolution: string | null
}

interface FilterModalOrganismProps {
  open: boolean
  onClose: () => void
}

/** 포함 여부 3지선다 — 존재 / 존재하지 않음 / 모두 */
const INCLUDE_OPTIONS = [
  { label: '존재', value: 'true' },
  { label: '존재하지 않음', value: 'false' },
  { label: '모두', value: 'all' },
]

/** 세대 필터: 1~9세대 체크박스 */
const GENERATIONS = Array.from({ length: 9 }, (_, i) => i + 1)

/** 라디오 필터 필드 — 라벨과 폼 키를 함께 선언해 반복 렌더한다 */
const RADIO_FIELDS = [
  { name: 'isMega', label: '메가진화 가능 포켓몬 포함' },
  { name: 'isRegion', label: '리전폼 존재 포켓몬 포함' },
  { name: 'isEvolution', label: '진화 가능 포켓몬 포함' },
  { name: 'isGigantamax', label: '거다이맥스 가능 포켓몬 포함' },
] as const

const FilterModalOrganism = ({ open, onClose }: FilterModalOrganismProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useBodyScrollLock(open)

  // Escape 키로 닫기 (ARIA dialog 패턴). open일 때만 리스너를 건다.
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const formMethods = useForm<FilterFormValues>({
    defaultValues: {
      generation: searchParams.getAll('generation'),
      isMega: searchParams.get('isMega'),
      isRegion: searchParams.get('isRegion'),
      isGigantamax: searchParams.get('isGigantamax'),
      isEvolution: searchParams.get('isEvolution'),
    },
  })

  const { watch, register, setValue, getValues, handleSubmit } = formMethods

  // 세대는 다중 선택이라 배열로 누적/제거한다(체크박스별 register 대신 수동 동기화)
  const handleChangeGeneration = (e: ChangeEvent<HTMLInputElement>) => {
    const gen = e.target.value
    const prev = getValues('generation')
    const next = e.target.checked
      ? [...prev, gen]
      : prev.filter((item) => item !== gen)
    setValue('generation', next)
  }

  const onSubmit = (values: FilterFormValues) => {
    const params = new URLSearchParams(searchParams)

    Object.entries(values).forEach(([key, value]) => {
      // 'all'(모두)은 필터 미적용이므로 쿼리에서 제거해 URL을 깔끔히 유지한다
      if (
        !value ||
        value === 'all' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        params.delete(key)
        return
      }
      if (Array.isArray(value)) {
        params.delete(key)
        value.forEach((v) => params.append(key, v))
      } else {
        params.set(key, value)
      }
    })

    router.replace(`${pathname}?${params.toString()}`)
    onClose()
  }

  const generation = watch('generation')

  if (!open) return null

  return (
    <Portal>
      {/* 딤 — 클릭 시 닫기(오버레이 자신을 클릭했을 때만). 모바일은 시트를 전체로,
          데스크톱은 카드를 중앙에 배치. z-[600]: 모달은 전역 크롬 위여야 한다
          (모바일 헤더가 z-[500] — z-[100]이면 헤더가 시트 제목을 뚫고 올라온다) */}
      <div
        className="fixed inset-0 z-[600] bg-black-1/70 flex items-stretch desktop:items-center desktop:justify-center"
        onClick={onClose}
      >
        <FormProvider {...formMethods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onClick={(e) => e.stopPropagation()}
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
                        value={`${gen}`}
                        defaultChecked={generation.includes(`${gen}`)}
                        onChange={handleChangeGeneration}
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
                    options={INCLUDE_OPTIONS}
                    defaultValue={getValues(field.name) ?? undefined}
                    {...register(field.name)}
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
        </FormProvider>
      </div>
    </Portal>
  )
}

export default FilterModalOrganism
