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
  densities = [1, 2],
  quality = 75,
  src,
  ...imageProps
}: ImageComponentProps) => {
  const generateSrcSet = () => {
    if (!src || !densities || densities.length === 0) return undefined

    const baseUrl = src.split('?')[0]

    return densities
      .map((density) => {
        const size = Math.round(imageSize.width * density)
        return `${baseUrl}?w=${size}&h=${size}&q=${quality} ${density}x`
      })
      .join(', ')
  }

  // 기본 src에 1x 밀도 이미지 URL 생성
  const generateDefaultSrc = () => {
    if (!src) return src

    const baseUrl = src.split('?')[0]
    return `${baseUrl}?w=${imageSize.width}&h=${imageSize.height}&q=${quality}`
  }

  return (
    <figure className="relative" style={{ width, height }}>
      <picture className="w-full h-full block">
        <img
          {...imageProps}
          src={generateDefaultSrc()}
          srcSet={generateSrcSet()}
          width={imageSize.width}
          height={imageSize.height}
        />
      </picture>
    </figure>
  )
}

export default ImageComponent
