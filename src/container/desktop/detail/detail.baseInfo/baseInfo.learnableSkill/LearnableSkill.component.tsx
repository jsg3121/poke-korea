import { useContext } from 'react'
import { DetailContext } from '~/context/Detail.context'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'

const LearnableSkillComponent = () => {
  const { pokemonBaseInfo } = useContext(DetailContext)

  const levelUpSkills =
    pokemonBaseInfo?.learnableSkills?.[0].levelUpSkills.sort(
      (a, b) => a.level - b.level,
    )
  // const machineSkills = pokemonBaseInfo?.learnableSkills?.[0].machineSkills
  const versionGroup = pokemonBaseInfo?.learnableSkills?.[0].versionGroup

  return (
    <section
      aria-labelledby="pokemon-learnable-skill"
      className="w-full h-full max-h-[50rem] row-span-2 bg-primary-4 border-[3px] border-solid border-primary-1 rounded-2xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4"
    >
      <InfoCardTitleComponent
        title="습득 기술 정보"
        id="pokemon-learnable-skill"
      />
      <p className="w-full h-6 flex items-baseline justify-between border-b border-solid border-primary-3">
        가장 최신 등장 세대의 기술을 볼 수 있습니다.
        <span className="text-[0.8rem]">모든 세대 기술 보러가기</span>
      </p>
      <div className="w-full h-[calc(100%-7rem)]  overflow-y-auto">
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
          <thead className="visually-hidden">
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
                    key={skill.id}
                    className="h-8 [&>td]:align-middle [&>td]: text-[0.875rem]"
                  >
                    <td className="text-center font-bold">
                      {level === 0 || level === 1 ? '최초' : level}
                    </td>
                    <td className="">{skill.name}</td>
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
      <footer className="border-t border-solid border-primary-1">
        <p className="w-full h-4 text-right text-[0.8rem] text-primary-2">
          최신 등장 버전 : <b className="font-bold">{versionGroup?.nameKo}</b>
        </p>
      </footer>
    </section>
  )
}

export default LearnableSkillComponent
