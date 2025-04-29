import { Fragment } from 'react'
import styled from 'styled-components'

const TypeEffectivenessResultComponent = () => {
  return (
    <Fragment>
      <Article aria-labelledby="calculate-result-type">
        <header>
          <h3 id="calculate-result-type">이런 타입에 강해요!!</h3>
        </header>
      </Article>
      <Article aria-labelledby="calculate-result-type">
        <header>
          <h3 id="calculate-result-type">이런 타입에 약해요..</h3>
        </header>
      </Article>
    </Fragment>
  )
}

export default TypeEffectivenessResultComponent

const Article = styled.article``
