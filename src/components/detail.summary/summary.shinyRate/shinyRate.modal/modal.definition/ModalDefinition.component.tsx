const ModalDefinitionComponent = () => {
  return (
    <section aria-label="이로치 확률표 용어 설명" className="w-full">
      <dl className="w-full flex flex-col">
        <dt className="w-full min-h-5 text-base leading-5 text-left text-primary-1 my-2 mb-1">
          국제 교배
        </dt>
        <dd className="w-full min-h-4 text-xs leading-4 text-left text-primary-2">
          서로 다른 국가 언어로 된 포켓몬 끼리 교배하는 것으로, 알에서 이로치가
          나올 확률이 상승합니다.
        </dd>
        <dd className="w-full min-h-4 text-xs leading-4 text-left text-primary-2">
          4세대(DP/PT)부터 추가되었으며, 세대별로 배율이 조금씩 다릅니다.
        </dd>
        <dt className="w-full min-h-5 text-base leading-5 text-left text-primary-1 my-2 mb-1">
          빛나는 부적
        </dt>
        <dd className="w-full min-h-4 text-xs leading-4 text-left text-primary-2">
          5세대(B2W2) 이후 추가된 도구 입니다.
        </dd>
        <dd className="w-full min-h-4 text-xs leading-4 text-left text-primary-2">
          빛나는 부적을 획득하면 이로치 출현 확률을 더 높여줍니다.
        </dd>
      </dl>
    </section>
  )
}

export default ModalDefinitionComponent
