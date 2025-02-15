import styled from 'styled-components'

const ModalTableComponent = () => {
  return (
    <Div>
      <table aria-label="이로치 포획률">
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
      </table>
      <dl>
        <dt>국제 교배</dt>
        <dd>
          서로 다른 국가 언어로 된 포켓몬 끼리 교배하는 것으로, 알에서 이로치가
          나올 확률이 상승합니다.
        </dd>
        <dd>4세대(DP/PT)부터 추가되었으며, 세대별로 배율이 조금씩 다릅니다.</dd>
        <dt>빛나는 부적</dt>
        <dd>5세대(B2W2) 이후 추가된 도구 입니다.</dd>
        <dd>빛나는 부적을 획득하면 이로치 출현 확률을 더 높여줍니다.</dd>
      </dl>
      <p>
        이로치 포획 확률에 대해&nbsp;
        <a href="https://namu.wiki/w/%EC%83%89%EC%9D%B4%20%EB%8B%A4%EB%A5%B8%20%ED%8F%AC%EC%BC%93%EB%AA%AC">
          여기서
        </a>
        &nbsp;더 많은 정보를 확인하실 수 있습니다.
      </p>
    </Div>
  )
}

export default ModalTableComponent

const Div = styled.div`
  width: 100%;

  & > table {
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
          align-content: center;
          text-align: center;

          & > p {
            width: 100%;
            height: 100%;
            font-size: 1rem;
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
          align-content: center;
          text-align: center;

          & > p {
            width: 100%;
            font-size: 1rem;
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

  & > dl {
    width: 100%;
    display: flex;
    flex-direction: column;

    & > dt {
      width: 100%;
      height: 1.25rem;
      font-size: 1rem;
      line-height: 1.25rem;
      text-align: left;
      color: var(--color-primary-1);
      margin: 0.5rem 0 0.25rem;
    }

    & > dd {
      width: 100%;
      height: 1rem;
      font-size: 0.75rem;
      line-height: 1rem;
      text-align: left;
      color: var(--color-primary-2);
    }
  }

  & > p {
    width: 100%;
    min-height: 1.25rem;
    font-size: 1rem;
    line-height: 1.25rem;
    text-align: left;
    color: var(--color-primary-2);
    margin-top: 1rem;

    & > a {
      color: var(--color-primary-2);
      text-decoration: underline;
      font-style: italic;
    }
  }
`
