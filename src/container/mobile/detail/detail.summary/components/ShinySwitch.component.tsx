import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import ShinyIcon from '~/assets/icons/sparkle.svg'

const Li = styled.li`
  & > .switch-shiny {
    width: 6.5rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.5rem;
    border-radius: 1rem;
    background-color: var(--color-primary-4);
    opacity: 0.65;

    &:active {
      background-color: var(--color-primary-3);
    }

    &.active-shiny > .icon-shiny > svg {
      fill: #f5b62e;
    }

    & > p {
      height: 2rem;
      flex-shrink: 0;
      font-size: 1rem;
      line-height: calc(2rem + 2px);
      font-weight: normal;
      color: #000000;
      padding: 0 0.25rem;
    }

    & > .icon-shiny {
      width: 2rem;
      height: 2rem;
      flex-shrink: 0;
      display: block;

      svg {
        fill: transparent;
      }
    }
  }
`

const ShinySwitchComponent = () => {
  const router = useRouter()

  const isShiny = router.query.shinyMode === 'shiny' ? true : false

  const switchHref = {
    query: {
      ...router.query,
      shinyMode: isShiny ? 'normal' : 'shiny',
    },
  }

  return (
    <Li>
      <Link
        href={switchHref}
        className={`switch-shiny ${isShiny ? 'active-shiny' : ''}`}
        replace
      >
        <i className="icon-shiny">
          <ShinyIcon />
        </i>
        <p>이로치</p>
      </Link>
    </Li>
  )
}

export default ShinySwitchComponent
