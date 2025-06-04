import { GetStaticProps } from 'next'
import { Fragment } from 'react'
import { useDevice } from '~/context/Device.context'
import TypeEffectivenessDesktop from '~/views/desktop/TypeEffectiveness.desktop'
import TypeEffectivenessMobile from '~/views/mobile/TypeEffectiveness.mobile'

const TypeEffectivenessPage = () => {
  const { isMobile } = useDevice()

  return (
    <Fragment>
      {isMobile ? <TypeEffectivenessMobile /> : <TypeEffectivenessDesktop />}
    </Fragment>
  )
}

export default TypeEffectivenessPage

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  }
}
