import isEqual from 'fast-deep-equal'
import LogoIcon from '~/assets/logo.svg'
import { memo } from 'react'

interface LogoComponentProps {
  scrolling?: boolean
  searching?: boolean
}

const LogoComponent = ({ scrolling, searching }: LogoComponentProps) => {
  return (
    <article
      className="w-full max-w-[1280px] h-24 relative transition-[height] duration-300 will-change-[height] mx-auto data-[scrolling=true]:h-0 data-[searching=has-query]:h-0"
      data-scrolling={scrolling}
      data-searching={searching ? 'has-query' : ''}
    >
      <h1 className="sr-only">포켓몬의 모든 정보 Poke Korea</h1>
      <div
        className="w-full max-w-[30rem] absolute top-0 left-1/2 translate-x-[-50%] translate-y-0 scale-100 origin-left transition-[top,left,transform] duration-300 will-change-[top,left,transform] data-[scrolling=true]:max-w-[30rem] data-[scrolling=true]:-top-6 data-[scrolling=true]:left-0 data-[scrolling=true]:origin-left data-[scrolling=true]:translate-x-0 data-[scrolling=true]:translate-y-0 data-[scrolling=true]:scale-50 data-[searching=has-query]:max-w-[30rem] data-[searching=has-query]:-top-6 data-[searching=has-query]:left-0 data-[searching=has-query]:origin-left data-[searching=has-query]:translate-x-0 data-[searching=has-query]:translate-y-0 data-[searching=has-query]:scale-50"
        data-scrolling={scrolling}
        data-searching={searching ? 'has-query' : ''}
      >
        <LogoIcon />
      </div>
    </article>
  )
}

export default memo(LogoComponent, isEqual)
