'use client'

import { useContext } from 'react'
import ChipComponent from '~/components/chip/Chip.component'
import { ChipColor } from '~/components/chip/chipStyle'
import TagComponent from '~/components/tag/Tag.component'
import { DetailContext } from '~/context/Detail.context'
import { PokemonZMove } from '~/graphql/typeGenerated'
import { getDamageTypeKorean } from '~/utils/skill.util'
import InfoCardTitleComponent from './components/InfoCardTitle.component'

/** 백엔드 damageType(소문자) → Chip color 매핑 (MoveDetailHero와 동일) */
const DAMAGE_CHIP_COLOR: Record<string, ChipColor> = {
  physical: 'physical',
  special: 'special',
  status: 'status',
}

/**
 * 전용 기술 카드 — Z기술·거다이맥스 기술 (기존 데/모 ZMoveInfo·GmaxMoveInfo 통합
 * 이관, 반응형 단일). 열 구성(기반 기술 등)이 습득 기술과 달라 MoveTable 대신
 * 기존 소형 표 구조를 유지한다(행 1~2개라 모바일 폭에서도 무리 없음).
 * 활성 폼에 해당 데이터가 없으면 렌더하지 않는다.
 */

const DetailExclusiveMovesContainer = () => {
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
        return (
          normalForm?.[0]?.exclusiveZMoves ??
          pokemonBaseInfo?.exclusiveZMoves ??
          []
        )
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
          <InfoCardTitleComponent
            title="거다이맥스 전용 기술"
            id="pokemon-gmax-move"
          />
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
                  {gmaxMove.type && <TagComponent type={gmaxMove.type} />}
                </td>
                <td className="text-center">{gmaxMove.power || '-'}</td>
                {/* 거다이맥스 기술은 기반 기술에 따라 물리/특수 모두 가능(GmaxMove에 damageType 없음 — 기존과 동일) */}
                <td className="text-center text-sm">
                  {getDamageTypeKorean('physical')} /{' '}
                  {getDamageTypeKorean('special')}
                </td>
              </tr>
            </tbody>
          </table>
          {gmaxMove.effect && (
            <p className="mt-4 text-sm font-medium leading-relaxed text-primary-1">
              {gmaxMove.effect}
            </p>
          )}
        </section>
      )}

      {exclusiveZMoves.length > 0 && (
        <section
          aria-labelledby="pokemon-z-move"
          className="card-detail w-full"
        >
          <InfoCardTitleComponent title="전용 Z기술" id="pokemon-z-move" />
          {/* 타입 Tag·유형 Chip은 고정/최소폭 요소라, 셀 폭이 좁으면 넘친다. col width(px)는
              반응형이 안 되고(Tag가 모바일 48→데스크톱 56px으로 커짐) 데스크톱에서 되레
              좁아지므로, 해당 열 셀에 반응형 min-w를 준다: 타입 50→60px, 유형 53→64px,
              위력 36→44px. 텍스트 열(기술명·기반)은 남는 폭을 나눠 갖고 break-all로 줄바꿈. */}
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
                  {/* 긴 Z기술명(예: 모크나이퍼 "섀도애로우즈스트라이크")은 좁은 모바일
                      셀에서 break-keep(단어 유지)이면 셀 밖으로 넘쳐 이웃 열과 겹친다.
                      break-all로 셀 안에서 줄바꿈시키고, 폰트도 모바일 2xs로 낮춘다. */}
                  <td className="break-all px-1 text-center text-2xs font-semibold desktop:text-sm">
                    {zMove.zSkill.nameKo}
                  </td>
                  <td className="justify-items-center text-center">
                    <TagComponent type={zMove.zSkill.type} />
                  </td>
                  <td className="text-center text-2xs desktop:text-sm">
                    {zMove.zSkill.power || '-'}
                  </td>
                  <td className="justify-items-center text-center">
                    {DAMAGE_CHIP_COLOR[
                      zMove.zSkill.damageType?.toLowerCase()
                    ] ? (
                      <ChipComponent
                        label={getDamageTypeKorean(zMove.zSkill.damageType)}
                        color={
                          DAMAGE_CHIP_COLOR[
                            zMove.zSkill.damageType.toLowerCase()
                          ]
                        }
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
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <h3 className="mb-1 text-xs font-bold text-amber-800 desktop:text-sm">
              전용 Z기술 정보
            </h3>
            <p className="text-2xs leading-relaxed text-amber-700 desktop:text-sm">
              전용 Z기술은 특정 포켓몬만 사용할 수 있는 Z기술입니다. 해당
              포켓몬이 전용 Z크리스탈을 지닌 상태에서 기반 기술을 사용하면 전용
              Z기술로 변환됩니다.
            </p>
          </div>
        </section>
      )}
    </>
  )
}

export default DetailExclusiveMovesContainer
