import isEqual from 'fast-deep-equal'
import { memo } from 'react'
import LogoIcon from '~/assets/logo.svg'

const LogoComponent = () => {
  return (
    <article className="w-[25rem] mx-auto">
      <h1 className="sr-only">포켓몬의 모든 정보 Poke Korea</h1>
      <LogoIcon />
    </article>
  )
}

export default memo(LogoComponent, isEqual)
