const ChampionsBssNotice = () => {
  return (
    <div
      role="status"
      className="flex items-center gap-2 bg-primary-4 border border-solid border-primary-3 text-primary-1 text-xs font-semibold px-3.5 py-2.5 rounded-lg mb-4 desktop:text-sm"
    >
      <span
        aria-hidden="true"
        className="inline-flex shrink-0 items-center justify-center w-5 h-5 rounded-full bg-primary-1 text-primary-4 text-xs font-bold"
      >
        ⓘ
      </span>
      현재 VGC 더블 대회 결과만 제공합니다.
    </div>
  )
}

export default ChampionsBssNotice
