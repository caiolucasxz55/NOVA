export interface Playlist {
  id: string
  title: string
  description: string
  genre: string
  image: string
  url: string
}

export interface Movie {
  id: string
  title: string
  description: string
  genre: string
  image: string
  year: number
}

export interface Book {
  id: string
  title: string
  author: string
  description: string
  category: string
  image: string
}
