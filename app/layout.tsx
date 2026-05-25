import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Orda — Every Customer. Always Answered.',
  description: 'Connect your WhatsApp and get an AI agent that handles every customer message automatically. Takes orders. Sends notifications. Runs your store. While you sleep.',
  keywords: 'WhatsApp AI, business automation, AI chatbot, order management, online store',
  openGraph: {
    title: 'Orda — Every Customer. Always Answered.',
    description: 'Connect your WhatsApp. Get an AI agent that never sleeps.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
