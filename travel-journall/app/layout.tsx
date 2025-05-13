import "./globals.css"
import { Inter } from "next/font/google"
import { Navbar } from "@/components/layout/navbar"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Travel Expirence",
  description: "Document and share your travel experiences",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAO_MxTQlfLzU3aDByNllfJS2N7AVivRH8&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {/* Adding background image from the public folder */}
          <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat" 
            style={{ backgroundImage: 'url(/bg.jpg)' }}
          >
            <Navbar />
            <main className="container mx-auto py-8 px-4">
              {children}
            </main>
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}