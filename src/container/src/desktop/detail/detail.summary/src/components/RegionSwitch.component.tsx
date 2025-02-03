import { useRouter } from 'next/router'
import { ChangeEvent, FC } from 'react'
import styled from 'styled-components'
import RegionIcon from '~/assets/icons/region.svg'

const RegionSwitch: FC = () => {
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

export default RegionSwitch

const Li = styled.li`
  position: relative;
  left: -2.75rem;
  transition: left 0.2s ease-out;

  &:hover {
    left: -6.5rem;
  }

  & > input {
    display: none;

    &:checked + label > .icon-shiny > svg {
      filter: grayscale(0);
    }
  }

  & > label {
    width: 7rem;
    height: 2rem;
    font-size: 1rem;
    font-weight: normal;
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
      background-color: var(--color-primary-3);
    }

    & > p {
      flex-shrink: 0;
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
