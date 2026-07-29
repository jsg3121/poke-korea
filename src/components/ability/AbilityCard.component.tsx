import Link from 'next/link'
import { AbilityInfoFragment } from '~/graphql/typeGenerated'

/**
 * 특성 카드 (DS). 특성 도감 목록의 특성 항목 하나를 표시한다.
 *
 * 특성은 이미지가 없는 텍스트 도메인이라 포켓몬 카드(이미지+타입+스탯) 셸이 아니라
 * 기술 카드·HubLinkCard·QuizCard와 같은 "밝은 배경(primary-4) + 진한 텍스트" 카드
 * 문법을 공유한다. 위계는 색이 아니라 굵기·크기로 구분한다.
 *
 * 반응형은 모바일 퍼스트 base + desktop: 2단만 쓴다(md:/lg: 금지). 제목은 모바일
 * text-lg → 데스크톱 text-xl로 줄여 좁은 화면에서 긴 특성명이 넘치지 않게 한다.
 * 하단 "보러가기" 보조 텍스트는 카드 하단에 절대배치하고, min-h-40으로 자리를 예약한다.
 */

interface AbilityCardComponentProps {
  abilityData: AbilityInfoFragment
}

const AbilityCardComponent = ({ abilityData }: AbilityCardComponentProps) => {
  return (
    <Link
      href={`/ability/${abilityData.abilityId}`}
      className="block w-full"
      aria-label={`${abilityData.name} 특성 상세보기`}
    >
      <article className="w-full min-h-40 bg-primary-4 border-2 border-solid border-primary-1 rounded-xl shadow-[0_0_0_3px_var(--color-primary-4)] p-3 pb-10 relative transition-transform duration-150 desktop:hover:-translate-y-0.5">
        <header className="mb-3 pb-1 border-b border-solid border-primary-1">
          <h3 className="text-lg desktop:text-xl font-bold text-gray-900 leading-tight">
            <span className="text-sm font-normal text-primary-2">
              {abilityData.abilityId}.
            </span>
            &nbsp;
            {abilityData.name}
          </h3>
        </header>
        <p className="text-base text-primary-1 leading-relaxed">
          {abilityData.description}
        </p>
        {abilityData.pokemonCount !== null &&
          abilityData.pokemonCount !== undefined && (
            <p className="absolute bottom-3 left-3 text-sm desktop:text-xs text-primary-2 font-semibold">
              해당 특성을 가진 포켓몬 보러가기 &gt;
            </p>
          )}
      </article>
    </Link>
  )
}

export default AbilityCardComponent
