'use client'

import TabItem from '~/components/tab/TabItem.component'
import {
  ChampionsFormatSlug,
  CHAMPIONS_FORMAT_SLUGS,
  getFormatLabel,
} from '~/utils/championsFormat.util'

/**
 * 챔피언스 포맷 선택 탭 (organism). TabItem(fill) 원자를 배열로 조립한다.
 *
 * 기존 ChampionsFormatTab(인라인 알약 Link, border-2·rounded-full 임의 스타일)을
 * DS 규격으로 재구축한다 — 선택 항목을 배경 채움(fill)으로 표시하는 컨텐츠 전환 탭이라
 * TabItem의 fill variant가 정확히 맞는다. 색·모서리·터치타겟은 TabItem 규격을 따른다.
 *
 * 기존과 동일한 prop 인터페이스(currentFormat/basePath/suffix)를 유지해 페이지 개편 때
 * import만 바꿔 교체할 수 있게 한다. 도메인 로직(슬러그 목록·href 조합·라벨)은 organism이
 * 담당하고, 개별 탭의 시각/상태는 TabItem에 위임한다.
 */

interface ChampionsFormatTabProps {
  /** 현재 활성 포맷 슬러그 */
  currentFormat: ChampionsFormatSlug
  /** 탭 클릭 시 이동할 base path. format slug가 뒤에 붙는다. */
  basePath: string
  /** 포맷 슬러그 뒤에 추가로 붙일 경로. 예: '/list' → '/champions/vgc/list' */
  suffix?: string
}

const ChampionsFormatTabOrganism = ({
  currentFormat,
  basePath,
  suffix = '',
}: ChampionsFormatTabProps) => {
  return (
    <nav aria-label="포맷 선택" className="w-full">
      <ul className="flex flex-wrap items-center gap-2">
        {CHAMPIONS_FORMAT_SLUGS.map((slug) => (
          <li key={slug}>
            <TabItem
              variant="fill"
              href={`${basePath}/${slug}${suffix}`}
              active={slug === currentFormat}
            >
              {getFormatLabel(slug)}
            </TabItem>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default ChampionsFormatTabOrganism
