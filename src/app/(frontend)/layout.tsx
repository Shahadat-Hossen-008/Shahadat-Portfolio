import { JetBrains_Mono, Source_Serif_4 } from 'next/font/google'
import Background from './background'
import './background/index.css'

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
})

const serif = Source_Serif_4({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

export const metadata = {
  title: 'Payload Next.js Starter',
  description: 'A starter project for Payload CMS and Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} ${serif.variable}`}>
      <body className="bg-void">
        {/* one grid, fixed to the viewport, sits behind the entire site.
            no glow/scanlines here — those are hero-only, added locally below. */}
        <Background position="fixed" grid glow={false} />

        {children}
      </body>
    </html>
  )
}
