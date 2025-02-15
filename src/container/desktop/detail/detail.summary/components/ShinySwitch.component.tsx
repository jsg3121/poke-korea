import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import ShinyIcon from '~/assets/icons/sparkle.svg'

const ShinySwitch = () => {
  const router = useRouter()

  const isShiny = router.query.shinyMode === 'shiny' ? true : false

  const switchHref = {
    query: {
      ...router.query,
      shinyMode: isShiny ? 'normal' : 'shiny',
    },
  }

  return (
    <Li className={isShiny ? 'active-shiny' : ''}>
      <Link href={switchHref} className="switch-shiny" replace>
        <i className="icon-shiny">
          <ShinyIcon />
        </i>
        <p>이로치</p>
      </Link>
    </Li>
  )
}

export default ShinySwitch

const Li = styled.li`
  position: relative;
  left: -2.75rem;
  transition: left 0.2s ease-out;

  &:hover {
    left: -6.5rem;
  }

  &.active-shiny {
    left: -6.5rem;

    & > .switch-shiny {
      & > p {
        color: #333333;
      }

      & > .icon-shiny > svg {
        fill: #f5b62e;
      }
    }
  }

  & > .switch-shiny {
    width: 7rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0 1rem 0 0.5rem;
    border-top-left-radius: 9999px;
    border-bottom-left-radius: 9999px;
    background-color: var(--color-primary-4);
    cursor: pointer;

    &:active {
      color: #333333;
      background-color: var(--color-primary-3);
    }

    & > p {
      height: 2rem;
      font-size: 1rem;
      font-weight: normal;
      line-height: calc(2rem + 2px);
      color: #888888;
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
