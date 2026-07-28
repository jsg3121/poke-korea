import { Metadata } from 'next'
import { getRobotsConfig } from '~/module/metadata.module'

const SITE_NAME = '포케 코리아'
const SITE_URL = 'https://poke-korea.com'
const OG_IMAGE_URL = `${SITE_URL}/assets/image/ogImage.png`

/** 공통 메타데이터 생성 헬퍼 */
export const createMetadata = (
  title: string,
  description: string,
  path: string,
  imageAlt: string,
): Metadata => ({
  // title 필드는 접미사 없이 페이지명만 전달한다. 루트 layout의
  // title.template('%s | 포케 코리아')이 브랜드 접미사를 자동으로 붙인다.
  // og/twitter title은 template 적용 대상이 아니므로 브랜드를 명시적으로 재부착한다.
  title,
  description,
  robots: getRobotsConfig(),
  openGraph: {
    type: 'website',
    url: `${SITE_URL}${path}`,
    title: `${title} - ${SITE_NAME}`,
    description,
    locale: 'ko_KR',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: imageAlt,
        type: 'image/png',
      },
    ],
    siteName: SITE_NAME,
  },
  alternates: {
    canonical: `${SITE_URL}${path}`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} - ${SITE_NAME}`,
    description,
    images: [OG_IMAGE_URL],
  },
})
