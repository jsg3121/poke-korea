import {
  PokemonDetail,
  PokemonGigantamax,
  PokemonMegaEvolution,
  PokemonNormalForm,
  PokemonRegionForm,
} from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import {
  getPokemonNameByType,
  getPokemonStats,
  getPokemonTypes,
  getSeoCanonicalUrl,
} from '~/module/generateDetailSeoMetaData'
import { TActiveType } from '~/types/detailContext.type'
import { PokemonTypes } from '~/types/pokemonTypes.types'

interface PokemonJsonLdProps {
  pokemonDetail: PokemonDetail
  activeType: TActiveType
  activeIndex: number
  isShiny: boolean
  normalForm?: PokemonNormalForm[]
  megaEvolutionData?: PokemonMegaEvolution[]
  regionFormData?: PokemonRegionForm[]
  gigantamaxData?: PokemonGigantamax[]
}

export const generatePokemonJsonLd = ({
  pokemonDetail,
  activeType,
  activeIndex,
  isShiny,
  normalForm,
  megaEvolutionData,
  regionFormData,
  gigantamaxData,
}: PokemonJsonLdProps) => {
  // 공통 함수들 사용
  const commonParams = {
    pokemonDetail,
    activeType,
    activeIndex,
    normalForm,
    megaEvolutionData,
    regionFormData,
  }

  const getImageList = () => {
    switch (activeType) {
      case 'mega': {
        const megaImages = megaEvolutionData?.map((mega, index) => {
          return {
            imageCode: parseInt(
              `1${mega.pokemonId.toString().padStart(3, '0')}${index
                ?.toString()
                .padStart(2, '0')}`,
              10,
            ),
          }
        })
        return megaImages
      }
      case 'region': {
        const regionImages = regionFormData?.map((region, index) => {
          return {
            imageCode: parseInt(
              `2${region.pokemonId.toString().padStart(3, '0')}${index
                ?.toString()
                .padStart(2, '0')}`,
              10,
            ),
          }
        })
        return regionImages
      }
      case 'gigantamax': {
        const gigantamaxImages = gigantamaxData?.map((gmax) => {
          return {
            imageCode: gmax.imagePath,
          }
        })
        return gigantamaxImages
      }
      default: {
        if (normalForm && normalForm.length > 0) {
          const nomalFormImages = normalForm?.map((form) => {
            return {
              imageCode: form.imagePath,
            }
          })
          return nomalFormImages
        } else {
          const pokemonData = {
            imageCode: pokemonDetail?.number,
          }
          return [pokemonData]
        }
      }
    }
  }

  const pokemonTypes = getPokemonTypes(commonParams)
  const stats = getPokemonStats(commonParams)

  const displayName = getPokemonNameByType({
    activeType,
    pokemonBaseInfoName: pokemonDetail.name,
    megaEvolutionName: megaEvolutionData?.[activeIndex]?.name || '',
    regionFormPlace: regionFormData?.[activeIndex]?.region || '',
    gigantamaxName: gigantamaxData?.[activeIndex]?.name || '',
    isShiny,
  })

  const canonicalUrl = getSeoCanonicalUrl({
    activeType,
    activeIndex,
    pokemonNumber: pokemonDetail.number,
    isShiny,
  })

  const getAbilities = () => {
    switch (activeType) {
      case 'mega': {
        return megaEvolutionData?.[activeIndex].megaEvolutionAbilityList ?? []
      }
      case 'region': {
        return regionFormData?.[activeIndex].regionFormAbilityList ?? []
      }
      case 'gigantamax': {
        // 거다이맥스는 별도 특성이 없으므로 기본 포켓몬 특성 사용
        return pokemonDetail.pokemonAbilityList
      }
      default: {
        return (
          normalForm?.[activeIndex]?.normalFormAbilityList ??
          pokemonDetail.pokemonAbilityList
        )
      }
    }
  }

  const typeList = pokemonTypes
    .map((type) => {
      return PokemonTypes[type]
    })
    .join(', ')

  const imageList = getImageList()

  const imageSrc = isShiny
    ? `${imageMode}/shiny/${imageList?.[activeIndex]?.imageCode}.webp`
    : `${imageMode}/${imageList?.[activeIndex]?.imageCode}.webp`

  const abilities = getAbilities()

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `No. ${pokemonDetail.number} ${displayName}`,
    description: `${displayName} 도감 번호 ${pokemonDetail.number}번 ${typeList} 타입의 포켓몬 ${pokemonDetail.generation}세대에 첫 등장.`,
    url: canonicalUrl,
    inLanguage: 'ko-KR',
    isPartOf: {
      '@type': 'WebSite',
      name: '포케 코리아',
      url: 'https://poke-korea.com',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '홈',
          item: 'https://poke-korea.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '포켓몬 도감',
          item: 'https://poke-korea.com/detail',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `No. ${pokemonDetail.number} ${displayName}`,
          item: canonicalUrl,
        },
      ],
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      '@id': `https://image.poke-korea.com/detail/${pokemonDetail.number}/opengraph-image#imgaeObject`,
      url: `https://image.poke-korea.com/detail/${pokemonDetail.number}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    image: imageSrc,
    mainEntity: {
      '@type': 'Thing',
      name: `No. ${pokemonDetail.number} ${displayName}`,
      description: `${displayName} 도감 번호 ${pokemonDetail.number}번 ${typeList} 타입의 포켓몬 ${pokemonDetail.generation}세대에 첫 등장.`,
      identifier: pokemonDetail.number.toString(),
      image: imageSrc,
      about: [
        {
          '@type': 'Thing',
          name: '타입',
          description: typeList,
        },
        {
          '@type': 'Thing',
          name: '첫 등장 세대',
          description: `${pokemonDetail.generation}세대`,
        },
      ],
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: '도감 번호',
          value: pokemonDetail.number,
        },
        {
          '@type': 'PropertyValue',
          name: '첫 등장 세대',
          value: `${pokemonDetail.generation}세대`,
        },
        ...typeList.split(',').map((type) => {
          return {
            '@type': 'PropertyValue',
            name: '타입',
            value: type,
          }
        }),
        {
          '@type': 'PropertyValue',
          name: 'HP',
          value: stats?.hp ?? 0,
        },
        {
          '@type': 'PropertyValue',
          name: '공격',
          value: stats?.attack ?? 0,
        },
        {
          '@type': 'PropertyValue',
          name: '방어',
          value: stats?.defense ?? 0,
        },
        {
          '@type': 'PropertyValue',
          name: '특수공격',
          value: stats?.specialAttack ?? 0,
        },
        {
          '@type': 'PropertyValue',
          name: '특수방어',
          value: stats?.specialDefense ?? 0,
        },
        {
          '@type': 'PropertyValue',
          name: '스피드',
          value: stats?.speed ?? 0,
        },
        {
          '@type': 'PropertyValue',
          name: '능력치 총합',
          value: stats?.total ?? 0,
        },
        ...(abilities?.map((ability) => ({
          '@type': 'PropertyValue',
          name: '특성',
          value: ability.name,
          description: ability.description,
        })) ?? []),
      ],
    },
  }
}
