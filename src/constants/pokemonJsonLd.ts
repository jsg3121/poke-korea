import {
  PokemonDetail,
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
}

export const generatePokemonJsonLd = ({
  pokemonDetail,
  activeType,
  activeIndex,
  isShiny,
  normalForm,
  megaEvolutionData,
  regionFormData,
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

  // 메타데이터와 동일한 네이밍 로직 사용
  const displayName = getPokemonNameByType({
    activeType,
    pokemonBaseInfoName: pokemonDetail.name,
    megaEvolutionName: megaEvolutionData?.[activeIndex]?.name || '',
    regionFormPlace: regionFormData?.[activeIndex]?.region || '',
    isShiny,
  })

  // 메타데이터와 동일한 URL 생성 로직 사용
  const canonicalUrl = getSeoCanonicalUrl({
    activeType,
    activeIndex,
    pokemonNumber: pokemonDetail.number,
    isShiny,
  })

  const typeList = pokemonTypes
    .map((type) => {
      return PokemonTypes[type]
    })
    .join(', ')

  const imageList = getImageList()

  const imageSrc = isShiny
    ? `${imageMode}/shiny/${imageList?.[activeIndex].imageCode}.webp`
    : `${imageMode}/${imageList?.[activeIndex].imageCode}.webp`

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGameCharacter',
    name: `No. ${pokemonDetail.number} ${displayName}`,
    description: `포켓몬 도감 번호 ${pokemonDetail.number}번. ${typeList} 타입의 포켓몬입니다. ${pokemonDetail.generation}세대에 등장하는 포켓몬으로 다양한 능력치와 특성을 가지고 있습니다.`,
    identifier: pokemonDetail.number.toString(),
    url: canonicalUrl,
    characterAttribute: typeList.split(','),
    gameLocation: `포켓몬 ${pokemonDetail.generation}세대`,
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: '도감 번호',
        value: pokemonDetail.number,
      },
      {
        '@type': 'PropertyValue',
        name: '세대',
        value: `${pokemonDetail.generation}세대`,
      },
      {
        '@type': 'PropertyValue',
        name: '타입',
        value: typeList.split(','),
      },

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
        name: '종족값 총합',
        value: stats?.total ?? 0,
      },
      ...(pokemonDetail.pokemonAbilityList?.map((ability) => ({
        '@type': 'PropertyValue',
        name: '특성',
        value: ability.name,
      })) || []),
    ],
    image: imageSrc,
    gameItem: {
      '@type': 'VideoGame',
      name: '포켓몬스터 시리즈',
      genre: 'RPG',
      gamePlatform: 'Nintendo',
    },
  }
}
