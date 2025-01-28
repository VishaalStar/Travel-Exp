import "./globals.css"
import { Inter } from "next/font/google"
import { Navbar } from "@/components/layout/navbar"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Travel Journal",
  description: "Document and share your travel experiences",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* Adding background image from the public folder */}
          <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/bg.jpg)' }}>
            <Navbar />
            <main className="container mx-auto py-8 px-4">{children}</main>
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
