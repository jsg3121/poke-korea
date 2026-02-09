import { Metadata } from 'next'
import { PokemonType } from '~/graphql/typeGenerated'
import { getRobotsConfig } from '~/module/metadata.module'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import { getDamageTypeKorean } from '~/utils/skill.util'

interface MoveDetailBaseParams {
  skillId: number
  nameKo: string
  generation?: number
  description?: string | null
  type?: PokemonType | null
  power?: number | null
  accuracy?: number | null
  damageType?: string | null
}

const createMoveDetailMetadata = ({
  skillId,
  nameKo,
  generation,
  description: skillDescription,
  type: skillType,
  power,
  accuracy,
  damageType,
}: MoveDetailBaseParams): Metadata => {
  const moveType = `${skillType ? PokemonTypes[skillType] : '노말'} 타입`
  const damageTypeKo = getDamageTypeKorean(damageType)
  const genLabel = generation ? ` (${generation}세대)` : ''
  const genAltLabel = generation ? `${generation}세대 기술 도감` : '기술 도감'

  const title = `${nameKo}${genLabel} - ${[moveType, damageTypeKo].filter(Boolean).join(' ')} 기술 (위력 ${power || '-'} · 명중 ${accuracy || '-'}) | 포켓몬 기술 도감`
  const description = generation
    ? `${nameKo} ${generation}세대 기술 정보${skillDescription ? `: ${skillDescription}` : ''} | 타입: ${skillType || '없음'}, 위력: ${power || '-'}, 명중률: ${accuracy || '-'}. 세대별 변경사항과 배울 수 있는 포켓몬 목록을 확인하세요.`
    : `${nameKo}${skillDescription ? `: ${skillDescription}` : ''} | 타입: ${skillType || '없음'}, 위력: ${power || '-'}, 명중률: ${accuracy || '-'}. 세대별 변경사항과 배울 수 있는 포켓몬 목록을 확인하세요.`

  const canonicalUrl = generation
    ? `https://poke-korea.com/moves/${skillId}/generation/${generation}`
    : `https://poke-korea.com/moves/${skillId}`

  return {
    title,
    description,
    robots: getRobotsConfig(),
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      locale: 'ko_KR',
      images: [
        {
          url: 'https://poke-korea.com/assets/image/ogImage.png',
          width: 1200,
          height: 630,
          alt: `${nameKo} - ${genAltLabel}`,
          type: 'image/png',
        },
      ],
      siteName: '포케 코리아',
    },
    alternates: {
      canonical: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://poke-korea.com/assets/image/ogImage.png'],
    },
  }
}

export const generateMoveDetailMetadata = (
  params: Omit<MoveDetailBaseParams, 'generation'>,
): Metadata => createMoveDetailMetadata(params)

export const generateMoveDetailGenerationMetadata = (
  params: Required<Pick<MoveDetailBaseParams, 'generation'>> &
    Omit<MoveDetailBaseParams, 'generation'>,
): Metadata => createMoveDetailMetadata(params)
