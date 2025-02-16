import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import RegionIcon from '~/assets/icons/region.svg'

const RegionSwitch = () => {
  const router = useRouter()

  const isRegion = router.query.activeType === 'region' ? true : false

  const regionHref = {
    query: {
      ...router.query,
      activeType: isRegion ? 'normal' : 'region',
    },
  }

  return (
    <Li className={isRegion ? 'active-region' : ''}>
      <Link
        href={regionHref}
        className="switch-region"
        aria-label="리전폼 변환 스위치"
        replace
      >
        <i className="icon-region" aria-hidden>
          <RegionIcon />
        </i>
        <span>리전폼</span>
      </Link>
    </Li>
  )
}

export default RegionSwitch

const Li = styled.li`
  position: relative;
  left: -2.75rem;
  transition: left 0.2s ease-out;

  &:hover {
    left: -7rem;
  }

  &.active-region {
    left: -7rem;

    & > .switch-region {
      & > span {
        color: #333333;
      }

      & > .icon-region > svg {
        filter: grayscale(0);
      }
    }
  }

  & > .switch-region {
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

    & > span {
      height: 2rem;
      font-size: 1rem;
      font-weight: normal;
      line-height: calc(2rem + 2px);
      color: #888888;
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
