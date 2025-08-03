import { useContext } from 'react'
import { DetailContext } from '~/context/Detail.context'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const MachineLearnableSkillComponent = () => {
  const { pokemonId } = useParams()
  const { activeTypeInfo } = useContext(DetailContext)

  const machineSkills = activeTypeInfo?.learnableSkills?.[0]?.machineSkills
  const versionGroup = activeTypeInfo?.learnableSkills?.[0]?.versionGroup

  return (
    <section
      aria-labelledby="pokemon-machine-learnable-skill"
      className="w-full h-full max-h-[37.5rem] bg-primary-4 border-[3px] border-solid border-primary-1 rounded-2xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4"
    >
      <InfoCardTitleComponent
        title="기술/비전 머신 습득 기술 정보"
        id="pokemon-machine-learnable-skill"
      />
      <div className="w-full h-6 flex items-baseline justify-between border-b border-solid border-primary-3">
        <p>
          버전 정보 : <b className="font-bold">{versionGroup?.nameKo}</b>
        </p>
        <Link
          href={`/detail/${pokemonId}/moves`}
          className="text-[0.8rem] h-5 bg-primary-2 leading-[calc(1.25rem+2px)] px-3 text-primary-4 rounded-[0.375rem]"
        >
          모든 세대 기술 보러가기
        </Link>
      </div>
      <div className="w-full h-[calc(100%-6rem)]  overflow-y-auto">
        <div
          className="w-full h-8 flex align-center bg-primary-2 sticky top-0"
          aria-hidden
        >
          <p className="w-[44%] h-8 leading-8 text-primary-4 text-center">
            기술명
          </p>
          <p className="w-[14%] h-8 leading-8 text-primary-4 text-center">
            타입
          </p>
          <p className="w-[10%] h-8 leading-8 text-primary-4 text-center">
            위력
          </p>
          <p className="w-[12%] h-8 leading-8 text-primary-4 text-center">
            명중률
          </p>
          <p className="w-[10%] h-8 leading-8 text-primary-4 text-center">PP</p>
          <p className="w-[10%] h-8 leading-8 text-primary-4 text-center">
            유형
          </p>
        </div>
        <table className="w-full h-fit table-fixed">
          <colgroup>
            <col width="44%" />
            <col width="14%" />
            <col width="10%" />
            <col width="12%" />
            <col width="10%" />
            <col width="10%" />
          </colgroup>
          <thead className="visually-hidden">
            <tr>
              <th>기술명</th>
              <th>타입</th>
              <th>위력</th>
              <th>명중률</th>
              <th>PP</th>
              <th>유형</th>
            </tr>
          </thead>
          <tbody>
            {machineSkills &&
              machineSkills.map((levelUpSkill) => {
                const { skill } = levelUpSkill
                return (
                  <tr
                    key={`machine-moves-${skill.id}`}
                    className="h-8 [&>td]:align-middle [&>td]: text-[0.875rem]"
                  >
                    <td>{skill.name}</td>
                    <td className="text-center">
                      <span
                        className={`w-[3.6rem] h-6 block px-2 rounded-[0.625rem] text-center text-[0.85rem] leading-[calc(1.5rem+2px)] font-semibold mx-auto chip-type-${skill.type.toLowerCase()}`}
                      >
                        {PokemonTypes[skill.type]}
                      </span>
                    </td>
                    <td className="text-center">{skill.power}</td>
                    <td className="text-center">{skill.accuracy}</td>
                    <td className="text-center">{skill.pp}</td>
                    <td
                      className={`text-center
                         ${
                           skill.damageType === '물리'
                             ? 'bg-[#fd8181]'
                             : skill.damageType === '특수'
                               ? 'bg-[#9b9bfa]'
                               : 'bg-[#72d372]'
                         }
                      `}
                    >
                      {skill.damageType}
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

export default MachineLearnableSkillComponent
