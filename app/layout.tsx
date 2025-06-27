import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vaishnavi - Complaints Corner',
  description: 'Your smart dashboard to lovingly complain about Harshendra',
  generator: 'Next.js',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  viewport: 'width=device-width, initial-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="overflow-x-hidden">{children}</body>
    </html>
  )
}
