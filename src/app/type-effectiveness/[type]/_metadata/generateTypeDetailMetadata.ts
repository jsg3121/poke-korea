import { Metadata } from 'next'

import { TYPE_DETAIL_CONTENT } from '~/constants/typeDetailContent'
import { PokemonType } from '~/graphql/typeGenerated'
import { getRobotsConfig } from '~/modules/metadata.module'
import { buildTypeSlug, getTypeLabel } from '~/modules/typeParams.module'

const SITE_URL = 'https://poke-korea.com'
const SITE_NAME = '포케 코리아'
const OG_IMAGE_URL = `${SITE_URL}/assets/image/ogImage.png`

export const generateTypeDetailMetadata = (type: PokemonType): Metadata => {
  const label = getTypeLabel(type)
  const url = `${SITE_URL}/type-effectiveness/${buildTypeSlug(type)}`
  const content = TYPE_DETAIL_CONTENT[type]

  const title = `${label} 타입 약점과 상성`

  const description = content
    ? `${content.lead} ${label} 타입 포켓몬과 기술, 복합 타입 조합까지 한눈에 확인하세요.`
    : `${label} 타입의 약점과 상성을 확인하세요.`

  return {
    title,
    description,
    robots: getRobotsConfig(),
    openGraph: {
      type: 'website',
      url,
      title: `${title} - ${SITE_NAME}`,
      description,
      locale: 'ko_KR',
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: `${label} 타입 약점과 상성 - ${SITE_NAME}`,
          type: 'image/png',
        },
      ],
      siteName: SITE_NAME,
    },
    alternates: {
      canonical: url,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - ${SITE_NAME}`,
      description,
      images: [OG_IMAGE_URL],
    },
  }
}
