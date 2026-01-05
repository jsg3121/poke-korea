import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import ImageComponent from '~/components/Image.component'
import { DetailContext } from '~/context/Detail.context'
import { getDamageTypeKorean } from '~/utils/skill.util'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'

const MachineLearnableSkillComponent = () => {
  const { pokemonId } = useParams()
  const searchParams = useSearchParams()
  const { activeTypeInfo } = useContext(DetailContext)

  const activeType = searchParams.get('activeType')
  const activeIndex = searchParams.get('activeIndex') ?? '0'
  const machineSkills = activeTypeInfo?.learnableSkills?.machineSkills
  const versionGroup = activeTypeInfo?.versionGroupInfo

  return (
    <section
      aria-labelledby="pokemon-machine-learnable-skill"
      className="card-detail w-full h-[27rem]"
    >
      <InfoCardTitleComponent
        title="기술/비전 머신 습득 기술 정보"
        id="pokemon-machine-learnable-skill"
      />
      <div className="w-full h-14 flex flex-col gap-2 items-baseline border-b border-solid border-primary-3">
        <p>
          최신 :{' '}
          <b className="font-bold">
            {versionGroup?.machineSkillVersion?.nameKo}
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
              movesType: 'MACHINE',
            },
          }}
          className="text-[0.8rem] h-5 bg-primary-2 text-aligned-xs px-3 text-primary-4 rounded-[0.375rem]"
        >
          모든 세대 기술 보러가기
        </Link>
      </div>
      <div className="w-full h-[calc(100%-7.75rem)]  overflow-y-auto">
        <div
          className="w-full h-8 flex align-center bg-primary-2 sticky top-0 z-10"
          aria-hidden
        >
          <p className="w-[47%] h-8 leading-8 text-primary-4 text-center">
            기술명
          </p>
          <p className="w-[10%] h-8 leading-8 text-primary-4 text-center">
            타입
          </p>
          <p className="w-[10%] h-8 leading-8 text-primary-4 text-center">
            위력
          </p>
          <p className="w-[13%] h-8 leading-8 text-primary-4 text-center">
            명중률
          </p>
          <p className="w-[10%] h-8 leading-8 text-primary-4 text-center">PP</p>
          <p className="w-[10%] h-8 leading-8 text-primary-4 text-center">
            유형
          </p>
        </div>
        <table className="w-full h-fit table-fixed">
          <colgroup>
            <col width="47%" />
            <col width="10%" />
            <col width="10%" />
            <col width="13%" />
            <col width="10%" />
            <col width="10%" />
          </colgroup>
          <thead className="sr-only">
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
                    className="h-8 [&>td]:align-middle text-sm"
                  >
                    <td>{skill.nameKo}</td>
                    <td className="justify-items-center">
                      {skill.type && (
                        <ImageComponent
                          alt={`${skill.type.toLowerCase()} 타입 필터 선택`}
                          height="1rem"
                          width="1rem"
                          imageSize={{ width: 12, height: 12 }}
                          src={`/assets/type/${skill.type.toLowerCase()}.svg`}
                          loading="lazy"
                        />
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

export default MachineLearnableSkillComponent
