import { FC } from 'react'
import styled from 'styled-components'

const FooterContainer: FC = () => {
  return (
    <Footer>
      <p>Pokémon and Pokémon character names are trademarks of Nintendo.</p>
      <p>
        Pokémon content and materials are trademarks and copyrights of Nintendo
        or its licensors. All rights reserved.
      </p>
    </Footer>
  )
}

export default FooterContainer

const Footer = styled.footer`
  width: 100%;
  height: 8rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 0 1rem;

  & > p {
    width: 100%;
    height: 1.5rem;
    line-height: 1.25rem;
    text-align: center;
    color: var(--color-primary-3);
  }
`
