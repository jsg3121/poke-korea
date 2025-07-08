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
      <figure className="w-full h-full relative">
        <picture className="w-full h-full block">
          <img {...imageProps} />
        </picture>
      </figure>
    </div>
  )
}

export default ImageComponent
