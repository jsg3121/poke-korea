/**
 * 특성 설명 본문 (DS). "특성이란?" 접이식(details) 안에 들어가는 순수 본문이다.
 *
 * 구버전 AbilityDescription은 자체 외곽 껍데기(bg-primary-4·rounded·padding)와
 * 제목(<h2>특성이란?</h2>)을 포함해 details 껍데기와 배경·제목이 이중으로 겹친다.
 * 그래서 본문만 렌더하는 이 컴포넌트를 분리한다 — 배경·제목·padding은 details
 * summary가 담당한다(UX-007). 구버전 컴포넌트는 보존 원칙에 따라 손대지 않는다.
 *
 * 반응형은 모바일 퍼스트 base + desktop: 2단만(md:/lg: 제거). 색은 토큰만 사용한다.
 */

const AbilityDescriptionBodyComponent = () => {
  return (
    <div className="space-y-4 px-6 pb-4 text-sm text-primary-1">
      <p>
        <strong>특성(Ability)</strong>은 3세대에서부터 추가된 포켓몬 각각의
        고유한 능력을 뜻해요. 별도 기술 발동이나 특별한 행동을 하지 않아도
        자동으로 발동됩니다.
      </p>

      <div className="rounded-lg bg-primary-3 p-4">
        <p className="mb-2 font-semibold">주요 특징</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>모든 포켓몬에게 최소 1개의 특성이 주어져 있습니다</li>
          <li>
            대부분 포켓몬 배틀에 영향을 주지만, 배틀과 무관한 특성도 존재합니다
          </li>
          <li>종족치가 낮아도 우수한 특성으로 강해질 수 있습니다</li>
        </ul>
      </div>

      <div>
        <h4 className="mb-2 text-base font-semibold">특성의 종류</h4>
        <dl className="space-y-2 desktop:space-y-3">
          <dt className="pl-3 font-semibold">일반 특성</dt>
          <dd className="pl-3 text-primary-2">
            4세대까지는 포켓몬당 최대 2개의 특성을 가질 수 있었습니다. 야생
            포켓몬이나 알에서 태어날 때 1/2 확률로 특성이 정해집니다.
          </dd>
          <dt className="pl-3 font-semibold">숨겨진 특성</dt>
          <dd className="pl-3 text-primary-2">
            5세대부터 추가되어 포켓몬 한 종류당 최대 3개의 특성을 가지게
            되었습니다. 일반적인 포획이나 교배로는 얻을 수 없으며, 특수한
            방법(맥스 레이드 배틀, 프렌드 사파리 등)으로만 얻을 수 있습니다.
          </dd>
        </dl>
      </div>

      <p className="rounded-lg border border-solid border-primary-3 bg-white-3 p-4 text-xs text-primary-2">
        <strong className="font-semibold text-primary-1">참고:</strong> 레츠고!
        피카츄·레츠고! 이브이와 LEGENDS 아르세우스에서는 특성 시스템이 존재하지
        않습니다.
      </p>
    </div>
  )
}

export default AbilityDescriptionBodyComponent
