import isEqual from 'fast-deep-equal'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, memo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import CloseIcon from '~/assets/close.svg'
import CheckboxComponent from '~/components/Checkbox.component'
import RadioGroupComponent from '~/components/RadioGroup.component'
import { FilterFormType } from './types/filterForm.type'

interface FilterModalComponentProps {
  onClickCloseModal: () => void
}

const RadioOptions = [
  { label: '존재', value: 'true' },
  { label: '존재하지 않음', value: 'false' },
  { label: '모두', value: 'all' },
]

const FilterModalComponent = ({
  onClickCloseModal,
}: FilterModalComponentProps) => {
  const router = useRouter()
  const routerQuery = useSearchParams()
  const pathname = usePathname()

  const formMethods = useForm<FilterFormType>({
    defaultValues: {
      generation: routerQuery.getAll('generation') ?? [],
      isEvolution: routerQuery.get('isEvolution') ?? null,
      isMega: routerQuery.get('isMega') ?? null,
      isRegion: routerQuery.get('isRegion') ?? null,
      isGigantamax: routerQuery.get('isGigantamax') ?? null,
    },
  })

  const { watch, register, setValue, getValues, handleSubmit } = formMethods

  const handleClickCloseModal = () => {
    onClickCloseModal()
  }

  const handleChangeGeneration = (e: ChangeEvent<HTMLInputElement>) => {
    const prevList = [...getValues('generation')]
    const checked = e.target.checked
    const gen = e.target.value

    if (!checked) {
      const checkedList = prevList.filter((item) => item !== gen)
      setValue('generation', checkedList)
    } else {
      const checkedList = [...prevList, gen]
      setValue('generation', checkedList)
    }
  }

  const onSubmitFilter = (filterData: FilterFormType) => {
    const queryString = new URLSearchParams(routerQuery)

    Object.entries(filterData).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        queryString.delete(key)
        return
      }

      if (Array.isArray(value)) {
        queryString.delete(key)
        value.forEach((v) => queryString.append(key, v))
      } else {
        queryString.set(key, value.toString())
      }
    })

    router.replace(`${pathname}?${queryString}`)
    onClickCloseModal()
  }

  const generation = watch('generation')

  return (
    <div className="w-screen h-screen bg-black/70 fixed top-0 left-0 z-[100]">
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmitFilter)}>
          <section className="w-[27rem] h-[42rem] rounded-2xl bg-primary-1 p-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <header className="h-12 border-b border-solid border-[#e2e2e2] mb-4 pb-4 flex items-start justify-between">
              <p className="h-8 text-2xl font-semibold leading-8 text-primary-4">
                추가 필터 검색
              </p>
              <button
                className="w-6 h-6"
                type="button"
                onClick={handleClickCloseModal}
              >
                <CloseIcon
                  width="1.5rem"
                  height="1.5rem"
                  fill="var(--color-primary-4)"
                />
              </button>
            </header>
            <div className="w-full h-[calc(100%-3rem)] relative">
              <div className="mb-8 w-full">
                <div className="w-full">
                  <p className="text-lg font-medium leading-[1.125rem] text-primary-3">
                    포켓몬 세대
                  </p>
                </div>
                <div className="w-full py-4">
                  <ul className="w-full flex items-center flex-wrap justify-between gap-2">
                    {new Array(9).fill(null).map((_, index: number) => {
                      const gen = index + 1
                      return (
                        <li
                          className="w-[30%] h-[1.3rem]"
                          key={`pokemon-generation-id-${index}`}
                        >
                          <CheckboxComponent
                            id={`filter-generation-item-id-${gen}`}
                            label={`${gen}세대`}
                            value={`${gen}`}
                            defaultChecked={generation.includes(gen.toString())}
                            onChange={handleChangeGeneration}
                          />
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
              <div className="mb-8 w-full">
                <div className="w-full">
                  <p className="text-lg font-medium leading-[1.125rem] text-primary-3">
                    메가진화 가능 포켓몬 포함
                  </p>
                </div>
                <div className="mt-2">
                  <RadioGroupComponent
                    options={RadioOptions}
                    {...register('isMega')}
                  />
                </div>
              </div>
              <div className="mb-8 w-full">
                <div className="w-full">
                  <p className="text-lg font-medium leading-[1.125rem] text-primary-3">
                    리전폼 존재 포켓몬 포함
                  </p>
                </div>
                <div className="mt-2">
                  <RadioGroupComponent
                    options={RadioOptions}
                    {...register('isRegion')}
                  />
                </div>
              </div>
              <div className="mb-8 w-full">
                <div className="w-full">
                  <p className="text-lg font-medium leading-[1.125rem] text-primary-3">
                    진화 가능 포켓몬 포함
                  </p>
                </div>
                <div className="mt-2">
                  <RadioGroupComponent
                    options={RadioOptions}
                    {...register('isEvolution')}
                  />
                </div>
              </div>
              <div className="mb-8 w-full">
                <div className="w-full">
                  <p className="text-lg font-medium leading-[1.125rem] text-primary-3">
                    거다이맥스 가능 포켓몬 포함
                  </p>
                </div>
                <div className="mt-2">
                  <RadioGroupComponent
                    options={RadioOptions}
                    {...register('isGigantamax')}
                  />
                </div>
              </div>
              <button
                className="w-full h-12 bg-primary-4 rounded-lg text-black-2 font-medium text-base cursor-pointer absolute bottom-4 left-0"
                type="submit"
              >
                필터 조건으로 검색하기
              </button>
            </div>
          </section>
        </form>
      </FormProvider>
    </div>
  )
}

export default memo(FilterModalComponent, isEqual)
