import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useContext } from 'react'
import { DetailContext } from '~/context/Detail.context'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import { getDamageTypeKorean } from '~/utils/skill.util'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'

const LevelLearnableSkillComponent = () => {
  const { pokemonId } = useParams()
  const { activeTypeInfo, activeType, activeIndex } = useContext(DetailContext)

  const levelUpSkills = activeTypeInfo.learnableSkills?.levelUpSkills
  const versionGroup = activeTypeInfo?.versionGroupInfo

  const getMovesHref = () => {
    if (activeType === 'region') {
      return activeIndex > 0
        ? `/detail/${pokemonId}/moves/region/${activeIndex}`
        : `/detail/${pokemonId}/moves/region`
    }
    // 기본폼도 activeIndex > 0이면 Path 기반 URL 사용
    return activeIndex > 0
      ? `/detail/${pokemonId}/moves/form/${activeIndex}`
      : `/detail/${pokemonId}/moves`
  }

  return (
    <section
      aria-labelledby="pokemon-learnable-skill"
      className="card-detail w-full h-full max-h-[37.5rem]"
    >
      <InfoCardTitleComponent
        title="레벨업 습득 기술 정보"
        id="pokemon-learnable-skill"
      />
      <div className="w-full h-6 flex items-baseline justify-between mb-1">
        <p>
          버전 정보 :{' '}
          <b className="font-bold">
            {versionGroup?.levelUpSkillVersion?.baseVersionGroupName}
          </b>
        </p>
        <Link
          href={getMovesHref()}
          className="text-[0.8rem] h-5 bg-primary-2 text-aligned-xs px-3 text-primary-4 rounded-[0.375rem]"
        >
          모든 세대 기술 보러가기
        </Link>
      </div>
      <div className="w-full h-[calc(100%-6.25rem)] overflow-y-auto">
        <div
          className="w-full h-8 flex align-center bg-primary-2 sticky top-0"
          aria-hidden
        >
          <p className="w-[8%] h-8 leading-8 text-primary-4 text-center">
            레벨
          </p>
          <p className="w-[42%] h-8 leading-8 text-primary-4 text-center">
            기술명
          </p>
          <p className="w-[14%] h-8 leading-8 text-primary-4 text-center">
            타입
          </p>
          <p className="w-[8%] h-8 leading-8 text-primary-4 text-center">
            위력
          </p>
          <p className="w-[12%] h-8 leading-8 text-primary-4 text-center">
            명중률
          </p>
          <p className="w-[8%] h-8 leading-8 text-primary-4 text-center">PP</p>
          <p className="w-[8%] h-8 leading-8 text-primary-4 text-center">
            유형
          </p>
        </div>
        <table className="w-full h-fit table-fixed">
          <colgroup>
            <col width="8%" />
            <col width="42%" />
            <col width="14%" />
            <col width="8%" />
            <col width="12%" />
            <col width="8%" />
            <col width="8%" />
          </colgroup>
          <thead className="sr-only">
            <tr>
              <th>레벨</th>
              <th>기술명</th>
              <th>타입</th>
              <th>위력</th>
              <th>명중률</th>
              <th>PP</th>
              <th>유형</th>
            </tr>
          </thead>
          <tbody>
            {levelUpSkills &&
              levelUpSkills.map((levelUpSkill) => {
                const { level, skill } = levelUpSkill
                return (
                  <tr
                    key={`level-moves-${skill.id}-${level}`}
                    className="h-8 [&>td]:align-middle text-sm"
                  >
                    <td className="text-center">
                      {level === 0 ? '진화' : level === 1 ? '최초' : level}
                    </td>
                    <td>{skill.nameKo}</td>
                    <td className="text-center">
                      {skill.type && (
                        <span
                          className={`w-[3.6rem] h-6 block px-2 rounded-[0.625rem] text-center text-[0.85rem] text-aligned-sm font-semibold mx-auto chip-type-${skill.type.toLowerCase()}`}
                        >
                          {PokemonTypes[skill.type]}
                        </span>
                      )}
                    </td>
                    <td className="text-center">{skill.power || '-'}</td>
                    <td className="text-center">{skill.accuracy || '-'}</td>
                    <td className="text-center">{skill.pp || '-'}</td>
                    <td>
                      <span
                        className={`w-full flex-center block ${
                          getDamageTypeKorean(skill.damageType) === '물리'
                            ? 'badge-damage-physical'
                            : getDamageTypeKorean(skill.damageType) === '특수'
                              ? 'badge-damage-special'
                              : 'badge-damage-status'
                        }`}
                      >
                        {getDamageTypeKorean(skill.damageType)}
                      </span>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default LevelLearnableSkillComponent
