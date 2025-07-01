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
    <div className="relative" style={{ width, height }}>
      <picture className="w-full h-full block">
        <figure className="w-full h-full relative">
          <img {...imageProps} />
        </figure>
      </picture>
    </div>
  )
}

export default ImageComponent
