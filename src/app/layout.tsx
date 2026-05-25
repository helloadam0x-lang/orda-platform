import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Orda — Every Customer. Always Answered.',
  description: 'Connect your WhatsApp. Get an AI agent that handles every customer message, takes orders, runs your store, and sends real notifications — automatically.',
  openGraph: {
    title: 'Orda — Every Customer. Always Answered.',
    description: 'The universal AI business platform. Connect WhatsApp. Run everything.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
