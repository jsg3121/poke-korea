import { useRouter } from 'next/router'
import { ChangeEvent } from 'react'
import styled from 'styled-components'
import RegionIcon from '~/assets/icons/region.svg'
import { TActiveType } from '~/context/Detail.context'

interface RegionSwitchProps {
  onChnageType: (type: TActiveType) => void
}

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

const RegionSwitchComponent = ({ onChnageType }: RegionSwitchProps) => {
  const router = useRouter()

  const defaultChecked = router.query.activeType === 'region' ? true : false

  const handleChangeRegion = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    onChnageType(checked ? 'region' : 'normal')
  }

  return (
    <Li role="button">
      <input
        type="checkbox"
        id="swtich-change-region"
        checked={defaultChecked}
        onChange={handleChangeRegion}
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
