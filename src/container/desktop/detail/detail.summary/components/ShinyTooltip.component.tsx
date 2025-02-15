import styled from 'styled-components'

const ShinyTooltipComponent = () => {
  return <Button>이로치?</Button>
}

export default ShinyTooltipComponent

const Button = styled.button`
  width: 4rem;
  height: 1.5rem;
  font-size: 0.75rem;
  text-align: center;
  background-color: var(--color-primary-4);
  border-radius: 0.75rem;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
`
