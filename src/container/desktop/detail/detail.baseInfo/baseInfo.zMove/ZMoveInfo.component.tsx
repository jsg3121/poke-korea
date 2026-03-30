import { useContext } from 'react'
import TagComponent from '~/components/Tag.component'
import { DetailContext } from '~/context/Detail.context'
import { PokemonZMove } from '~/graphql/typeGenerated'
import { getDamageTypeKorean } from '~/utils/skill.util'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'

const ZMoveInfoComponent = () => {
  const {
    pokemonBaseInfo,
    normalForm,
    regionFormInfo,
    activeType,
    activeIndex,
  } = useContext(DetailContext)

  const getExclusiveZMoves = (): PokemonZMove[] => {
    switch (activeType) {
      case 'region': {
        return regionFormInfo?.[activeIndex]?.exclusiveZMoves ?? []
      }
      default: {
        return (
          normalForm?.[0]?.exclusiveZMoves ??
          pokemonBaseInfo?.exclusiveZMoves ??
          []
        )
      }
    }
  }

  const exclusiveZMoves = getExclusiveZMoves()

  if (exclusiveZMoves.length === 0) {
    return null
  }

  return (
    <section
      aria-labelledby="pokemon-z-move"
      className="card-detail w-full h-full max-h-[37.5rem] col-span-2"
    >
      <InfoCardTitleComponent title="전용 Z기술" id="pokemon-z-move" />
      <div className="w-full h-[calc(100%-4.25rem)]">
        <div className="w-full h-8 flex align-center bg-primary-2" aria-hidden>
          <p className="w-[30%] h-8 leading-8 text-primary-4 text-center">
            Z기술명
          </p>
          <p className="w-[15%] h-8 leading-8 text-primary-4 text-center">
            타입
          </p>
          <p className="w-[10%] h-8 leading-8 text-primary-4 text-center">
            위력
          </p>
          <p className="w-[15%] h-8 leading-8 text-primary-4 text-center">
            유형
          </p>
          <p className="w-[30%] h-8 leading-8 text-primary-4 text-center">
            기반 기술
          </p>
        </div>
        <table className="w-full h-fit table-fixed border-b border-solid border-primary-3">
          <colgroup>
            <col width="30%" />
            <col width="15%" />
            <col width="10%" />
            <col width="15%" />
            <col width="30%" />
          </colgroup>
          <thead className="sr-only">
            <tr>
              <th>Z기술명</th>
              <th>타입</th>
              <th>위력</th>
              <th>유형</th>
              <th>기반 기술</th>
            </tr>
          </thead>
          <tbody>
            {exclusiveZMoves.map((zMove) => (
              <tr
                key={zMove.id}
                className="h-12 [&>td]:align-middle text-base border-b border-solid border-primary-3 last:border-b-0"
              >
                <td className="text-center font-semibold text-xl">
                  {zMove.zSkill.nameKo}
                </td>
                <td className="text-center justify-items-center">
                  <TagComponent type={zMove.zSkill.type} />
                </td>
                <td className="text-center">{zMove.zSkill.power || '-'}</td>
                <td className="text-center justify-items-center">
                  <span
                    className={`flex-center badge-damage-${zMove.zSkill.damageType}`}
                  >
                    {getDamageTypeKorean(zMove.zSkill.damageType)}
                  </span>
                </td>
                <td className="text-center">{zMove.baseSkill.nameKo}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h3 className="text-base font-bold mb-2 text-amber-800">
            전용 Z기술 정보
          </h3>
          <p className="text-base leading-relaxed text-amber-700">
            전용 Z기술은 특정 포켓몬만 사용할 수 있는 Z기술입니다. 해당 포켓몬이
            전용 Z크리스탈을 지닌 상태에서 기반 기술을 사용하면 전용 Z기술로
            변환됩니다.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ZMoveInfoComponent
