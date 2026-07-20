/**
 * 타입별 추가 효과 설명 (반응형 단일 — UX-009). 구버전 데/모 2벌
 * typeEffectiveness.description을 대체한다 — 콘텐츠는 그대로, 임의값
 * (text-[1.75rem]·text-xl 고정)만 토큰 정합(text-base, ADR-0012)하고 제목을
 * h3→h2로 승격한다(페이지 h1 아래 섹션 위계 통일 — 계산기·결과·표와 동급).
 * 타입 색 강조(type-color-*)는 기존 전역 유틸 그대로 사용한다.
 */

const DESCRIPTION_ITEM_CLASS =
  'min-h-5 text-base text-primary-4 leading-relaxed'

const TypeEffectivenessDescriptionContainer = () => {
  return (
    <section
      aria-labelledby="type-effectiveness-description"
      className="w-full pt-8 desktop:pt-10"
    >
      <h2
        id="type-effectiveness-description"
        className="mb-4 border-b border-solid border-primary-4 pb-3 text-xl desktop:text-3xl font-semibold text-primary-4 leading-tight"
      >
        타입별 추가 효과
      </h2>
      <ul className="flex w-full list-disc flex-col gap-3 pl-5">
        <li className={DESCRIPTION_ITEM_CLASS}>
          <b className="type-color-normal">포켓몬의 타입</b>과&nbsp;
          <b className="type-color-normal">기술의 타입</b>이 일치하면 기술의
          위력이 1.5배가 돼요.
        </li>
        <li className={DESCRIPTION_ITEM_CLASS}>
          <b className="type-color-fire">불꽃 타입</b>의 포켓몬은 화상 상태가
          되지 않아요.
        </li>
        <li className={DESCRIPTION_ITEM_CLASS}>
          <b className="type-color-grass">풀 타입</b>의 포켓몬은 씨뿌리기,
          독가루, 저리가루, 수면가루, 버섯포자 기술의 효과를 받지 않아요.
        </li>
        <li className={DESCRIPTION_ITEM_CLASS}>
          <b className="type-color-electric">전기 타입</b>의 포켓몬은 마비
          상태가 되지 않아요.
        </li>
        <li className={DESCRIPTION_ITEM_CLASS}>
          <b className="type-color-ice">얼음 타입</b>의 포켓몬은 싸라기눈 기술의
          데미지를 받지 않고, 얼음 상태가 되지 않아요.
        </li>
        <li className={DESCRIPTION_ITEM_CLASS}>
          <b className="type-color-poison">독 타입</b>의 포켓몬은 독, 맹독
          상태가 되지 않아요.
        </li>
        <li className={DESCRIPTION_ITEM_CLASS}>
          <b className="type-color-flying">비행 타입</b>을 가지지 않았거나, 부유
          특성이 없는 독 타입 포켓몬은 교체했을 때 주위에 뿌려진 독압정을 제거
          해줘요.
        </li>
        <li className={DESCRIPTION_ITEM_CLASS}>
          <b className="type-color-flying">비행 타입</b>의 포켓몬은 압정뿌리기의
          데미지를 받지 않고, 독압정을 통한 독, 맹독 상태가 되지 않아요.
        </li>
        <li className={DESCRIPTION_ITEM_CLASS}>
          <b className="type-color-ground">땅 타입</b>의 포켓몬은 전기자석파의
          효과를 받지 않고, 모래바람의 데미지를 받지 않아요.
        </li>
        <li className={DESCRIPTION_ITEM_CLASS}>
          <b className="type-color-rock">바위 타입</b>의 포켓몬은 모래바람이 불
          때, 특수방어가 상승하고, 지속 데미지를 받지 않아요.
        </li>
        <li className={DESCRIPTION_ITEM_CLASS}>
          <b className="type-color-ghost">고스트 타입</b>의 포켓몬은 상대를
          도망치게 할 수 없는 기술의 효과를 받지 않아요.
        </li>
        <li className={DESCRIPTION_ITEM_CLASS}>
          <b className="type-color-steel">강철 타입</b>의 포켓몬은 모래바람의
          데미지, 독, 맹독 상태 면역을 가지고 있어요.
        </li>
      </ul>
    </section>
  )
}

export default TypeEffectivenessDescriptionContainer
