import './globals.css'
import ClientShell from './ClientShell'
import ErrorBoundary from './ErrorBoundary'

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="relative min-h-screen bg-[#030204] text-white">
        <ErrorBoundary>
          <ClientShell>{children}</ClientShell>
        </ErrorBoundary>
      </body>
    </html>
  )
}
