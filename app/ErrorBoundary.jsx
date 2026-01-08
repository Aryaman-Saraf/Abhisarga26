'use client'

import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Check if it's the removeChild error we want to suppress
    if (error?.message?.includes('removeChild') || 
        error?.message?.includes('not a child of this node')) {
      // Suppress this error - don't show error UI
      console.warn('Suppressed removeChild error:', error.message)
      return { hasError: false }
    }
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging, but suppress removeChild errors
    if (!error?.message?.includes('removeChild') && 
        !error?.message?.includes('not a child of this node')) {
      console.error('Error caught by boundary:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
