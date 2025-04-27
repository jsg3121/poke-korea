import { MouseEvent, useState } from 'react'
import styled, { css } from 'styled-components'
import { PokemonTypes } from '~/types/pokemonTypes.types'

type ActiveTableType = 'double' | 'half' | 'zero' | undefined

type StyledType = {
  activeType: ActiveTableType
}

const TypeEffectivenessTableComponent = () => {
  const [activeType, setActiveType] = useState<ActiveTableType>(undefined)

  const handleClickActiveEffective = (e: MouseEvent<HTMLButtonElement>) => {
    const effectiveType = e.currentTarget.dataset.effective as ActiveTableType

    if (effectiveType === activeType) {
      setActiveType(() => undefined)
    } else {
      setActiveType(() => effectiveType)
    }
  }

  return (
    <Article activeType={activeType}>
      <table aria-labelledby="pokemon-type-effectiveness-table">
        <caption>
          <h2 id="pokemon-type-effectiveness-table">포켓몬 타입별 상성 표</h2>
          <div className="view-pointer-text">
            <button
              type="button"
              data-effective="double"
              className={activeType === 'double' ? 'active-pointer' : ''}
              onClick={handleClickActiveEffective}
            >
              2배만 보기
            </button>
            <button
              type="button"
              data-effective="half"
              className={activeType === 'half' ? 'active-pointer' : ''}
              onClick={handleClickActiveEffective}
            >
              0.5배만 보기
            </button>
            <button
              type="button"
              data-effective="zero"
              className={activeType === 'zero' ? 'active-pointer' : ''}
              onClick={handleClickActiveEffective}
            >
              0배만 보기
            </button>
          </div>
        </caption>
        <colgroup>
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
          <col width={'5%'} />
        </colgroup>
        <thead>
          <tr>
            <th colSpan={2} rowSpan={2} className="row-header"></th>
            <th colSpan={18}>공격 받는 포켓몬</th>
          </tr>
          <tr>
            {Object.entries(PokemonTypes).map(([key, value]) => {
              return (
                <th key={`type-effective-table-key-${key}`} scope="col">
                  {value}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th rowSpan={19}>
              공격
              <br />
              하는
              <br />
              포켓몬
            </th>
            <th scope="row">{PokemonTypes.NORMAL}</th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="zero-type">0배</td>
            <td></td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.FIRE}</th>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="half-type">0.5배</td>
            <td className="double-type">2배</td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.WATER}</th>
            <td></td>
            <td className="double-type">2배</td>
            <td className="half-type">0.5배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.GRASS}</th>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="double-type">2배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="double-type">2배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="double-type">2배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.ELECTRIC}</th>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td className="half-type">0.5배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td></td>
            <td className="zero-type">0배</td>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.ICE}</th>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="half-type">0.5배</td>
            <td className="double-type">2배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.FIGHTING}</th>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="half-type">0.5배</td>
            <td className="half-type">0.5배</td>
            <td className="double-type">2배</td>
            <td className="zero-type">0배</td>
            <td></td>
            <td className="double-type">2배</td>
            <td className="double-type">2배</td>
            <td className="half-type">0.5배</td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.POISON}</th>
            <td></td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td className="zero-type">0배</td>
            <td className="double-type">2배</td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.GROUND}</th>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td className="zero-type">0배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.FLYING}</th>
            <td></td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.PSYCHIC}</th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="zero-type">0배</td>
            <td className="half-type">0.5배</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.BUG}</th>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="double-type">2배</td>
            <td className="half-type">0.5배</td>
            <td className="half-type">0.5배</td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.ROCK}</th>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="double-type">2배</td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.GHOST}</th>
            <td className="zero-type">0배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.DRAGON}</th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="zero-type">0배</td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.DARK}</th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="half-type">0.5배</td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.STEEL}</th>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="double-type">2배</td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.FAIRY}</th>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="double-type">2배</td>
            <td className="double-type">2배</td>
            <td className="half-type">0.5배</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </Article>
  )
}

export default TypeEffectivenessTableComponent

const Article = styled.div<StyledType>`
  ${({ activeType }) => css`
    width: 100%;
    height: 100%;

    & > table {
      width: 100%;
      height: 100%;
      background-color: var(--color-primary-4);
      table-layout: fixed;

      & > caption {
        width: 100%;
        height: 2rem;
        caption-side: top;
        margin: 0 0 0.5rem;

        & > h2 {
          height: 2rem;
          font-size: 1.5rem;
          line-height: 2rem;
          float: left;
          color: var(--color-primary-4);
        }

        & > .view-pointer-text {
          height: 16.5rem;
          height: 2rem;
          display: flex;
          align-items: flex-end;
          gap: 0.5rem;
          float: right;
          vertical-align: bottom;

          & > button {
            height: 2rem;
            font-size: 1rem;
            line-height: 2rem;
            color: var(--color-primary-3);
            cursor: pointer;

            &:hover,
            &.active-pointer {
              color: var(--color-primary-4);
            }
          }
        }
      }

      & > thead {
        border-bottom: 1px solid var(--color-primary-1);

        & > tr {
          width: 100%;
          height: 3.5rem;
          background-color: var(--color-primary-3);
          border: 1px solid var(--color-primary-3);

          & > th {
            width: 5%;
            height: 100%;
            font-size: 1rem;
            text-align: center;
            font-weight: 600;
            letter-spacing: 1px;
            color: #000000;
            vertical-align: middle;
            border-left: 1px solid var(--color-primary-2);
            border-top: 1px solid var(--color-primary-2);
          }

          &:first-child {
            & > th:first-child {
              border-left: 0;
              position: relative;
            }
          }
        }
      }

      & > tbody {
        width: 100%;

        & > tr {
          height: 3rem;

          & > th {
            font-weight: 600;
            letter-spacing: 1px;
            color: #000000;
          }

          & > th,
          & > td {
            width: 5%;
            vertical-align: middle;
            text-align: center;
            border: 1px solid var(--color-primary-3);
            font-size: 1rem;
            line-height: 1.1rem;

            &.double-type {
              color: #28b448;
            }

            &.half-type {
              color: #c78e23;
            }

            &.zero-type {
              color: #888888;
            }

            ${activeType === 'double' &&
            css`
              &.zero-type,
              &.half-type {
                opacity: 0.3;
              }

              &.double-type {
                font-size: 1.125rem;
                font-weight: 600;
              }
            `}

            ${activeType === 'half' &&
            css`
              &.zero-type,
              &.double-type {
                opacity: 0.3;
              }

              &.half-type {
                font-size: 1.125rem;
                font-weight: 600;
              }
            `}

             ${activeType === 'zero' &&
            css`
              &.double-type,
              &.half-type {
                opacity: 0.3;
              }

              &.zero-type {
                font-size: 1.125rem;
                font-weight: 600;
              }
            `}
          }
        }
      }
    }
  `}
`
