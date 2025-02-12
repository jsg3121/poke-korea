import styled from 'styled-components'
import ThemeSwitch from './ThemeSwitch'
import ImageComponent from '~/components/Image.component'

interface NavSettingProps {
  scrolling: boolean
}

const Div = styled.div`
  width: 10rem;
  height: 3.33333333rem;
  border-radius: 1.66666667rem;
  transition:
    height 0.2s,
    width 0.2s;
  will-change: heignt, width;
  overflow: hidden;
  background-color: var(--color-primary-3);

  &[data-scrolling='true'] {
    width: 5rem;
    height: 2rem;
    position: absolute;
    right: 0;
    z-index: 15;

    ul {
      width: 5rem;
      transform: translateY(-2rem);
    }
  }

  > ul {
    width: 10rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    transition:
      transform 0.2s,
      width 0.2s;
    will-change: transform, width;

    &.scroll-nav {
      height: 2rem;
      gap: 0.3rem;

      & > li {
        height: 2rem;
        cursor: pointer;
      }
    }

    & > li {
      overflow: hidden;

      > button {
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

  return (
    <Div data-scrolling={scrolling}>
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
      <ul className="scroll-nav">
        <li className="button-setting">
          <ImageComponent
            alt="icon-setting"
            src="/assets/image/setting.svg"
            height="2rem"
            width="2rem"
          />
        </li>
        <li className="button-theme">
          <ThemeSwitch />
        </li>
      </ul>
    </Div>
  )
}

export default NavSetting
