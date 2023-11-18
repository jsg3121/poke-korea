import React from 'react'
import styled from 'styled-components'

interface BallComponentProps {
  value?: boolean
}

const Ball = styled.span<{ value: boolean }>`
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1px solid #aaaaaa;
  position: relative;
  transition: transform 0.3s, rotate 0.3s;
  will-change: transform;

  .ball--top {
    width: 100%;
    height: 50%;
    background-color: #ff0000;
    border-top-left-radius: 10rem;
    border-top-right-radius: 10rem;
    border-bottom: 1px solid #000000;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    box-sizing: border-box;
    box-shadow: inset -2px 0 0px 0px #aa3333, inset 3px 1px 0px 0px #fa6969;
    z-index: 1;
  }

  .ball--bottom {
    width: 100%;
    height: 50%;
    background-color: #ffffff;
    border-bottom-left-radius: 10rem;
    border-bottom-right-radius: 10rem;
    border-top: 1px solid #000000;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0);
    box-sizing: border-box;
    box-shadow: inset -2px -1.5px 0px 0px #bbbbbb;
    z-index: 2;
  }

  .ball--center {
    width: 50%;
    height: 50%;
    background-color: #ffffff;
    border: 2px solid #000000;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    box-sizing: border-box;
    box-shadow: inset -1.3px -1.2px 0px 0px #bbbbbb;
  }
`

const BallComponent: React.FC<BallComponentProps> = (props) => {
  const { value } = props

  return (
    <Ball value={value ?? false} className="ball">
      <i className="ball--top" />
      <i className="ball--center" />
      <i className="ball--bottom" />
    </Ball>
  )
}

export default BallComponent
