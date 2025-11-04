import sharp from 'sharp'
import { PokemonType } from '~/graphql/typeGenerated'

// 타입별 칩 색상 매핑 (TypesColor의 진한 색상 사용)
export const getTypeChipColors = (type: PokemonType) => {
  const typeKey = type.toLowerCase()
  const colorMap: Record<string, { background: string; color: string }> = {
    normal: { background: '#A8A878', color: '#ffffff' },
    fire: { background: '#F08030', color: '#ffffff' },
    water: { background: '#6890F0', color: '#ffffff' },
    grass: { background: '#78C850', color: '#ffffff' },
    electric: { background: '#F8D030', color: '#333333' },
    ice: { background: '#98D8D8', color: '#333333' },
    fighting: { background: '#C03028', color: '#ffffff' },
    poison: { background: '#A040A0', color: '#ffffff' },
    ground: { background: '#E0C068', color: '#333333' },
    flying: { background: '#A890F0', color: '#ffffff' },
    psychic: { background: '#F85888', color: '#ffffff' },
    bug: { background: '#A8B820', color: '#ffffff' },
    rock: { background: '#a0783f', color: '#ffffff' },
    ghost: { background: '#705898', color: '#ffffff' },
    dragon: { background: '#7038F8', color: '#ffffff' },
    dark: { background: '#656160', color: '#ffffff' },
    steel: { background: '#B8B8D0', color: '#333333' },
    fairy: { background: '#EE99AC', color: '#ffffff' },
  }
  return colorMap[typeKey] || { background: '#A8A878', color: '#ffffff' }
}

export const fetchAsBuffer = async (url: string) => {
  const res = await fetch(url, {
    next: {
      revalidate: 31536000,
    },
  })
  if (!res.ok) throw new Error(`fetch fail ${res.status}: ${url}`)
  const convertArrayBuffer = await res.arrayBuffer()
  return Buffer.from(convertArrayBuffer)
}

// 기본 OG 이미지를 fetch로 가져와서 반환하는 함수
export async function getDefaultOGImage() {
  const defaultImageUrl = 'https://poke-korea.com/assets/image/ogImage.png'
  const response = await fetch(defaultImageUrl)
  return new Response(response.body, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

export const bufferToArrayBuffer = (
  buf: Buffer,
): ArrayBuffer | SharedArrayBuffer => {
  const { buffer, byteOffset, byteLength } = buf
  return buffer.slice(byteOffset, byteOffset + byteLength)
}

export const convertPng = async (pokemonId: string) => {
  const cdnBase = 'https://image.poke-korea.com'
  const pokemonImgUrl = `${cdnBase}/image/${pokemonId}.webp`
  console.log('🔬 dev-only ~ convertPng ~ pokemonImgUrl:', pokemonImgUrl)
  // 1) WebP 불러오고
  const webpSrc = await fetchAsBuffer(pokemonImgUrl)
  // 2) PNG로 변환
  const pngSrc = await sharp(webpSrc).png({ quality: 100 }).toBuffer()
  const pngArrayBuffer = bufferToArrayBuffer(pngSrc)

  return pngArrayBuffer
}
