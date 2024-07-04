import { useRouter } from 'next/router'
import { ChangeEvent, FC } from 'react'
import styled from 'styled-components'
import RegionIcon from '~/assets/icons/region.svg'

const Li = styled.li`
  & > input {
    display: none;

    &:checked + label {
      opacity: 1;

      & > .icon-shiny > svg {
        filter: grayscale(0);
      }
    }
  }

  & > label {
    width: 6.5rem;
    height: 2rem;
    font-size: 1rem;
    font-weight: normal;
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

    & > p {
      flex-shrink: 0;
      padding: 0 0.25rem;
    }

    & > .icon-shiny {
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

const RegionSwitchComponent: FC = () => {
  const router = useRouter()

  const defaultChecked = router.query.activeType === 'region' ? true : false

  const handleChangeMega = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    const { query } = router

    delete query.activeIndex

    router.replace(
      {
        query: {
          ...query,
          activeType: checked ? 'region' : 'normal',
        },
      },
      undefined,
      {
        scroll: false,
      },
    )
  }
  return (
    <Li role="button">
      <input
        type="checkbox"
        id="swtich-change-region"
        checked={defaultChecked}
        onChange={handleChangeMega}
      />
      <label htmlFor="swtich-change-region">
        <i className="icon-shiny">
          <RegionIcon />
        </i>
        <p>리전폼</p>
      </label>
    </Li>
  )
}

export default RegionSwitchComponent
