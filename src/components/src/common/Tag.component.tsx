import React, { useMemo } from 'react'
import styled from 'styled-components'
import { changeType } from '~/module/changeType'
import { TypesColor } from '~/types'

interface TagComponentProps {
  label: string
}

const Tag = styled.p<{ color: TypesColor; type: string }>`
  width: 3.6rem;
  height: 1.5rem;
  padding: 0 0.5rem;
  border-radius: 0.625rem;
  background-color: ${(props) => props.color};
  text-align: center;
  display: flex;
  align-items: center;

  & > span {
    width: 100%;
    height: 1.3rem;
    font-size: 0.85rem;
    text-align: center;
    line-height: calc(1.3rem + 2px);
    color: #ffffff;
    filter: drop-shadow(0px 0px 1px #000000);
    margin: 0;
  }
`

const TagComponent = ({ label }: TagComponentProps) => {
  const { color, type } = useMemo(() => {
    return changeType(label)
  }, [label])

  return (
    <Tag color={color} type={type}>
      <span>{label}</span>
    </Tag>
  )
}

export default TagComponent
