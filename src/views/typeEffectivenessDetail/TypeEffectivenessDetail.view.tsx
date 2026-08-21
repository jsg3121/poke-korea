import { TYPE_DETAIL_CONTENT } from '~/constants/typeDetailContent'
import { PokemonType } from '~/graphql/typeGenerated'
import { getTypeLabel } from '~/module/typeParams.module'

/**
 * 타입별 상성 상세 뷰 — 반응형 단일(ADR-0007).
 *
 * 섹션 구성은 시안(`public/preview/type-effectiveness-detail-preview.html`)을
 * 따른다. 검색 유입 사용자가 폴드 안에서 약점을 즉답으로 받는 것이 최우선이라,
 * 광고는 폴드에 두지 않고 4배 약점 블록 뒤로 보낸다.
 *
 * 서버 컴포넌트다 — 상성 데이터가 전부 정적 상수라 클라이언트 경계가 필요 없다.
 * FAQ 아코디언만 네이티브 `<details>`를 써서 JS 없이 동작시킨다(접힌 본문도
 * DOM에 남아 크롤러가 읽는다).
 */

interface TypeEffectivenessDetailViewProps {
  pokemonType: PokemonType
}

const TypeEffectivenessDetailView = ({
  pokemonType,
}: TypeEffectivenessDetailViewProps) => {
  const label = getTypeLabel(pokemonType)
  const content = TYPE_DETAIL_CONTENT[pokemonType]

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 pb-8">
      <h1 className="text-2xl desktop:text-4xl font-bold text-primary-4 leading-tight">
        {label} 타입 약점과 상성
      </h1>
      {content && (
        <p className="mt-2 text-base text-primary-3 leading-relaxed">
          {content.lead}
        </p>
      )}
    </section>
  )
}

export default TypeEffectivenessDetailView
