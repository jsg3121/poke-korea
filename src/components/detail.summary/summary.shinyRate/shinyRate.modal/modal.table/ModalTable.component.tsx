const ModalTableComponent = () => {
  return (
    <table aria-label="이로치 포획률" className="w-full">
      <caption className="w-full text-xs text-right text-primary-2 caption-bottom mt-1">
        포켓몬 세대별 이로치 포획률
      </caption>
      <colgroup>
        <col width={'10%'} />
        <col width={'22.5%'} />
        <col width={'22.5%'} />
        <col width={'22.5%'} />
        <col width={'22.5%'} />
      </colgroup>
      <thead className="border-b border-solid border-primary-1">
        <tr className="w-full h-14 bg-primary-3">
          <th className="text-center align-middle">
            <p className="w-full h-full text-[0.9rem] text-black">세대</p>
          </th>
          <th className="text-center align-middle">
            <p className="w-full h-full text-[0.9rem] text-black">
              기본 출현률
            </p>
          </th>
          <th className="text-center align-middle">
            <p className="w-full h-full text-[0.9rem] text-black">국제 교배*</p>
          </th>
          <th className="text-center align-middle">
            <p className="w-full h-full text-[0.9rem] text-black">
              빛나는 부적*
            </p>
          </th>
          <th className="text-center align-middle">
            <p className="w-full h-full text-[0.9rem] text-black">
              국제 교배 <br />+ <br />
              빛나는 부적
            </p>
          </th>
        </tr>
      </thead>
      <tbody className="w-full border-b border-solid border-primary-1">
        <tr className="h-12">
          <th
            scope="row"
            role="columnheader"
            className="align-middle text-center"
          >
            <p className="w-full text-[0.9rem] text-primary-1">2세대</p>
          </th>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">
              1/8192 <br />
              <span className="text-xs text-primary-2">(0.012%)</span>
            </p>
          </td>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">-</p>
          </td>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">-</p>
          </td>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">-</p>
          </td>
        </tr>
        <tr className="h-12">
          <th
            scope="row"
            role="columnheader"
            className="align-middle text-center"
          >
            <p className="w-full text-[0.9rem] text-primary-1">3세대</p>
          </th>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">
              1/8192 <br />
              <span className="text-xs text-primary-2">(0.012%)</span>
            </p>
          </td>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">-</p>
          </td>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">-</p>
          </td>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">-</p>
          </td>
        </tr>
        <tr className="h-12">
          <th
            scope="row"
            role="columnheader"
            className="align-middle text-center"
          >
            <p className="w-full text-[0.9rem] text-primary-1">4세대</p>
          </th>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">
              1/8192
              <br /> <span className="text-xs text-primary-2">(0.012%)</span>
            </p>
          </td>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">
              1/2048 <br />
              <span className="text-xs text-primary-2">(0.048%)</span>
            </p>
          </td>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">-</p>
          </td>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">-</p>
          </td>
        </tr>
        <tr className="h-12">
          <th
            scope="row"
            role="columnheader"
            className="align-middle text-center"
          >
            <p className="w-full text-[0.9rem] text-primary-1">5세대</p>
          </th>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">
              1/8192 <br />
              <span className="text-xs text-primary-2">(0.012%)</span>
            </p>
          </td>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">
              1/1365 <br />
              <span className="text-xs text-primary-2">(0.073%)</span>
            </p>
          </td>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">
              1/2730 <br />
              <span className="text-xs text-primary-2">(0.037%)</span>
            </p>
          </td>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">
              1/1024 <br />
              <span className="text-xs text-primary-2">(0.098%)</span>
            </p>
          </td>
        </tr>
        <tr className="h-12">
          <th
            scope="row"
            role="columnheader"
            className="align-middle text-center"
          >
            <p className="w-full text-[0.9rem] text-primary-1">6세대~</p>
          </th>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">
              1/4096 <br />
              <span className="text-xs text-primary-2">(0.024%)</span>
            </p>
          </td>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">
              1/682 <br />
              <span className="text-xs text-primary-2">(0.147%)</span>
            </p>
          </td>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">
              1/1365
              <br /> <span className="text-xs text-primary-2">(0.073%)</span>
            </p>
          </td>
          <td className="align-middle text-center">
            <p className="w-full text-[0.9rem] text-primary-1">
              1/512 <br />
              <span className="text-xs text-primary-2">(0.195%)</span>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default ModalTableComponent
