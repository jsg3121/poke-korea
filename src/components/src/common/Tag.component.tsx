import React from 'react'
import styled from 'styled-components'
import { changeType } from '~/common'
import { TypesColor } from '~/types'

interface TagComponentProps {
  label: string
}

const Tag = styled.p<{ color: TypesColor; type: string }>`
  width: 3.05555556rem;
  height: 1.22222222rem;
  padding: 0 0.5rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.color};
  text-align: center;
  display: flex;
  align-items: center;

  & > span {
    width: 100%;
    font-size: 0.75rem;
    text-align: center;
    line-height: 1.22222222rem;
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
