import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import RegionIcon from '~/assets/icons/region.svg'

const Li = styled.li`
  & > .switch-region {
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
      color: #333333;
      background-color: var(--color-primary-3);
    }

    &.active-region > .icon-region > svg {
      filter: grayscale(0);
    }

    & > p {
      height: 2rem;
      font-size: 1rem;
      font-weight: normal;
      line-height: calc(2rem + 2px);
      color: #000000;
      flex-shrink: 0;
      padding: 0 0.25rem;
    }

    & > .icon-region {
      width: 2rem;
      height: 2rem;
      flex-shrink: 0;
      display: block;

      svg {
        filter: grayscale(1);
      }
    }
  }
`

const RegionSwitchComponent = () => {
  const router = useRouter()

  const isRegion = router.query.activeType === 'region' ? true : false

  const regionHref = {
    query: {
      ...router.query,
      activeType: isRegion ? 'normal' : 'region',
    },
  }

  return (
    <Li role="button">
      <Link
        href={regionHref}
        className={`switch-region ${isRegion ? 'active-region' : ''}`}
        replace
      >
        <i className="icon-region">
          <RegionIcon />
        </i>
        <p>리전폼</p>
      </Link>
    </Li>
  )
}

export default RegionSwitchComponent
