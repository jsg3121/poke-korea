import isEqual from 'fast-deep-equal'
import { memo } from 'react'
import LogoIcon from '~/assets/logo.svg'

const LogoComponent = () => {
  return (
    <article className="w-[25rem] mx-auto">
      <h1 className="text-[2.5rem] absolute left-1/2 -translate-x-1/2 translate-y-0 text-primary-1 -z-[1] pointer-events-none select-none">
        포켓몬의 모든 정보 Poke Korea
      </h1>
      <LogoIcon />
    </article>
  )
}

export default memo(LogoComponent, isEqual)
