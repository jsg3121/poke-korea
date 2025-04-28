import { GetStaticProps } from 'next'
import { Fragment } from 'react'
import TypeEffectivenessDesktop from '~/views/desktop/TypeEffectiveness.desktop'

const TypeEffectivenessPage = () => {
  return (
    <Fragment>
      <TypeEffectivenessDesktop />
    </Fragment>
  )
}

export default TypeEffectivenessPage

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  }
}
