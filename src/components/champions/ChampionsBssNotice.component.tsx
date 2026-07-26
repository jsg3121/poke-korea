/**
 * 대회 페이지 상단 BSS 안내 배너.
 *
 * Why: BSS 검색 유입 사용자에게 현재 VGC 대회만 노출되는 맥락을 즉시 전달.
 *      "데이터 없음" 사실은 항상 노출되어야 하므로 닫기 미제공.
 *
 * 다크 배경(primary-1) 위에서 미드톤 배너는 카드(밝은 primary-4)와 명도 단차가 3단이
 * 되어 그룹 경계가 흐려진다(UX-011). 카드와 같은 밝은 배경 톤으로 통일한다.
 */
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
