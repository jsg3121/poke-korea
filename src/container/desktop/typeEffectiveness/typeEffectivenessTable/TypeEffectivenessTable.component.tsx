import styled from 'styled-components'

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
            <th scope="col">Normal</th>
            <th scope="col">Fire</th>
            <th scope="col">Water</th>
            <th scope="col">Grass</th>
            <th scope="col">Electric</th>
            <th scope="col">Ice</th>
            <th scope="col">Fighting</th>
            <th scope="col">Poison</th>
            <th scope="col">Ground</th>
            <th scope="col">Flying</th>
            <th scope="col">Psychic</th>
            <th scope="col">Bug</th>
            <th scope="col">Rock</th>
            <th scope="col">Ghost</th>
            <th scope="col">Dragon</th>
            <th scope="col">Dark</th>
            <th scope="col">Steel</th>
            <th scope="col">Fairy</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Normal</th>
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
            <td>△</td>
            <td>x</td>
            <td></td>
            <td></td>
            <td>△</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Fire</th>
            <td></td>
            <td>△</td>
            <td>△</td>
            <td>◎</td>
            <td></td>
            <td>◎</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td>△</td>
            <td></td>
            <td>△</td>
            <td></td>
            <td>◎</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Water</th>
            <td></td>
            <td>◎</td>
            <td>△</td>
            <td>△</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td></td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td></td>
            <td>△</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Grass</th>
            <td></td>
            <td>△</td>
            <td>◎</td>
            <td>△</td>
            <td></td>
            <td></td>
            <td></td>
            <td>△</td>
            <td>◎</td>
            <td>△</td>
            <td></td>
            <td>△</td>
            <td>◎</td>
            <td></td>
            <td>△</td>
            <td></td>
            <td>△</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Electric</th>
            <td></td>
            <td></td>
            <td>◎</td>
            <td>△</td>
            <td>△</td>
            <td></td>
            <td></td>
            <td></td>
            <td>x</td>
            <td>◎</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>△</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Ice</th>
            <td></td>
            <td>△</td>
            <td>△</td>
            <td>◎</td>
            <td></td>
            <td>△</td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td>◎</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td></td>
            <td>△</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Fighting</th>
            <td>◎</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td></td>
            <td>△</td>
            <td></td>
            <td>△</td>
            <td>△</td>
            <td>△</td>
            <td>◎</td>
            <td>x</td>
            <td></td>
            <td>◎</td>
            <td>◎</td>
            <td>△</td>
          </tr>
          <tr>
            <th scope="row">Poison</th>
            <td></td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td></td>
            <td></td>
            <td></td>
            <td>△</td>
            <td>△</td>
            <td></td>
            <td></td>
            <td></td>
            <td>△</td>
            <td>△</td>
            <td></td>
            <td></td>
            <td>x</td>
            <td>◎</td>
          </tr>
          <tr>
            <th scope="row">Ground</th>
            <td></td>
            <td>◎</td>
            <td></td>
            <td>△</td>
            <td>◎</td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td></td>
            <td>x</td>
            <td></td>
            <td>△</td>
            <td>◎</td>
            <td></td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Flying</th>
            <td></td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td>△</td>
            <td></td>
            <td>◎</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td>△</td>
            <td></td>
            <td></td>
            <td></td>
            <td>△</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Psychic</th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td>◎</td>
            <td></td>
            <td></td>
            <td>△</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>x</td>
            <td>△</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Bug</th>
            <td></td>
            <td>△</td>
            <td></td>
            <td>◎</td>
            <td></td>
            <td></td>
            <td>△</td>
            <td>△</td>
            <td></td>
            <td>△</td>
            <td>◎</td>
            <td></td>
            <td></td>
            <td>△</td>
            <td></td>
            <td>◎</td>
            <td>△</td>
            <td>△</td>
          </tr>
          <tr>
            <th scope="row">Rock</th>
            <td></td>
            <td>◎</td>
            <td></td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td>△</td>
            <td></td>
            <td>△</td>
            <td>◎</td>
            <td></td>
            <td>◎</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>△</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Ghost</th>
            <td>x</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td></td>
            <td>△</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Dragon</th>
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
            <td>◎</td>
            <td></td>
            <td>△</td>
            <td>x</td>
          </tr>
          <tr>
            <th scope="row">Dark</th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>△</td>
            <td></td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td></td>
            <td>△</td>
            <td></td>
            <td>△</td>
          </tr>
          <tr>
            <th scope="row">Steel</th>
            <td></td>
            <td>△</td>
            <td>△</td>
            <td></td>
            <td>△</td>
            <td>◎</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td></td>
            <td></td>
            <td></td>
            <td>△</td>
            <td>◎</td>
          </tr>
          <tr>
            <th scope="row">Fairy</th>
            <td></td>
            <td>△</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td>△</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>◎</td>
            <td>◎</td>
            <td>△</td>
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
    width: 100%;
    height: 100%;
    background-color: var(--color-primary-4);

    & > caption {
      width: 100%;
      font-size: 0.75rem;
      text-align: right;
      color: var(--color-primary-2);
      caption-side: bottom;
      margin: 0.25rem 0 0;
    }

    & > thead {
      border-bottom: 1px solid var(--color-primary-1);

      & > tr {
        width: 100%;
        height: 3.5rem;
        background-color: var(--color-primary-3);

        & > th {
          text-align: center;
          vertical-align: middle;

          & > p {
            width: 100%;
            height: 100%;
            font-size: 0.9rem;
            color: #000000;
          }
        }
      }
    }

    & > tbody {
      width: 100%;
      border-bottom: 1px solid var(--color-primary-1);

      & > tr {
        height: 3rem;

        & > th,
        & > td {
          vertical-align: middle;
          text-align: center;

          & > p {
            width: 100%;
            font-size: 0.9rem;
            color: var(--color-primary-1);

            & > span {
              font-size: 0.75rem;
              color: var(--color-primary-2);
            }
          }
        }
      }
    }
  }
`
