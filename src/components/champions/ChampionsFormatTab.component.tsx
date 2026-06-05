'use client'

import Link from 'next/link'
import {
  ChampionsFormatSlug,
  CHAMPIONS_FORMAT_SLUGS,
  getFormatLabel,
} from '~/utils/championsFormat.util'

interface ChampionsFormatTabProps {
  /** 현재 활성 포맷 슬러그 */
  currentFormat: ChampionsFormatSlug
  /** 탭 클릭 시 이동할 base path. format slug가 뒤에 붙는다. */
  basePath: string
  /** 포맷 슬러그 뒤에 추가로 붙일 경로. 예: '/list' → '/champions/vgc/list' */
  suffix?: string
  /** 추가 className (외곽 컨테이너 폭/마진 조정용) */
  className?: string
}

const ChampionsFormatTab = ({
  currentFormat,
  basePath,
  suffix = '',
  className = '',
}: ChampionsFormatTabProps) => {
  return (
    <nav aria-label="포맷 선택" className={`w-full ${className}`}>
      <ul className="flex items-center gap-2 flex-wrap">
        {CHAMPIONS_FORMAT_SLUGS.map((slug) => {
          const isActive = slug === currentFormat
          const href = `${basePath}/${slug}${suffix}`
          const label = getFormatLabel(slug)

          return (
            <li key={slug}>
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                title={label}
                className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold transition-colors duration-200 border-2 ${
                  isActive
                    ? 'bg-primary-1 text-white border-primary-1'
                    : 'bg-primary-4 text-primary-1 border-primary-1 hover:bg-primary-3'
                }`}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default ChampionsFormatTab
