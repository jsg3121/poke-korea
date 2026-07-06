import Link from 'next/link'
import { ReactNode } from 'react'

/**
 * 허브 링크 카드 (DS). 아이콘 + 제목 + 한 줄 설명을 담아 콘텐츠 허브(도감·타입상성·
 * 기술·특성·퀴즈·챔피언스 등)로 이동하는 타일형 링크.
 *
 * LinkButton(텍스트 CTA)과 역할이 다르다 — 이건 카테고리 진입용 "타일"로, 서술형
 * 앵커 텍스트(제목+설명)를 담아 홈의 내부 링크 허브 블록을 구성한다(RES-001 시사점 2,
 * Bulbapedia 아이콘 타일 패턴). 그리드 배치(2열/3열)는 부모 책임.
 *
 * 표면은 bg-primary-2가 아니라 **bg-primary-1 + primary-2 테두리**를 쓴다 — 설명
 * 텍스트(primary-3)가 primary-2 배경 위에선 대비 2.6:1로 WCAG AA(4.5:1) 미달이지만,
 * primary-1 배경 위에선 5.5:1로 통과한다(제목 primary-4는 9.7:1). 테두리는 페이지
 * 배경(primary-1)과의 경계 확보용 — primary CTA의 테두리 언어와 통일.
 *
 * 아이콘은 ReactNode 슬롯 — MobileTabBar가 쓰는 SVGR 아이콘(pokeball 등)을 그대로
 * 주입한다(currentColor 상속, 래퍼가 32px 크기와 색을 규격화). 타일 전체가 클릭
 * 영역이라 터치 타겟(44px)을 크게 상회한다.
 */

interface HubLinkCardProps {
  href: string
  /** 카테고리 제목 (예: '포켓몬 도감') */
  title: string
  /** 한 줄 서술형 설명 — 링크 앵커 텍스트의 일부가 된다 (예: '1025마리 포켓몬 정보 보기') */
  description: string
  /** SVGR 아이콘 컴포넌트 (예: <PokeballIcon />) — 크기·색은 카드가 규격화 */
  icon: ReactNode
}

const HubLinkCardComponent = ({
  href,
  title,
  description,
  icon,
}: HubLinkCardProps) => {
  return (
    <Link
      href={href}
      className="flex flex-col gap-2 rounded-2xl border border-solid border-primary-2 bg-primary-1 p-4 transition-colors hover:border-primary-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
    >
      <span
        aria-hidden="true"
        className="text-primary-4 [&>svg]:h-8 [&>svg]:w-8"
      >
        {icon}
      </span>
      <span className="text-base font-bold text-primary-4 desktop:text-lg">
        {title}
      </span>
      <span className="text-sm text-primary-3 break-keep">{description}</span>
    </Link>
  )
}

export default HubLinkCardComponent
