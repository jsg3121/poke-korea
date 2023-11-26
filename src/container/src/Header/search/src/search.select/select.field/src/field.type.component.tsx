import React from 'react'
import isEqual from 'fast-deep-equal'
import { Checkbox } from '~/components'
import { PokemonTypes } from '~/types'

interface FieldTypeComponentProps {
  filter?: Array<string>
}

const FieldTypeComponent: React.FC<FieldTypeComponentProps> = (props) => {
  const { filter } = props

  const handleChageFilter = React.useCallback(() => {}, [])

  return (
    <div>
      <p className="filter__content--title">
        Type
        {filter && filter.length === 2 && (
          <span>최대 두 타입까지 선택할 수 있습니다.</span>
        )}
      </p>
      <div>
        {Object.entries(PokemonTypes).map((key) => {
          return (
            <Checkbox
              key={key[0]}
              label={key[1]}
              value={key[1]}
              onChecked={handleChageFilter}
              defaultChecked={filter && filter.indexOf(key[1]) >= 0}
              disabled={
                filter && filter.length === 2 && filter.indexOf(key[1]) < 0
                  ? true
                  : false
              }
            />
          )
        })}
      </div>
    </div>
  )
}

export default React.memo(FieldTypeComponent, isEqual)
