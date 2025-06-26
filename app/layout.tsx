// app/layout.tsx
import './globals.css'

export const metadata = {
  title: 'BrightTeach – Unlock your GCSE potential',
  description: 'Connect with Bright Teach across all platforms.',
  openGraph: {
    url: 'https://links.brightteach.com',
    title: 'BrightTeach – Unlock your GCSE potential',
    description: 'Connect with Bright Teach across all platforms.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrightTeach – Unlock your GCSE potential',
    description: 'Connect with Bright Teach across all platforms.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#4f80ff" />
      </head>
      <body>{children}</body>
    </html>
  )
}
