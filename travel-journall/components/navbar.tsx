"use client"

import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, Map, Image, Book, LogOut, User } from "lucide-react"

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="border-b">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          TravelJournal
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/map">
              <Map className="w-4 h-4 mr-2" />
              Map
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/journal">
              <Book className="w-4 h-4 mr-2" />
              Journal
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/gallery">
              <Image className="w-4 h-4 mr-2" />
              Gallery
            </Link>
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user.id}`}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/auth">Login / Sign Up</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}

