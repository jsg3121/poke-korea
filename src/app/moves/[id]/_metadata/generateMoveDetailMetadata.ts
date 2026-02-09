import { Metadata } from 'next'
import { PokemonType } from '~/graphql/typeGenerated'
import { getRobotsConfig } from '~/module/metadata.module'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import { getDamageTypeKorean } from '~/utils/skill.util'

interface MoveDetailMetadataParams {
  skillId: number
  nameKo: string
  description?: string | null
  type?: PokemonType | null
  power?: number | null
  accuracy?: number | null
  damageType?: string | null
}

export const generateMoveDetailMetadata = ({
  skillId,
  nameKo,
  description: skillDescription,
  type: skillType,
  power,
  accuracy,
  damageType,
}: MoveDetailMetadataParams): Metadata => {
  const moveType = `${skillType ? PokemonTypes[skillType] : '노말'} 타입`
  const damageTypeKo = getDamageTypeKorean(damageType)
  const title = `${nameKo} - ${[moveType, damageTypeKo].filter(Boolean).join(' ')} 기술 (위력 ${power || '-'} · 명중 ${accuracy || '-'}) | 포켓몬 기술 도감`
  const description = `${nameKo}${skillDescription ? `: ${skillDescription}` : ''} | 타입: ${skillType || '없음'}, 위력: ${power || '-'}, 명중률: ${accuracy || '-'}. 세대별 변경사항과 배울 수 있는 포켓몬 목록을 확인하세요.`

  return {
    title,
    description,
    robots: getRobotsConfig(),
    openGraph: {
      type: 'website',
      url: `https://poke-korea.com/moves/${skillId}`,
      title,
      description,
      locale: 'ko_KR',
      images: [
        {
          url: 'https://poke-korea.com/assets/image/ogImage.png',
          width: 1200,
          height: 630,
          alt: `${nameKo} - 기술 도감`,
          type: 'image/png',
        },
      ],
      siteName: '포케 코리아',
    },
    alternates: {
      canonical: `https://poke-korea.com/moves/${skillId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://poke-korea.com/assets/image/ogImage.png'],
    },
  }
}

interface MoveDetailGenerationMetadataParams {
  skillId: number
  nameKo: string
  generation: number
  description?: string | null
  type?: PokemonType | null
  power?: number | null
  accuracy?: number | null
  damageType?: string | null
}

export const generateMoveDetailGenerationMetadata = ({
  skillId,
  nameKo,
  generation,
  description: generationDescription,
  type: skillType,
  power,
  accuracy,
  damageType,
}: MoveDetailGenerationMetadataParams): Metadata => {
  const moveType = `${skillType ? PokemonTypes[skillType] : '노말'} 타입`
  const damageTypeKo = getDamageTypeKorean(damageType)
  const title = `${nameKo} (${generation}세대) - ${[moveType, damageTypeKo].filter(Boolean).join(' ')} 기술 (위력 ${power || '-'} · 명중 ${accuracy || '-'}) | 포켓몬 기술 도감`
  const description = `${nameKo} ${generation}세대 기술 정보${generationDescription ? `: ${generationDescription}` : ''} | 타입: ${skillType || '없음'}, 위력: ${power || '-'}, 명중률: ${accuracy || '-'}. 세대별 변경사항과 배울 수 있는 포켓몬 목록을 확인하세요.`

  return {
    title,
    description,
    robots: getRobotsConfig(),
    openGraph: {
      type: 'website',
      url: `https://poke-korea.com/moves/${skillId}/generation/${generation}`,
      title,
      description,
      locale: 'ko_KR',
      images: [
        {
          url: 'https://poke-korea.com/assets/image/ogImage.png',
          width: 1200,
          height: 630,
          alt: `${nameKo} - ${generation}세대 기술 도감`,
          type: 'image/png',
        },
      ],
      siteName: '포케 코리아',
    },
    alternates: {
      canonical: `https://poke-korea.com/moves/${skillId}/generation/${generation}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://poke-korea.com/assets/image/ogImage.png'],
    },
  }
}
