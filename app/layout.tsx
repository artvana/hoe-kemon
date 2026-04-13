import type { Metadata } from 'next'
import { Press_Start_2P, VT323, Nunito } from 'next/font/google'
import './globals.css'
import './gb-bootseq.css'

const nunito = Nunito({
  weight: ['800'],
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
  style: ['italic'],
})

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
  display: 'swap',
})

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HOE-KEMON',
  description: '✦ THIRST VERSION ✦',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${pressStart2P.variable} ${vt323.variable} ${nunito.variable}`}>
      <head>
        {/* CSS box-shadow pixel art sprites — served from public/ */}
        <link rel="stylesheet" href="/gb-sprites.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
