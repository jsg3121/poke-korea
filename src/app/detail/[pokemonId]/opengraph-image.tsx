import { ImageResponse } from 'next/og'
import { initializeApollo } from '~/module/apolloClient'
import { PokemonDetailDocument } from '~/graphql/gqlGenerated'
import { PokemonDetailQuery } from '~/graphql/typeGenerated'
import { changeType } from '~/module/changeType'
import {
  convertPng,
  getDefaultOGImage,
  getTypeChipColors,
} from '~/module/ogImage.module'

export const runtime = 'nodejs'
export const alt = '포케 코리아 – 포켓몬 정보'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ pokemonId: string }>
}) {
  try {
    const { pokemonId } = await params
    const parsedPokemonId = parseInt(pokemonId, 10)

    // pokemonId 유효성 검증
    if (isNaN(parsedPokemonId) || parsedPokemonId <= 0) {
      return getDefaultOGImage()
    }

    // Apollo Client로 포켓몬 데이터 가져오기
    const apolloClient = initializeApollo()
    const { data } = await apolloClient.query<PokemonDetailQuery>({
      query: PokemonDetailDocument,
      variables: { pokemonId: parsedPokemonId },
      fetchPolicy: 'cache-first',
    })

    const pokemon = data?.getPokemonDetail

    if (!pokemon) {
      // 포켓몬이 없을 경우 기본 OG 이미지 사용
      return getDefaultOGImage()
    }

    // 첫 번째 타입의 색상을 메인 색상으로 사용
    const primaryTypeInfo = changeType(pokemon.types[0])
    const primaryColor = primaryTypeInfo.color
    const secondaryColor = pokemon.types[1]
      ? changeType(pokemon.types[1]).color
      : primaryColor

    const pokemonImgeUrl = await convertPng(pokemonId)

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
            padding: '60px 80px',
            position: 'relative',
          }}
        >
          {/* 왼쪽: 텍스트 정보 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '20px',
              flex: 1,
            }}
          >
            {/* 도감 번호 */}
            <div
              style={{
                display: 'flex',
                fontSize: 32,
                fontWeight: 'bold',
                color: 'rgba(255, 255, 255, 0.9)',
                letterSpacing: '2px',
              }}
            >
              NO. {String(pokemon.number).padStart(4, '0')}
            </div>

            {/* 포켓몬 이름 */}
            <div
              style={{
                display: 'flex',
                fontSize: 72,
                fontWeight: 'bold',
                color: 'white',
                textShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)',
              }}
            >
              {pokemon.name}
            </div>

            {/* 타입 배지 */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '10px',
              }}
            >
              {pokemon.types.map((type) => {
                const typeInfo = changeType(type)
                const chipColors = getTypeChipColors(type)
                return (
                  <div
                    key={type}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 30px',
                      background: chipColors.background,
                      borderRadius: '20px',
                      fontSize: 22,
                      fontWeight: '600',
                      color: chipColors.color,
                    }}
                  >
                    {typeInfo.type}
                  </div>
                )
              })}
            </div>

            {/* 브랜드 로고 */}
            <div
              style={{
                display: 'flex',
                marginTop: '30px',
                fontSize: 28,
                fontWeight: 'bold',
                color: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              포케 코리아
            </div>
          </div>

          {/* 오른쪽: 포켓몬 이미지 영역 (현재는 원형 배경만) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '450px',
              height: '450px',
              position: 'relative',
            }}
          >
            <img
              src={pokemonImgeUrl as unknown as string}
              width={475}
              height={475}
              style={{ objectFit: 'contain' }}
              alt=""
            />
          </div>
        </div>
      ),
      {
        ...size,
      },
    )
  } catch (error) {
    // 모든 에러 발생 시 기본 OG 이미지 사용
    console.error('Error generating pokemon OG image:', error)
    return getDefaultOGImage()
  }
}
