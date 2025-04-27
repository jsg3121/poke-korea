import styled from 'styled-components'
import { PokemonTypes } from '~/types/pokemonTypes.types'

const TypeEffectivenessTableComponent = () => {
  return (
    <Article>
      <table aria-labelledby="pokemon-type-effectiveness-table">
        <caption id="pokemon-type-effectiveness-table">
          포켓몬 타입별 상성 표
        </caption>
        <thead>
          <tr>
            <th></th>
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
            <td className="strong-type">2배</td>
            <td></td>
            <td className="strong-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="strong-type">2배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="strong-type">2배</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.WATER}</th>
            <td></td>
            <td className="strong-type">2배</td>
            <td className="half-type">0.5배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="strong-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td className="strong-type">2배</td>
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
            <td className="strong-type">2배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="strong-type">2배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="strong-type">2배</td>
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
            <td className="strong-type">2배</td>
            <td className="half-type">0.5배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td></td>
            <td className="zero-type">0배</td>
            <td className="strong-type">2배</td>
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
            <td className="strong-type">2배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td className="strong-type">2배</td>
            <td className="strong-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="strong-type">2배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.FIGHTING}</th>
            <td className="strong-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="strong-type">2배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="half-type">0.5배</td>
            <td className="half-type">0.5배</td>
            <td className="strong-type">2배</td>
            <td className="zero-type">0배</td>
            <td></td>
            <td className="strong-type">2배</td>
            <td className="strong-type">2배</td>
            <td className="half-type">0.5배</td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.POISON}</th>
            <td></td>
            <td></td>
            <td></td>
            <td className="strong-type">2배</td>
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
            <td className="strong-type">2배</td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.GROUND}</th>
            <td></td>
            <td className="strong-type">2배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="strong-type">2배</td>
            <td></td>
            <td></td>
            <td className="strong-type">2배</td>
            <td></td>
            <td className="zero-type">0배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="strong-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td className="strong-type">2배</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.FLYING}</th>
            <td></td>
            <td></td>
            <td></td>
            <td className="strong-type">2배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="strong-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="strong-type">2배</td>
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
            <td className="strong-type">2배</td>
            <td className="strong-type">2배</td>
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
            <td className="strong-type">2배</td>
            <td></td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="strong-type">2배</td>
            <td></td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="strong-type">2배</td>
            <td className="half-type">0.5배</td>
            <td className="half-type">0.5배</td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.ROCK}</th>
            <td></td>
            <td className="strong-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td className="strong-type">2배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="strong-type">2배</td>
            <td></td>
            <td className="strong-type">2배</td>
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
            <td className="strong-type">2배</td>
            <td></td>
            <td></td>
            <td className="strong-type">2배</td>
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
            <td className="strong-type">2배</td>
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
            <td className="strong-type">2배</td>
            <td></td>
            <td></td>
            <td className="strong-type">2배</td>
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
            <td className="strong-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="strong-type">2배</td>
            <td></td>
            <td></td>
            <td></td>
            <td className="half-type">0.5배</td>
            <td className="strong-type">2배</td>
          </tr>
          <tr>
            <th scope="row">{PokemonTypes.FAIRY}</th>
            <td></td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="strong-type">2배</td>
            <td className="half-type">0.5배</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="strong-type">2배</td>
            <td className="strong-type">2배</td>
            <td className="half-type">0.5배</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </Article>
  )
}

export default TypeEffectivenessTableComponent

const Article = styled.div`
  width: 100%;
  height: 100%;

  & > table {
    width: calc(100% - 3rem);
    height: 100%;
    background-color: var(--color-primary-4);
    table-layout: fixed;

    & > caption {
      width: 100%;
      font-size: 1.5rem;
      text-align: left;
      color: var(--color-primary-4);
      caption-side: top;
      margin: 0 0 0.5rem;
    }

    & > thead {
      border-bottom: 1px solid var(--color-primary-1);

      & > tr {
        width: 100%;
        height: 3.5rem;
        background-color: var(--color-primary-3);
        border: 1px solid var(--color-primary-3);

        & > th {
          width: 100%;
          height: 100%;
          font-size: 1rem;
          text-align: center;
          font-weight: 600;
          letter-spacing: 1px;
          color: #000000;
          vertical-align: middle;
          border-right: 1px solid var(--color-primary-2);

          &:last-child {
            border-right: 0;
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
          width: calc(100% / 19);
          vertical-align: middle;
          text-align: center;
          border: 1px solid var(--color-primary-3);
          font-size: 1rem;

          &.strong-type {
            color: #28b448;
          }

          &.half-type {
            color: #c78e23;
          }

          &.zero-type {
            color: #888888;
          }
        }
      }
    }
  }
`
