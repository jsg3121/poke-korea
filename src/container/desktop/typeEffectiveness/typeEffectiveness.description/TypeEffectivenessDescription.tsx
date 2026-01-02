const TypeEffectivenessDescription = () => {
  return (
    <section
      aria-labelledby="type-effectiveness-description"
      className="w-full h-fit pt-4"
    >
      <h3
        id="type-effectiveness-description"
        className="w-full h-12 text-[1.75rem] leading-[2rem] font-medium text-left text-primary-4 border-b border-solid border-primary-4 pb-4 mb-4"
      >
        타입별 추가 효과
      </h3>
      <ul className="w-full pl-5 list-disc flex flex-col gap-4">
        <li className="w-full min-h-5 text-primary-4">
          <strong className="w-full h-full text-xl text-left text-aligned-xs text-primary-4">
            <b className="type-color-normal">포켓몬의 타입</b>과&nbsp;
            <b className="type-color-normal">기술의 타입</b>이 일치하면 기술의
            위력이 1.5배가 돼요.
          </strong>
        </li>
        <li className="w-full min-h-5 text-primary-4">
          <strong className="w-full h-full text-xl text-left text-aligned-xs text-primary-4">
            <b className="type-color-fire">불꽃 타입</b>의 포켓몬은 화상 상태가
            되지 않아요.
          </strong>
        </li>
        <li className="w-full min-h-5 text-primary-4">
          <strong className="w-full h-full text-xl text-left text-aligned-xs text-primary-4">
            <b className="type-color-grass">풀 타입</b>의 포켓몬은 씨뿌리기,
            독가루, 저리가루, 수면가루,버섯포자 기술의 효과를 받지 않아요.
          </strong>
        </li>
        <li className="w-full min-h-5 text-primary-4">
          <strong className="w-full h-full text-xl text-left text-aligned-xs text-primary-4">
            <b className="type-color-electric">전기 타입</b>의 포켓몬은 마비
            상태가 되지 않아요.
          </strong>
        </li>
        <li className="w-full min-h-5 text-primary-4">
          <strong className="w-full h-full text-xl text-left text-aligned-xs text-primary-4">
            <b className="type-color-ice">얼음 타입</b>의 포켓몬은 싸라기눈
            기술의 데미지를 받지 않고, 얼음 상태가 되지 않아요.
          </strong>
        </li>
        <li className="w-full min-h-5 text-primary-4">
          <strong className="w-full h-full text-xl text-left text-aligned-xs text-primary-4">
            <b className="type-color-poison">독 타입</b>의 포켓몬은 독, 맹독
            상태가 되지 않아요.
          </strong>
        </li>
        <li className="w-full min-h-5 text-primary-4">
          <strong className="w-full h-full text-xl text-left text-aligned-xs text-primary-4">
            <b className="type-color-flying">비행 타입</b>을 가지지 않았거나,
            부유 특성이 없는 독 타입 포켓몬은 교체했을 때 주위에 뿌려진 독압정을
            제거 해줘요.
          </strong>
        </li>
        <li className="w-full min-h-5 text-primary-4">
          <strong className="w-full h-full text-xl text-left text-aligned-xs text-primary-4">
            <b className="type-color-flying">비행 타입</b>의 포켓몬은
            압정뿌리기의 데미지를 받지 않고, 독압정을 통한 독, 맹독 상태가 되지
            않아요.
          </strong>
        </li>
        <li className="w-full min-h-5 text-primary-4">
          <strong className="w-full h-full text-xl text-left text-aligned-xs text-primary-4">
            <b className="type-color-ground">땅 타입</b>의 포켓몬은 전기자석파의
            효과를 받지 않고, 모래바람의 데미지를 받지 않아요.
          </strong>
        </li>
        <li className="w-full min-h-5 text-primary-4">
          <strong className="w-full h-full text-xl text-left text-aligned-xs text-primary-4">
            <b className="type-color-rock">바위 타입</b>의 포켓몬은 모래바람이
            불 때, 특수방어가 상승하고, 지속 데미지를 받지 않아요.
          </strong>
        </li>
        <li className="w-full min-h-5 text-primary-4">
          <strong className="w-full h-full text-xl text-left text-aligned-xs text-primary-4">
            <b className="type-color-ghost">고스트 타입</b>의 포켓몬은 상대를
            도망치게 할 수 없는 기술의 효과를 받지 않아요.
          </strong>
        </li>
        <li className="w-full min-h-5 text-primary-4">
          <strong className="w-full h-full text-xl text-left text-aligned-xs text-primary-4">
            <b className="type-color-steel">강철 타입</b>의 포켓몬은 모래바람의
            데미지, 독, 맹독 상태 면역을 가지고 있어요.
          </strong>
        </li>
      </ul>
    </section>
  )
}

export default TypeEffectivenessDescription
