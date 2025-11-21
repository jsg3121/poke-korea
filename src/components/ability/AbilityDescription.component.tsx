const AbilityDescriptionComponent = () => {
  return (
    <section className="w-[calc(100%-2.5rem)] mx-auto bg-primary-4 rounded-2xl p-6 mb-6">
      <h2 className="text-2xl font-bold text-primary-1 mb-4 border-b border-solid border-primary-1">
        특성이란?
      </h2>
      <div className="space-y-4">
        <p>
          <strong className="text-primary-1">특성(Ability)</strong>은
          3세대에서부터 추가된 포켓몬 각각의 고유한 능력을 뜻해요. 별도 기술
          발동이나 특별한 행동을 하지 않아도 자동으로 발동됩니다.
        </p>
        <div className="bg-primary-3 p-4 rounded">
          <p className="font-semibold text-primary-1 mb-2">주요 특징</p>
          <ul className="list-none list-inside space-y-1 text-primary-1 lg:list-disc ">
            <li className="mb-1 md:mb-0">
              모든 포켓몬에게 최소 1개의 특성이 주어져 있습니다
            </li>
            <li className="mb-1 md:mb-0">
              대부분 포켓몬 배틀에 영향을 주지만, 배틀과 무관한 특성도
              존재합니다
            </li>
            <li className="mb-1 md:mb-0">
              종족치가 낮아도 우수한 특성으로 강해질 수 있습니다
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary-1 mb-1 md:mb-2">
            특성의 종류
          </h3>
          <dl className="space-y-2 md:space-y-3">
            <dt className="pl-3 font-semibold text-primary-1">일반 특성</dt>
            <dd className="pl-3 text-gray-600">
              4세대까지는 포켓몬당 최대 2개의 특성을 가질 수 있었습니다. 야생
              포켓몬이나 알에서 태어날 때 1/2 확률로 특성이 정해집니다.
            </dd>
            <dt className="pl-3 font-semibold text-primary-1">숨겨진 특성</dt>
            <dd className="pl-3 text-gray-600">
              5세대부터 추가되어 포켓몬 한 종류당 최대 3개의 특성을 가지게
              되었습니다. 일반적인 포획이나 교배로는 얻을 수 없으며, 특수한
              방법(맥스 레이드 배틀, 프렌드 사파리 등)으로만 얻을 수 있습니다.
            </dd>
          </dl>
        </div>
        <div className="bg-gray-50 border p-4 rounded">
          <p className="text-sm text-gray-600">
            <strong className="text-primary-1 font-semibold">참고:</strong>{' '}
            레츠고! 피카츄·레츠고! 이브이와 LEGENDS 아르세우스에서는 특성
            시스템이 존재하지 않습니다.
          </p>
        </div>
      </div>
    </section>
  )
}

export default AbilityDescriptionComponent
