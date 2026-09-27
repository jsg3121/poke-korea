'use client'

import { useContext } from 'react'

import { PokemonZMove } from '~/graphql/typeGenerated'
import {
  getDamageTypeChipColor,
  getDamageTypeKorean,
  hasDamageType,
} from '~/utils/skill.util'
import { DetailContext } from '~/context/Detail.context'
import Chip from '~/components/chip/Chip.component'
import Tag from '~/components/tag/Tag.component'

import InfoCardTitle from './components/InfoCardTitle.component'
import {
  MoveConceptNote,
  MoveEffectDescription,
} from './components/MoveDescription.component'

const DetailExclusiveMoves = () => {
  const {
    pokemonBaseInfo,
    normalForm,
    regionFormInfo,
    gigantamaxInfo,
    activeType,
    activeIndex,
  } = useContext(DetailContext)

  const isGigantamaxMode = activeType === 'gigantamax'
  const gmaxMove = isGigantamaxMode
    ? gigantamaxInfo?.[activeIndex]?.gmaxMove
    : undefined

  const getExclusiveZMoves = (): PokemonZMove[] => {
    if (isGigantamaxMode) return []
    switch (activeType) {
      case 'region': {
        return regionFormInfo?.[activeIndex]?.exclusiveZMoves ?? []
      }
      default: {
        const formZMoves = normalForm?.[0]?.exclusiveZMoves
        return formZMoves && formZMoves.length > 0
          ? formZMoves
          : (pokemonBaseInfo?.exclusiveZMoves ?? [])
      }
    }
  }
  const exclusiveZMoves = getExclusiveZMoves()

  if (!gmaxMove && exclusiveZMoves.length === 0) {
    return null
  }

  const headCellClass =
    'h-8 leading-8 text-primary-4 text-center text-xs desktop:text-sm'

  return (
    <>
      {gmaxMove && (
        <section
          aria-labelledby="pokemon-gmax-move"
          className="card-detail w-full"
        >
          <InfoCardTitle title="거다이맥스 전용 기술" id="pokemon-gmax-move" />
          <table className="w-full table-fixed">
            <colgroup>
              <col width="35%" />
              <col width="20%" />
              <col width="15%" />
              <col width="30%" />
            </colgroup>
            <thead className="bg-primary-2">
              <tr>
                <th className={headCellClass}>기술명</th>
                <th className={headCellClass}>타입</th>
                <th className={headCellClass}>위력</th>
                <th className={headCellClass}>유형</th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-10 text-xs desktop:text-base [&>td]:align-middle">
                <td className="text-center font-semibold">{gmaxMove.nameKo}</td>
                <td className="justify-items-center text-center">
                  {gmaxMove.type && <Tag type={gmaxMove.type} />}
                </td>
                <td className="text-center">{gmaxMove.power || '-'}</td>
                <td className="text-center text-sm">
                  {gmaxMove.dependsOnBaseMove ? '기반 기술에 따름' : '-'}
                </td>
              </tr>
            </tbody>
          </table>
          {gmaxMove.effect && <MoveEffectDescription text={gmaxMove.effect} />}
          <MoveConceptNote
            title="거다이맥스 전용 기술 정보"
            text="거다이맥스 전용 기술은 특정 포켓몬이 거다이맥스했을 때만 사용할 수 있는 전용 기술이에요. 다이맥스 기술을 대체하며, 포켓몬마다 고유한 추가 효과를 발휘해요."
          />
        </section>
      )}

      {exclusiveZMoves.length > 0 && (
        <section
          aria-labelledby="pokemon-z-move"
          className="card-detail w-full"
        >
          <InfoCardTitle title="전용 Z기술" id="pokemon-z-move" />
          <table className="w-full">
            <thead className="bg-primary-2">
              <tr>
                <th className={headCellClass}>Z기술명</th>
                <th
                  className={`${headCellClass} min-w-[50px] desktop:min-w-[60px]`}
                >
                  타입
                </th>
                <th className={`${headCellClass} min-w-7 desktop:min-w-[44px]`}>
                  위력
                </th>
                <th
                  className={`${headCellClass} min-w-[53px] desktop:min-w-[64px]`}
                >
                  유형
                </th>
                <th className={headCellClass}>기반 기술</th>
              </tr>
            </thead>
            <tbody>
              {exclusiveZMoves.map((zMove) => (
                <tr
                  key={zMove.id}
                  className="min-h-10 border-b border-solid border-primary-3 text-2xs last:border-b-0 desktop:text-base [&>td]:align-middle [&>td]:py-2"
                >
                  <td className="break-all px-1 text-center text-2xs font-semibold desktop:text-sm">
                    {zMove.zSkill.nameKo}
                  </td>
                  <td className="justify-items-center text-center">
                    <Tag type={zMove.zSkill.type} />
                  </td>
                  <td className="text-center text-2xs desktop:text-sm">
                    {zMove.zSkill.power || '-'}
                  </td>
                  <td className="justify-items-center text-center">
                    {hasDamageType(zMove.zSkill.damageType) ? (
                      <Chip
                        label={getDamageTypeKorean(zMove.zSkill.damageType)}
                        color={getDamageTypeChipColor(zMove.zSkill.damageType)}
                      />
                    ) : (
                      <span className="text-2xs desktop:text-sm">
                        {getDamageTypeKorean(zMove.zSkill.damageType)}
                      </span>
                    )}
                  </td>
                  <td className="break-all px-1 text-center text-2xs desktop:text-sm">
                    {zMove.baseSkill.nameKo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {exclusiveZMoves.map((zMove) =>
            zMove.zSkill.description ? (
              <MoveEffectDescription
                key={`${zMove.id}-desc`}
                name={
                  exclusiveZMoves.length > 1 ? zMove.zSkill.nameKo : undefined
                }
                text={zMove.zSkill.description}
              />
            ) : null,
          )}
          <MoveConceptNote
            title="전용 Z기술 정보"
            text="전용 Z기술은 특정 포켓몬만 사용할 수 있는 Z기술이에요. 해당 포켓몬이 전용 Z크리스탈을 지닌 상태에서 기반 기술을 사용하면 전용 Z기술로 변환돼요."
          />
        </section>
      )}
    </>
  )
}

export default DetailExclusiveMoves
