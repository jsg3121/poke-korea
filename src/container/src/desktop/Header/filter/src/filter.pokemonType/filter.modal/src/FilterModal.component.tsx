import isEqual from 'fast-deep-equal'
import { useRouter } from 'next/router'
import React, { ChangeEvent } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'
import CloseIcon from '~/assets/close.svg'
import { Checkbox, RadioGroup } from '~/components'
import { FilterFormType } from '../types/filterForm.type'

interface FilterModalComponentProps {
  onClickCloseModal: () => void
}

const RadioOptions = [
  { label: '존재', value: 'true' },
  { label: '존재하지 않음', value: 'false' },
  { label: '모두', value: 'all' },
]

const FilterModal = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

  .modal-section {
    width: 30rem;
    height: 40rem;
    border-radius: 1rem;
    background-color: var(--color-primary-1);
    padding: 2rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .modal__header {
      height: 3rem;
      border-bottom: 1px solid #e2e2e2;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      .modal__header--title {
        height: 2rem;
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 2rem;
        color: var(--color-primary-4);
      }

      & > button {
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }

  .modal-content {
    width: 100%;
    height: calc(100% - 3rem);
    position: relative;

    & > div {
      margin-bottom: 2rem;
      width: 100%;

      .filter-option__title {
        width: 100%;

        p {
          font-size: 1.125rem;
          font-weight: 500;
          line-height: 1.125rem;
          color: var(--color-primary-3);
        }
      }

      .filter-option__wrapper {
        width: 100%;
        padding: 1rem 0;

        .filter-option__list {
          width: 100%;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 0.5rem;

          .filter-option__item {
            width: 30%;
            height: 1.3rem;
          }
        }
      }

      .filter-option__options {
        margin-top: 0.5rem;
      }
    }

    .button__search-filter {
      width: 100%;
      height: 3rem;
      background-color: var(--color-primary-4);
      border-radius: 0.5rem;
      color: var(--color-black-2);
      font-weight: 500;
      font-size: 1rem;
      cursor: pointer;
      position: absolute;
      bottom: 1rem;
      left: 0;
    }
  }
`

const FilterModalComponent: React.FC<FilterModalComponentProps> = (props) => {
  const { onClickCloseModal } = props
  const router = useRouter()
  const formMethods = useForm<FilterFormType>({
    defaultValues: {
      generation: (router.query.generation as Array<string>) ?? [],
      isEvolution: (router.query.isEvolution as string) ?? null,
      isMega: (router.query.isMega as string) ?? null,
      isRegion: (router.query.isRegion as string) ?? null,
    },
  })

  const { watch, register, setValue, getValues, handleSubmit } = formMethods

  const handleClickCloseModal = () => {
    onClickCloseModal()
  }

  const handleChangeGeneration = (e: ChangeEvent<HTMLInputElement>) => {
    const prevList = getValues('generation')
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
    const { query, pathname } = router

    const filter = {
      ...(filterData.generation && {
        generation: filterData.generation,
      }),
      ...(filterData.isMega && {
        isMega: filterData.isMega,
      }),
      ...(filterData.isEvolution && {
        isEvolution: filterData.isEvolution,
      }),
      ...(filterData.isRegion && {
        isRegion: filterData.isRegion,
      }),
    }

    router.replace({
      pathname,
      query: {
        ...query,
        ...filter,
      },
    })

    onClickCloseModal()
  }

  const generation = watch('generation')

  return (
    <FilterModal>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmitFilter)}>
          <section className="modal-section">
            <header className="modal__header">
              <p className="modal__header--title">추가 필터 검색</p>
              <button
                className="modal__button--close"
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
            <div className="modal-content">
              <div className="content__filter-option--generation">
                <div className="filter-option__title">
                  <p>포켓몬 세대</p>
                </div>
                <div className="filter-option__wrapper">
                  <ul className="filter-option__list">
                    {new Array(9).fill(null).map((_, index: number) => {
                      const gen = index + 1
                      return (
                        <li
                          className="filter-option__item"
                          key={`pokemon-generation-id-${index}`}
                        >
                          <Checkbox
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
              <div className="content__filter-option--mega">
                <div className="filter-option__title">
                  <p>메가진화 가능 포켓몬 포함</p>
                </div>
                <div className="filter-option__options">
                  <RadioGroup options={RadioOptions} {...register('isMega')} />
                </div>
              </div>
              <div className="content__filter-option--region">
                <div className="filter-option__title">
                  <p>리전폼 존재 포켓몬 포함</p>
                </div>
                <div className="filter-option__options">
                  <RadioGroup
                    options={RadioOptions}
                    {...register('isRegion')}
                  />
                </div>
              </div>
              <div className="content__filter-option--evolution">
                <div className="filter-option__title">
                  <p>진화 가능 포켓몬 포함</p>
                </div>
                <div className="filter-option__options">
                  <RadioGroup
                    options={RadioOptions}
                    {...register('isEvolution')}
                  />
                </div>
              </div>
              <button className="button__search-filter" type="submit">
                필터 조건으로 검색하기
              </button>
            </div>
          </section>
        </form>
      </FormProvider>
    </FilterModal>
  )
}

export default React.memo(FilterModalComponent, isEqual)
