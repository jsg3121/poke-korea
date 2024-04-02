import React from 'react'
import styled from 'styled-components'
import { Image, Switch } from '~/components'

interface NavSettingProps {
  scrolling: boolean
}

const Div = styled.div`
  width: 10rem;
  height: 3.33333333rem;
  border-radius: 1.66666667rem;
  transition: height 0.3s, width 0.3s;
  will-change: heignt, width;
  overflow: hidden;
  background-color: var(--color-primary-3);

  &[data-scrolling='true'] {
    width: 7rem;
    height: 2rem;
    position: absolute;
    right: 0;

    ul {
      width: 7rem;
      transform: translateY(0);
    }
  }

  > ul {
    width: 10rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    transition: transform 0.3s, width 0.3s;
    will-change: transform, width;
    transform: translateY(-2rem);

    &.scroll-nav {
      height: 2rem;
      gap: 0.3rem;

      & > li {
        height: 2rem;
      }
    }

    & > li {
      overflow: hidden;

      > button {
        width: 100%;
        height: 2rem;

        > p {
          width: 100%;
          height: 1.25rem;
          font-size: 1rem;
          line-height: 1.25rem;
          text-align: center;
        }
      }
    }
  }
`

const NavSetting: React.FC<NavSettingProps> = (props) => {
  const { scrolling } = props

  const handleChangeTheme = () => {}

  return (
    <Div data-scrolling={scrolling}>
      <ul className="scroll-nav">
        <li className="button-setting">
          <Image
            alt="icon-setting"
            src="/assets/image/setting.svg"
            height="2rem"
            width="2rem"
          />
        </li>
        <li className="button-theme">
          <Switch name="change-theme" onChange={handleChangeTheme} />
        </li>
      </ul>
      <ul>
        <li className="button-setting">
          <button>
            <p>설정</p>
          </button>
        </li>
        <li className="button-theme">
          <button>
            <p>테마 변경</p>
          </button>
        </li>
      </ul>
    </Div>
  )
}

export default NavSetting
