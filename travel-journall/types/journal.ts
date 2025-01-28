export interface Location {
  name: string
  state?: string
  country: string
}

export interface Photo {
  url: string
  caption?: string
}

export interface JournalEntry {
  id: string
  userId: string
  title: string
  content: string
  location: Location
  photos: Photo[]
  createdAt: Date
  updatedAt: Date
}

