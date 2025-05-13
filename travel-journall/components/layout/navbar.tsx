"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";  // Import useRouter
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, Map, Image, Book, LogOut, User } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();  // Initialize useRouter hook

  // Function to navigate
  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="border-b">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => navigateTo("/")}>
          <span className="text-2xl font-bold text-primary">TravelExperience</span>
        </Button>

        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigateTo("/")}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <Button variant="ghost" onClick={() => navigateTo("/map")}>
            <Map className="w-4 h-4 mr-2" />
            Map
          </Button>
          <Button variant="ghost" onClick={() => navigateTo("/journal")}>
            <Book className="w-4 h-4 mr-2" />
            Journal
          </Button>
          <Button variant="ghost" onClick={() => navigateTo("/gallery")}>
            <Image className="w-4 h-4 mr-2" />
            Gallery
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
                <DropdownMenuItem onClick={() => navigateTo("/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigateTo("/auth")}>
              Login / Sign Up
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
