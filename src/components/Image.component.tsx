import { ImgHTMLAttributes } from 'react'

interface ImageComponentProps extends ImgHTMLAttributes<HTMLImageElement> {
  width: string
  height: string
  imageSize?: {
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
  quality = 85,
  src,
  ...imageProps
}: ImageComponentProps) => {
  const generateSrcSet = () => {
    if (!src || !densities || densities.length === 0) return undefined

    const baseUrl = src.split('?')[0]
    const baseSize = imageSize?.width || 160

    return densities
      .map((density) => {
        const size = Math.round(baseSize * density)
        return `${baseUrl}?w=${size}&h=${size}&q=${quality} ${density}x`
      })
      .join(', ')
  }

  return (
    <figure className="relative" style={{ width, height }}>
      <picture className="w-full h-full block">
        <img
          {...imageProps}
          src={src}
          srcSet={generateSrcSet()}
          width={imageSize?.width}
          height={imageSize?.height}
        />
      </picture>
    </figure>
  )
}

export default ImageComponent
