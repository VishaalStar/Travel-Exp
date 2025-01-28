"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { likeJournal, unlikeJournal, addComment } from "@/lib/journalService"
import type { JournalEntry as JournalEntryType, Comment } from "@/types/journal"

interface JournalEntryProps {
  entry: JournalEntryType
  user: {
    username: string
    avatar?: string
  }
}

export function JournalEntry({ entry, user }: JournalEntryProps) {
  const { user: currentUser } = useAuth()
  const [isLiked, setIsLiked] = useState(entry.likes.includes(currentUser?.id || ""))
  const [likesCount, setLikesCount] = useState(entry.likes.length)
  const [comments, setComments] = useState<Comment[]>(entry.comments)
  const [newComment, setNewComment] = useState("")
  const [showComments, setShowComments] = useState(false)

  const handleLike = async () => {
    if (!currentUser) return
    try {
      if (isLiked) {
        await unlikeJournal(entry.id, currentUser.id)
        setLikesCount((prev) => prev - 1)
      } else {
        await likeJournal(entry.id, currentUser.id)
        setLikesCount((prev) => prev + 1)
      }
      setIsLiked(!isLiked)
    } catch (error) {
      console.error("Error handling like:", error)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !newComment.trim()) return
    try {
      const comment = await addComment(entry.id, {
        userId: currentUser.id,
        content: newComment.trim(),
      })
      setComments((prev) => [...prev, comment])
      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleShare = () => {
    // Implement share functionality here
    alert("Share functionality not implemented yet")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image src={user.avatar || "/placeholder-avatar.png"} alt={user.username} width={40} height={40} />
        </div>
        <div className="flex flex-col">
          <Link href={`/profile/${entry.userId}`} className="font-semibold hover:underline">
            {user.username}
          </Link>
          <Link href={`/location/${entry.location.name}`} className="text-sm text-gray-500 hover:underline">
            {entry.location.name}, {entry.location.country}
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video">
          <Image
            src={entry.photos[0]?.url || "/placeholder.svg"}
            alt={entry.title}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{entry.title}</h3>
          <p className="mt-2">{entry.content}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleLike}>
              <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              <span className="ml-1">{likesCount}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
              <MessageCircle className="w-5 h-5" />
              <span className="ml-1">{comments.length}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
          <span className="text-sm text-gray-500">{format(new Date(entry.createdAt), "MMM d, yyyy")}</span>
        </div>
        {showComments && (
          <div className="w-full">
            <div className="mt-2 space-y-2">
              {comments.map((comment) => (
                <p key={comment.id} className="text-sm">
                  <span className="font-semibold">{comment.userId}</span> {comment.content}
                </p>
              ))}
            </div>
            <form onSubmit={handleAddComment} className="mt-2 flex gap-2">
              <Input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button type="submit">Post</Button>
            </form>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

