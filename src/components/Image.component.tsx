import NextImage, { ImageProps } from 'next/image'

interface ImageComponentProps extends Omit<ImageProps, 'width' | 'height'> {
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
          <NextImage {...imageProps} fill />
        </figure>
      </picture>
    </div>
  )
}

export default ImageComponent
