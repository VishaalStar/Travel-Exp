import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import type { JournalEntry as JournalEntryType } from "@/types/journal"

interface JournalEntryProps {
  entry: JournalEntryType
  user: {
    username: string
    avatar?: string
  }
}

export function JournalEntry({ entry, user }: JournalEntryProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link href={`/profile/${entry.userId}`} className="font-semibold hover:underline">
            {user.username}
          </Link>
          <Link href={`/location/${entry.location.name}`} className="text-sm text-muted-foreground hover:underline">
            {entry.location.name}
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Carousel>
          <CarouselContent>
            {entry.photos.map((photo, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-[4/3]">
                  <Image
                    src={photo.url || "/placeholder.svg"}
                    alt={photo.caption || "Travel photo"}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                {photo.caption && <p className="mt-2 text-sm text-muted-foreground">{photo.caption}</p>}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div>
          <h3 className="font-semibold text-lg">{entry.title}</h3>
          <p className="mt-2">{entry.content}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Heart className="w-5 h-5 mr-1" />
            Like
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="w-5 h-5 mr-1" />
            Comment
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-5 h-5 mr-1" />
            Share
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">{format(new Date(entry.createdAt), "MMM d, yyyy")}</span>
      </CardFooter>
    </Card>
  )
}

