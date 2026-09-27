import { ImgHTMLAttributes } from 'react'

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  width: string
  height: string
  imageSize: {
    width: number
    height: number
  }
  densities?: number[]
  quality?: number
}

const Image = ({
  width,
  height,
  imageSize,
  densities = [1, 1.5],
  quality = 80,
  src,
  ...imageProps
}: ImageProps) => {
  const generateWebpSrcSet = () => {
    if (!src || !densities || densities.length === 0) return undefined

    const baseUrl = src.split('?')[0]

    return densities
      .map((density) => {
        const size = Math.round(imageSize.width * density)
        return `${baseUrl}?w=${size}&h=${size}&q=${quality} ${density}x`
      })
      .join(', ')
  }

  const generateDefaultSrc = () => {
    if (!src) return src

    const baseUrl = src.split('?')[0]
    return `${baseUrl}?w=${imageSize.width}&h=${imageSize.height}&q=${quality}`
  }

  return (
    <figure
      className="relative flex items-center justify-center"
      style={{ width, height }}
    >
      <picture className="max-w-full max-h-full block">
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

export default Image
