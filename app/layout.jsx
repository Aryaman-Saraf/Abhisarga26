import './globals.css'
import ClientShell from './ClientShell'
import ErrorBoundary from './ErrorBoundary'
import { Cinzel_Decorative, Space_Grotesk, VT323 } from "next/font/google";

const cinzel = Cinzel_Decorative({ 
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-cinzel"
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space"
});

const vt323 = VT323({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323"
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      {/* Combined:
         1. Font variables from the new code
         2. Tailwind classes (bg/text) from the old code
      */}
      <body className={`${cinzel.variable} ${spaceGrotesk.variable} ${vt323.variable} relative min-h-screen bg-[#030204] text-white`}>
        <ErrorBoundary>
          <ClientShell>{children}</ClientShell>
        </ErrorBoundary>
      </body>
    </html>
  );
}