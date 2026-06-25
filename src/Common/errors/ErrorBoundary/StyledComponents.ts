import styled from 'styled-components'

export const ErrorFallbackContainer = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #0f0f14;
  color: #f3f4f6;
  text-align: center;
`

export const ErrorTitle = styled.h1`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
`

export const ErrorMessage = styled.p`
  margin: 0;
  color: #9ca3af;
`