import NextImage, { ImageProps } from 'next/image'
import React from 'react'
import styled, { css } from 'styled-components'

interface ImageComponentProps extends Omit<ImageProps, 'width' | 'height'> {
  width: string
  height: string
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
      display: block;

      figure {
        width: 100%;
        height: 100%;
        position: relative;
      }
    }
  `}
`

const ImageComponent: React.FC<ImageComponentProps> = (props) => {
  const { width, height, ...imageProps } = props

  return (
    <StyledImage width={width} height={height}>
      <picture>
        <figure>
          <NextImage {...imageProps} fill />
        </figure>
      </picture>
    </StyledImage>
  )
}

export default ImageComponent
