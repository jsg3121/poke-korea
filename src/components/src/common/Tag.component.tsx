import React from 'react'
import styled from 'styled-components'
import { changeType } from '~/common'
import { TypesColor } from '~/types'

interface TagComponentProps {
  label: string
}

const Tag = styled.p<{ color: TypesColor; type: string }>`
  width: 3.6rem;
  height: 1.3rem;
  padding: 0 0.5rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.color};
  text-align: center;
  display: flex;
  align-items: center;

  & > span {
    width: 100%;
    height: 1.3rem;
    font-size: 0.75rem;
    text-align: center;
    line-height: calc(1.3rem + 2px);
    color: #ffffff;
    margin: 0;
  }
`

const TagComponent: React.FC<TagComponentProps> = (props) => {
  const { label } = props

  const { color, type } = React.useMemo(() => {
    return changeType(label)
  }, [label])

  return (
    <Tag color={color} type={type}>
      <span>{label}</span>
    </Tag>
  )
}

export default TagComponent
