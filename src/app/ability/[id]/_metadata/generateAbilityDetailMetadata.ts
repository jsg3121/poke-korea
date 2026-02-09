import { Metadata } from 'next'
import { getRobotsConfig } from '~/module/metadata.module'

interface AbilityDetailMetadataParams {
  abilityId: number
  abilityName: string
  abilityDescription: string
}

export const generateAbilityDetailMetadata = ({
  abilityId,
  abilityName,
  abilityDescription,
}: AbilityDetailMetadataParams): Metadata => {
  const title = `포켓몬 ${abilityName} 특성 정보 - 포케 코리아`
  const description = `${abilityName}: ${abilityDescription} | 이 특성을 가진 포켓몬은 누구일까요?`

  return {
    title,
    description,
    robots: getRobotsConfig(),
    openGraph: {
      type: 'website',
      url: `https://poke-korea.com/ability/${abilityId}`,
      title,
      description,
      locale: 'ko_KR',
      images: [
        {
          url: 'https://poke-korea.com/assets/image/ogImage.png',
          width: 1200,
          height: 630,
          alt: `${abilityName} - 특성 도감`,
          type: 'image/png',
        },
      ],
      siteName: '포케 코리아',
    },
    alternates: {
      canonical: `https://poke-korea.com/ability/${abilityId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: `${abilityName}: ${abilityDescription}`,
      images: ['https://poke-korea.com/assets/image/ogImage.png'],
    },
  }
}
