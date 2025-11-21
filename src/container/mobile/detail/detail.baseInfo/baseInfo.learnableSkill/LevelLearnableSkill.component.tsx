import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import ImageComponent from '~/components/Image.component'
import { DetailContext } from '~/context/Detail.context'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'

const LevelLearnableSkillComponent = () => {
  const { pokemonId } = useParams()
  const searchParams = useSearchParams()
  const { activeTypeInfo } = useContext(DetailContext)

  const activeType = searchParams.get('activeType')
  const activeIndex = searchParams.get('activeIndex') ?? '0'
  const levelUpSkills = activeTypeInfo.learnableSkills?.levelUpSkills
  const versionGroup = activeTypeInfo?.versionGroupInfo

  return (
    <section
      aria-labelledby="pokemon-learnable-skill"
      className="w-full h-[27rem] bg-primary-4 border-[3px] border-solid border-primary-1 rounded-2xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4"
    >
      <InfoCardTitleComponent
        title="레벨업 습득 기술 정보"
        id="pokemon-learnable-skill"
      />
      <div className="w-full h-14 flex flex-col gap-2 items-baseline border-b border-solid border-primary-3">
        <p>
          최신 :{' '}
          <b className="font-bold">
            {versionGroup?.levelUpSkillVersion?.nameKo}
          </b>
        </p>
        <Link
          href={{
            pathname: `/detail/${pokemonId}/moves`,
            query: {
              ...(activeType && {
                activeType,
              }),
              ...(activeIndex &&
                activeIndex !== '0' && {
                  activeIndex: parseInt(activeIndex, 10),
                }),
            },
          }}
          className="text-[0.8rem] h-5 bg-primary-2 leading-[calc(1.25rem+2px)] px-3 text-primary-4 rounded-[0.375rem]"
        >
          더 많은 기술 보기
        </Link>
      </div>
      <div className="w-full h-[calc(100%-7.75rem)] overflow-y-auto">
        <div
          className="w-full h-8 flex align-center bg-primary-2 sticky top-0 z-10"
          aria-hidden
        >
          <p className="w-[10%] h-8 leading-8 text-primary-4 text-center">
            레벨
          </p>
          <p className="w-[38%] h-8 leading-8 text-primary-4 text-center">
            기술명
          </p>
          <p className="w-[10%] h-8 leading-8 text-primary-4 text-center">
            타입
          </p>
          <p className="w-[10%] h-8 leading-8 text-primary-4 text-center">
            위력
          </p>
          <p className="w-[12%] h-8 leading-8 text-primary-4 text-center">
            명중
          </p>
          <p className="w-[10%] h-8 leading-8 text-primary-4 text-center">PP</p>
          <p className="w-[10%] h-8 leading-8 text-primary-4 text-center">
            유형
          </p>
        </div>
        <table className="w-full h-fit table-fixed">
          <colgroup>
            <col width="10%" />
            <col width="38%" />
            <col width="10%" />
            <col width="10%" />
            <col width="12%" />
            <col width="10%" />
            <col width="10%" />
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
                    className="h-8 [&>td]:align-middle [&>td]: text-[0.875rem]"
                  >
                    <td className="text-center">
                      {level === 0 ? '진화' : level === 1 ? '최초' : level}
                    </td>
                    <td>{skill.name}</td>
                    <td className="justify-items-center">
                      <ImageComponent
                        alt={`${levelUpSkill.skill.type.toLowerCase()} 타입 필터 선택`}
                        height="1rem"
                        width="1rem"
                        src={`/assets/type/${levelUpSkill.skill.type.toLowerCase()}.svg`}
                        loading="lazy"
                      />
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

export default LevelLearnableSkillComponent
