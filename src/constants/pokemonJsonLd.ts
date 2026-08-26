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
  getPokemonSize,
  getPokemonStats,
  getPokemonTypes,
  getSeoCanonicalUrl,
} from '~/module/generateDetailSeoMetaData'
import {
  CAPTURE_RATE_MAX,
  formatGenderPercent,
  parseGenderRate,
} from '~/module/pokemonSpec.module'
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
  // 키·몸무게는 폼마다 다르므로 활성 폼 기준(메타 description과 동일 소스)
  const { height, weight } = getPokemonSize({ ...commonParams, gigantamaxData })
  const genderRatio = parseGenderRate(pokemonDetail.genderRate)

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
    ? `${imageMode}/shiny/${imageList?.[activeIndex]?.imageCode}`
    : `${imageMode}/${imageList?.[activeIndex]?.imageCode}`

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
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'pokedexNumber',
        name: '전국도감 번호',
        value: pokemonDetail.number,
      },
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
        // 기본 제원(1.58.0). 값이 없는 항목은 배열에서 아예 뺀다 —
        // 0이나 빈 문자열을 신고하면 잘못된 사실을 구조화 데이터로 주장하게 된다.
        // 포켓몬은 Google 리치결과 지원 타입이 없어 표시 효과는 없으나,
        // 검색엔진의 엔티티 이해와 AI 개요 인용 가능성에 기여한다.
        ...(pokemonDetail.genus
          ? [
              {
                '@type': 'PropertyValue',
                name: '분류',
                value: pokemonDetail.genus,
              },
            ]
          : []),
        ...(height !== null && height !== undefined
          ? [
              {
                '@type': 'PropertyValue',
                name: '키',
                value: (height / 10).toFixed(1),
                unitText: 'm',
              },
            ]
          : []),
        ...(weight !== null && weight !== undefined
          ? [
              {
                '@type': 'PropertyValue',
                name: '몸무게',
                value: (weight / 10).toFixed(1),
                unitText: 'kg',
              },
            ]
          : []),
        ...(pokemonDetail.captureRate !== null &&
        pokemonDetail.captureRate !== undefined
          ? [
              {
                '@type': 'PropertyValue',
                name: '포획률',
                value: pokemonDetail.captureRate,
                maxValue: CAPTURE_RATE_MAX,
              },
            ]
          : []),
        ...(genderRatio
          ? [
              {
                '@type': 'PropertyValue',
                name: '성비',
                value: genderRatio.isGenderless
                  ? '성별 없음'
                  : `수컷 ${formatGenderPercent(genderRatio.male)}, 암컷 ${formatGenderPercent(genderRatio.female)}`,
              },
            ]
          : []),
        ...(pokemonDetail.eggGroups?.map((group) => ({
          '@type': 'PropertyValue',
          name: '알 그룹',
          value: group,
        })) ?? []),
        ...(pokemonDetail.isLegendary || pokemonDetail.isMythical
          ? [
              {
                '@type': 'PropertyValue',
                name: '희귀도',
                value: pokemonDetail.isLegendary
                  ? '전설의 포켓몬'
                  : '환상의 포켓몬',
              },
            ]
          : []),
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
