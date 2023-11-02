import React from 'react'
import styled from 'styled-components'
import { changeType } from '~/common'
import { TypesColor } from '~/types'

interface TagComponentProps {
  label: string
}

const Tag = styled.p<{ color: TypesColor; type: string }>`
  width: 3.75rem;
  height: 1.38888889rem;
  padding: 0 0.5rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.color};
  text-align: center;
  display: flex;
  align-items: center;

  & > span {
    height: 0.75rem;
    width: 100%;
    font-size: 0.875rem;
    text-align: center;
    margin: 0;
    color: #ffffff;
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
