import styled from 'styled-components'

const FooterContainer = () => {
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
  min-height: 8rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 20px 1rem;

  & > p {
    width: 100%;
    line-height: 1.25rem;
    text-align: center;
    font-size: 10px;
    color: var(--color-primary-3);

    &:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }
`
