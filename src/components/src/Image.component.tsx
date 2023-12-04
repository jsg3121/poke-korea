import NextImage, { ImageProps } from 'next/image'
import React from 'react'
import styled, { css } from 'styled-components'

interface ImageComponentProps extends Omit<ImageProps, 'width' | 'height'> {
  width: string
  height: string
  imageCaption?: string
}

type StyledImageProps = {
  width: string
  height: string
}

const StyledImage = styled.div<StyledImageProps>`
  ${({ width, height }) => css`
    width: ${width};
    height: ${height};
    position: relative;

    picture {
      width: 100%;
      height: 100%;

      figure {
        figcaption {
          width: 0;
          height: 0;
          font-size: 0;
        }
      }
    }
  `}
`

const ImageComponent: React.FC<ImageComponentProps> = (props) => {
  const { width, height, imageCaption, ...imageProps } = props

  return (
    <StyledImage width={width} height={height}>
      <picture>
        <figure>
          <figcaption>{imageCaption ?? '아이콘'}</figcaption>
          <NextImage {...imageProps} fill sizes="10vw" loading="lazy" />
        </figure>
      </picture>
    </StyledImage>
  )
}

export default ImageComponent
