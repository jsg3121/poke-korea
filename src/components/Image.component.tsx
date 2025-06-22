import Image, { ImageProps } from 'next/image'
import { HTMLAttributes, ImgHTMLAttributes, ReactElement } from 'react'

interface ImageComponentProps extends any {
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
          {/* <Image {...imageProps} fill /> */}
        </figure>
      </picture>
    </div>
  )
}

export default ImageComponent
