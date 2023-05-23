import Navbar from '@components/navbar/Navbar'
import LoginModal from '@components/navbar/modals/LoginModal'
import Modal from '@components/navbar/modals/Modal'
import RegisterModal from '@components/navbar/modals/RegisterModal'
import ToastProvider from '@components/provider/ToastProvider'

import '@styles/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className=''>
        <div className='main'>
          <div className='gradient'></div>
        </div>
        
        <main className=' relative z-10 flex justify-center items-center flex-col max-w-7xl mx-auto'>
          <ToastProvider/>
          <Navbar/>
          <RegisterModal />
          <LoginModal/>
          
          {children}
        </main>
      </body>
    </html>
  )
}
