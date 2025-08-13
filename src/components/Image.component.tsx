import { ImgHTMLAttributes } from 'react'

interface ImageComponentProps extends ImgHTMLAttributes<HTMLImageElement> {
  width: string
  height: string
  imageSize?: {
    width: number
    height: number
  }
}

const ImageComponent = ({
  width,
  height,
  imageSize,
  ...imageProps
}: ImageComponentProps) => {
  return (
    <figure className="relative" style={{ width, height }}>
      <picture className="w-full h-full block">
        <img
          {...imageProps}
          width={imageSize?.width}
          height={imageSize?.height}
        />
      </picture>
    </figure>
  )
}

export default ImageComponent
