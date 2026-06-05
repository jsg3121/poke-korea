/**
 * 대회 페이지 상단 BSS 안내 배너.
 *
 * Why: BSS 검색 유입 사용자에게 현재 VGC 대회만 노출되는 맥락을 즉시 전달.
 *      "데이터 없음" 사실은 항상 노출되어야 하므로 닫기 미제공.
 */
const ChampionsBssNotice = () => {
  return (
    <div
      role="status"
      className="bg-primary-2 border-l-4 border-amber-400 text-primary-4 text-sm px-4 py-3 rounded mb-4"
    >
      현재 VGC 더블 대회 결과만 제공합니다.
    </div>
  )
}

export default ChampionsBssNotice
