const AbilityDescriptionComponent = () => {
  return (
    <section className="w-full bg-white border-2 border-solid border-gray-300 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">특성이란?</h2>

      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          <strong className="text-gray-900">특성(영: Ability)</strong>은
          3세대에서부터 추가된 포켓몬 각각의 고유한 능력을 뜻합니다. 다른 RPG
          게임의 패시브 스킬처럼 작동하며, 행동하지 않아도 자동으로 발동되는
          능력입니다.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="font-semibold text-blue-900 mb-2">주요 특징</p>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>모든 포켓몬에게 최소 1개의 특성이 주어져 있습니다</li>
            <li>
              대부분 포켓몬 배틀에 영향을 주지만, 배틀과 무관한 특성도
              존재합니다
            </li>
            <li>종족치가 낮아도 우수한 특성으로 강해질 수 있습니다</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            특성의 종류
          </h3>
          <div className="space-y-3">
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-semibold text-gray-900">일반 특성</p>
              <p className="text-sm text-gray-600">
                4세대까지는 포켓몬당 최대 2개의 특성을 가질 수 있었습니다. 야생
                포켓몬이나 알에서 태어날 때 1/2 확률로 특성이 정해집니다.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="font-semibold text-gray-900">숨겨진 특성</p>
              <p className="text-sm text-gray-600">
                5세대부터 추가되어 포켓몬 한 종류당 최대 3개의 특성을 가지게
                되었습니다. 일반적인 포획이나 교배로는 얻을 수 없으며, 특수한
                방법(맥스 레이드 배틀, 프렌드 사파리 등)으로만 얻을 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-4 rounded">
          <p className="text-sm text-gray-600">
            <strong className="text-gray-900">참고:</strong> 레츠고!
            피카츄·레츠고! 이브이와 LEGENDS 아르세우스에서는 특성 시스템이
            존재하지 않습니다.
          </p>
        </div>
      </div>
    </section>
  )
}

export default AbilityDescriptionComponent
