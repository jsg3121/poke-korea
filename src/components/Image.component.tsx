import { ImgHTMLAttributes } from 'react'

interface ImageComponentProps extends ImgHTMLAttributes<HTMLImageElement> {
  width: string
  height: string
  imageSize: {
    width: number
    height: number
  }
  densities?: number[]
  quality?: number
}

const ImageComponent = ({
  width,
  height,
  imageSize,
  densities = [1, 1.5],
  quality = 80,
  src,
  ...imageProps
}: ImageComponentProps) => {
  // WebP srcSet 생성 (고밀도 디스플레이 지원)
  const generateWebpSrcSet = () => {
    if (!src || !densities || densities.length === 0) return undefined

    const baseUrl = src.split('?')[0]

    return densities
      .map((density) => {
        const size = Math.round(imageSize.width * density)
        return `${baseUrl}?w=${size}&h=${size}&q=${quality}&format=webp ${density}x`
      })
      .join(', ')
  }

  // 기본 src에 1x 밀도 이미지 URL 생성 (fallback)
  const generateDefaultSrc = () => {
    if (!src) return src

    const baseUrl = src.split('?')[0]
    return `${baseUrl}?w=${imageSize.width}&h=${imageSize.height}&q=${quality}&format=webp`
  }

  return (
    <figure className="relative" style={{ width, height }}>
      <picture className="w-full h-full block">
        <source type="image/webp" srcSet={generateWebpSrcSet()} />
        <img
          {...imageProps}
          src={generateDefaultSrc()}
          width={imageSize.width}
          height={imageSize.height}
        />
      </picture>
    </figure>
  )
}

export default ImageComponent
