import React from 'react'
import isEqual from 'fast-deep-equal'
import styled from 'styled-components'
import { Checkbox, Image, RadioGroup, Switch } from '~/components'
import { useForm } from 'react-hook-form'

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

  .modal-section {
    width: 30rem;
    height: 40rem;
    border-radius: 1rem;
    background-color: #b8bfc9;
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
        color: #142129;
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
          color: #142129;
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
      background-color: #142129;
      border-radius: 0.5rem;
      color: #ffffff;
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

  const handleClickCloseModal = () => {
    onClickCloseModal()
  }

  const handleCheckGeneration = (generation: string) => {}

  const handleChangeMegaEvolution = () => {}

  const handleSelect = () => {}

  return (
    <FilterModal>
      <section className="modal-section">
        <header className="modal__header">
          <p className="modal__header--title">추가 필터 검색</p>
          <button
            className="modal__button--close"
            type="button"
            onClick={handleClickCloseModal}>
            <Image
              alt="필터 팝업 닫기"
              src="/assets/image/close.svg"
              height="1.25rem"
              width="1.25rem"
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
                  return (
                    <li
                      className="filter-option__item"
                      key={`pokemon-generation-id-${index}`}>
                      <Checkbox
                        label={`${index + 1}세대`}
                        onChecked={handleCheckGeneration}
                        value={`${index + 1}`}
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
              <RadioGroup
                name="isMegaEvolution"
                onSelect={handleSelect}
                options={RadioOptions}
              />
            </div>
          </div>
          <div className="content__filter-option--region">
            <div className="filter-option__title">
              <p>리전폼 존재 포켓몬 포함</p>
            </div>
            <div className="filter-option__options">
              <RadioGroup
                name="hasRegionForm"
                onSelect={handleSelect}
                options={RadioOptions}
              />
            </div>
          </div>
          <div className="content__filter-option--evolution">
            <div className="filter-option__title">
              <p>진화 가능 포켓몬 포함</p>
            </div>
            <div className="filter-option__options">
              <RadioGroup
                name="hasEvolution"
                onSelect={handleSelect}
                options={RadioOptions}
              />
            </div>
          </div>
          <button className="button__search-filter" type="button">
            필터 조건으로 검색하기
          </button>
        </div>
      </section>
    </FilterModal>
  )
}

export default React.memo(FilterModalComponent, isEqual)
