import { useContext } from 'react'
import { DetailContext } from '~/context/Detail.context'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import { getDamageTypeKorean } from '~/utils/skill.util'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'

const GmaxMoveInfoComponent = () => {
  const { gigantamaxInfo, activeIndex } = useContext(DetailContext)

  const gigantamaxData = gigantamaxInfo?.[activeIndex]
  const gmaxMove = gigantamaxData?.gmaxMove

  if (!gmaxMove) {
    return null
  }

  return (
    <section
      aria-labelledby="pokemon-gmax-move"
      className="card-detail w-full h-full max-h-[37.5rem]"
    >
      <InfoCardTitleComponent
        title="거다이맥스 전용 기술"
        id="pokemon-gmax-move"
      />
      <div className="w-full h-[calc(100%-4.25rem)]">
        <div className="w-full h-8 flex align-center bg-primary-2" aria-hidden>
          <p className="w-[40%] h-8 leading-8 text-primary-4 text-center">
            기술명
          </p>
          <p className="w-[15%] h-8 leading-8 text-primary-4 text-center">
            타입
          </p>
          <p className="w-[15%] h-8 leading-8 text-primary-4 text-center">
            위력
          </p>
          <p className="w-[15%] h-8 leading-8 text-primary-4 text-center">
            유형
          </p>
          <p className="w-[15%] h-8 leading-8 text-primary-4 text-center">
            효과
          </p>
        </div>
        <table className="w-full h-fit table-fixed">
          <colgroup>
            <col width="40%" />
            <col width="15%" />
            <col width="15%" />
            <col width="15%" />
            <col width="15%" />
          </colgroup>
          <thead className="sr-only">
            <tr>
              <th>기술명</th>
              <th>타입</th>
              <th>위력</th>
              <th>유형</th>
              <th>효과</th>
            </tr>
          </thead>
          <tbody>
            <tr className="h-8 [&>td]:align-middle text-sm">
              <td className="text-center font-semibold">{gmaxMove.nameKo}</td>
              <td className="text-center">
                {gmaxMove.type && (
                  <span
                    className={`w-[3.6rem] h-6 block px-2 rounded-[0.625rem] text-center text-[0.85rem] text-aligned-sm font-semibold mx-auto chip-type-${gmaxMove.type.toLowerCase()}`}
                  >
                    {PokemonTypes[gmaxMove.type]}
                  </span>
                )}
              </td>
              <td className="text-center">{gmaxMove.power || '-'}</td>
              <td>
                <span className="w-full flex-center block badge-damage-physical">
                  {getDamageTypeKorean('physical')}
                </span>
              </td>
              <td className="text-center">있음</td>
            </tr>
          </tbody>
        </table>

        {gmaxMove.effect && (
          <div className="mt-6 p-4 bg-primary-5 rounded-lg">
            <h3 className="text-base font-bold mb-2">기술 효과</h3>
            <p className="text-sm leading-relaxed">{gmaxMove.effect}</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h3 className="text-base font-bold mb-2 text-amber-800">
            다이맥스 기술 정보
          </h3>
          <p className="text-sm leading-relaxed text-amber-700">
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
