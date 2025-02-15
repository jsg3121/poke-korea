import styled from 'styled-components'

const ModalTableComponent = () => {
  return (
    <Table aria-label="이로치 포획률">
      <thead>
        <tr>
          <th>세대</th>
          <th>기본 출현률</th>
          <th>국제 교배</th>
          <th>빛나는 부적</th>
          <th>국제 교배 + 빛나는 부적</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>2세대</th>
          <td>1/8192 (0.012%)</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <th>3세대</th>
          <td>1/8192 (0.012%)</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <th>4세대</th>
          <td>1/8192 (0.012%)</td>
          <td>1/2048 (0.048%)</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <th>5세대</th>
          <td>1/8192 (0.012%)</td>
          <td>1/1365 (0.073%)</td>
          <td>1/2730 (0.037%)</td>
          <td>1/1024 (0.098%)</td>
        </tr>
        <tr>
          <th>6세대 이후</th>
          <td>1/4096 (0.024%)</td>
          <td>1/682 (0.147%)</td>
          <td>1/1365 (0.073%)</td>
          <td>1/512 (0.195%)</td>
        </tr>
      </tbody>
    </Table>
  )
}

export default ModalTableComponent

const Table = styled.table``
