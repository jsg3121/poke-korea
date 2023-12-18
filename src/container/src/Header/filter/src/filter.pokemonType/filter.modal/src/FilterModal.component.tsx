import React from 'react'
import isEqual from 'fast-deep-equal'
import styled from 'styled-components'
import { Checkbox, Image } from '~/components'

interface FilterModalComponentProps {
  onClickCloseModal: () => void
}

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
      height: 2rem;
      border-bottom: 1px solid #b8bfc9;
      margin-bottom: 1rem;
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

    .content__filter-option--generation {
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
    }
  }
`

const FilterModalComponent: React.FC<FilterModalComponentProps> = (props) => {
  const { onClickCloseModal } = props

  const handleClickCloseModal = () => {
    onClickCloseModal()
  }

  const handleCheckGeneration = (generation: string) => {}

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
              <p>메가진화가 가능한가요?</p>
            </div>
            <div className="filter-option__options"></div>
          </div>
          <div className="content__filter-option--region">
            <div className="filter-option__title">
              <p>리전폼이 있나요?</p>
            </div>
            <div className="filter-option__options"></div>
          </div>
          <div className="content__filter-option--evolution">
            <div className="filter-option__title">
              <p>진화가 가능한가요?</p>
            </div>
            <div className="filter-option__options"></div>
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
