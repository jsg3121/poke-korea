import styled from 'styled-components'

const ModalTableComponent = () => {
  return (
    <Table aria-label="이로치 포획률">
      <caption>포켓몬 세대별 이로치 포획률</caption>
      <colgroup>
        <col width={'10%'} />
        <col width={'22.5%'} />
        <col width={'22.5%'} />
        <col width={'22.5%'} />
        <col width={'22.5%'} />
      </colgroup>
      <thead>
        <tr>
          <th>
            <p>세대</p>
          </th>
          <th>
            <p>기본 출현률</p>
          </th>
          <th>
            <p>국제 교배*</p>
          </th>
          <th>
            <p>빛나는 부적*</p>
          </th>
          <th>
            <p>
              국제 교배 <br />+ <br />
              빛나는 부적
            </p>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" role="columnheader">
            <p>2세대</p>
          </th>
          <td>
            <p>
              1/8192 <br />
              <span>(0.012%)</span>
            </p>
          </td>
          <td>
            <p>-</p>
          </td>
          <td>
            <p>-</p>
          </td>
          <td>
            <p>-</p>
          </td>
        </tr>
        <tr>
          <th scope="row" role="columnheader">
            <p>3세대</p>
          </th>
          <td>
            <p>
              1/8192 <br />
              <span>(0.012%)</span>
            </p>
          </td>
          <td>
            <p>-</p>
          </td>
          <td>
            <p>-</p>
          </td>
          <td>
            <p>-</p>
          </td>
        </tr>
        <tr>
          <th scope="row" role="columnheader">
            <p>4세대</p>
          </th>
          <td>
            <p>
              1/8192
              <br /> <span>(0.012%)</span>
            </p>
          </td>
          <td>
            <p>
              1/2048 <br />
              <span>(0.048%)</span>
            </p>
          </td>
          <td>
            <p>-</p>
          </td>
          <td>
            <p>-</p>
          </td>
        </tr>
        <tr>
          <th scope="row" role="columnheader">
            <p>5세대</p>
          </th>
          <td>
            <p>
              1/8192 <br />
              <span>(0.012%)</span>
            </p>
          </td>
          <td>
            <p>
              1/1365 <br />
              <span>(0.073%)</span>
            </p>
          </td>
          <td>
            <p>
              1/2730 <br />
              <span>(0.037%)</span>
            </p>
          </td>
          <td>
            <p>
              1/1024 <br />
              <span>(0.098%)</span>
            </p>
          </td>
        </tr>
        <tr>
          <th scope="row" role="columnheader">
            <p>6세대~</p>
          </th>
          <td>
            <p>
              1/4096 <br />
              <span>(0.024%)</span>
            </p>
          </td>
          <td>
            <p>
              1/682 <br />
              <span>(0.147%)</span>
            </p>
          </td>
          <td>
            <p>
              1/1365
              <br /> <span>(0.073%)</span>
            </p>
          </td>
          <td>
            <p>
              1/512 <br />
              <span>(0.195%)</span>
            </p>
          </td>
        </tr>
      </tbody>
    </Table>
  )
}

export default ModalTableComponent

const Table = styled.table`
  width: 100%;

  & > caption {
    width: 100%;
    font-size: 0.75rem;
    text-align: right;
    color: var(--color-primary-2);
    caption-side: bottom;
    margin: 0.25rem 0 0;
  }

  & > thead {
    border-top: 1px solid var(--color-primary-1);
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
`
