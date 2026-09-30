import { Metadata } from 'next'

import { getRobotsConfig } from '~/modules/metadata.module'

const SITE_NAME = '포케 코리아'
const SITE_URL = 'https://poke-korea.com'
const OG_IMAGE_URL = `${SITE_URL}/assets/image/ogImage.png`

export const createMetadata = (
  title: string,
  description: string,
  path: string,
  imageAlt: string,
): Metadata => ({
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
