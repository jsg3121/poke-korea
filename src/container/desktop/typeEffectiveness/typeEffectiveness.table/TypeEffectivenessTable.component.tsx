import { useState } from 'react'
import styled, { css } from 'styled-components'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import TableActivePointerComponent, {
  ActivePointerType,
} from './table.activePointer/TableActivePointer.component'

type StyledType = {
  activetype: ActivePointerType
}

const TypeEffectivenessTableComponent = () => {
  const [activeType, setActiveType] = useState<ActivePointerType>(undefined)

  const handleClickActiveEffective = (effectiveType: ActivePointerType) => {
    if (effectiveType === activeType) {
      setActiveType(() => undefined)
    } else {
      setActiveType(() => effectiveType)
    }
  }

  const handleClickResetActiveEffective = () => {
    setActiveType(() => undefined)
  }

  return (
    <Article activetype={activeType} aria-label="포켓몬 타입 상성표">
      <table aria-labelledby="pokemon-type-effectiveness-table">
        <caption>
          <h2 id="pokemon-type-effectiveness-table">포켓몬 타입별 상성 표</h2>
          <TableActivePointerComponent
            activeType={activeType}
            onClickPointer={handleClickActiveEffective}
            onClickResetEffective={handleClickResetActiveEffective}
          />
        </caption>
        <colgroup>
          <col width="5%" />
          <col width="5%" />
          {Object.keys(PokemonTypes).map((typeKey) => (
            <col
              key={`col-${typeKey}`}
              width="5%"
              aria-label={`${PokemonTypes[typeKey as keyof typeof PokemonTypes]} 타입이 공격 받을 때`}
            />
          ))}
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
  ${({ activetype }) => css`
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
          font-size: 2rem;
          font-weight: 600;
          line-height: calc(2rem + 2px);
          float: left;
          color: var(--color-primary-4);
        }
      }

      & > thead {
        border-bottom: 1px solid var(--color-primary-1);

        & > tr {
          width: 100%;
          height: 3.5rem;
          background-color: var(--color-primary-3);

          & > th {
            width: 5%;
            height: 100%;
            font-size: 1rem;
            text-align: center;
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
            letter-spacing: 1px;
            color: #ffffff;
            background-color: var(--color-primary-2);
            border-top: 1px solid var(--color-primary-3);
            border-right: 1px solid var(--color-primary-3);
          }

          & > td {
            border: 1px solid var(--color-primary-3);
          }

          & > th,
          & > td {
            width: 5%;
            vertical-align: middle;
            text-align: center;
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

            ${activetype === 'double' &&
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

            ${activetype === 'half' &&
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

             ${activetype === 'zero' &&
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
