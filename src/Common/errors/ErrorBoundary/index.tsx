import { Component, type ErrorInfo, type ReactNode } from 'react'
import {
  ErrorFallbackContainer,
  ErrorMessage,
  ErrorTitle,
} from './StyledComponents'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorFallbackContainer>
          <div>
            <ErrorTitle>Something went wrong</ErrorTitle>
            <ErrorMessage>
              An unexpected error occurred. Please refresh the page.
            </ErrorMessage>
          </div>
        </ErrorFallbackContainer>
      )
    }

    return this.props.children
  }
}