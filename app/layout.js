import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MeTime (Get It Now) Digital Marketing',
  description: 'MeTime (Get It Now) Digital Marketing - وكالة تسويق إلكتروني متكاملة لإدارة الإعلانات والسوشيال ميديا والتصميم الاحترافي',
  verification: {
    google: 'ojNg55jHDhzknlzZfoaC8r3JR0cs6HwZqzAu-syYHSc',
  },
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="ar" dir="rtl">
        <body className={`${inter.className} flex flex-col min-h-screen bg-white`}>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}