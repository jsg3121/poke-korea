import { ImgHTMLAttributes } from 'react'

interface ImageComponentProps extends ImgHTMLAttributes<HTMLImageElement> {
  width: string
  height: string
}

const ImageComponent = ({
  width,
  height,
  ...imageProps
}: ImageComponentProps) => {
  return (
    <figure className="relative mx-auto" style={{ width, height }}>
      <picture className="w-full h-full block">
        <img {...imageProps} />
      </picture>
    </figure>
  )
}

export default ImageComponent
