import './globals.css'

export const metadata = {
  title: 'BotForge',
  description: 'Personal Discord Bot Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
