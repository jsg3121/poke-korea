import { useContext } from 'react'
import TagComponent from '~/components/Tag.component'
import { DetailContext } from '~/context/Detail.context'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'
import { getDamageTypeKorean } from '~/utils/skill.util'

const GmaxMoveInfoComponent = () => {
  const { gigantamaxInfo, activeIndex } = useContext(DetailContext)

  const gigantamaxData = gigantamaxInfo?.[activeIndex]
  const gmaxMove = gigantamaxData?.gmaxMove

  if (!gmaxMove) {
    return null
  }

  return (
    <section aria-labelledby="pokemon-gmax-move" className="w-full card-detail">
      <InfoCardTitleComponent
        title="거다이맥스 전용 기술"
        id="pokemon-gmax-move"
      />
      <div className="w-full">
        <div className="w-full h-8 flex align-center bg-primary-2" aria-hidden>
          <p className="w-[35%] h-8 leading-8 text-primary-4 text-center">
            기술명
          </p>
          <p className="w-[20%] h-8 leading-8 text-primary-4 text-center">
            타입
          </p>
          <p className="w-[15%] h-8 leading-8 text-primary-4 text-center">
            위력
          </p>
          <p className="w-[30%] h-8 leading-8 text-primary-4 text-center">
            유형
          </p>
        </div>
        <table className="w-full h-fit table-fixed">
          <colgroup>
            <col width="35%" />
            <col width="20%" />
            <col width="15%" />
            <col width="30%" />
          </colgroup>
          <thead className="sr-only">
            <tr>
              <th>기술명</th>
              <th>타입</th>
              <th>위력</th>
              <th>유형</th>
            </tr>
          </thead>
          <tbody>
            <tr className="h-10 [&>td]:align-middle text-base border-b border-solid border-primary-3">
              <td className="text-center font-semibold text-lg">
                {gmaxMove.nameKo}
              </td>
              <td className="text-center justify-items-center">
                {gmaxMove.type && <TagComponent type={gmaxMove.type} />}
              </td>
              <td className="text-center">{gmaxMove.power || '-'}</td>
              <td className="text-center justify-items-center">
                <div className="flex items-center gap-1">
                  <span className="w-12 h-6 text-[0.875rem] leading-[calc(1.5rem+2px)] block badge-damage-physical">
                    {getDamageTypeKorean('physical')}
                  </span>
                  <span className="w-12 h-6 text-[0.875rem] leading-[calc(1.5rem+2px)] block badge-damage-special">
                    {getDamageTypeKorean('special')}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        {gmaxMove.effect && (
          <div className="mt-2 p-2 bg-primary-5 rounded-lg">
            <h3 className="text-base font-bold mb-2">기술 효과</h3>
            <p className="text-base leading-relaxed">{gmaxMove.effect}</p>
          </div>
        )}
        <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
          <h3 className="text-base font-bold mb-2 text-amber-800">
            다이맥스 기술 정보
          </h3>
          <p className="text-base leading-relaxed text-amber-700">
            거다이맥스 포켓몬은 일반 다이맥스 기술 대신 전용 거다이맥스 기술을
            사용합니다. 이 기술은 해당 타입의 공격 기술을 사용할 때 발동되며,
            일반 다이맥스 기술과는 다른 특별한 효과를 가집니다.
          </p>
        </div>
      </div>
    </section>
  )
}

export default GmaxMoveInfoComponent
