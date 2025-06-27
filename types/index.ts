export interface Note {
  id: string
  components: Array<{
    type: "title" | "text" | "video" | "image" | "divider"
    content: string
    order: number
  }>
  color: string
  x: number
  y: number
  width: number
  height: number
  severity: "mild" | "moderate" | "serious" | "critical" | "nuclear"
  scoldingType: "custom" | "bolimaga" | "horri" | "nin_saaya" | "nin_bojja"
  customScolding?: string
  pinId?: string
  reactions: Array<{ emoji: string; count: number }>
  comments: Array<{
    id: string
    text: string
    author: string
    timestamp: number
    reactions: Array<{ emoji: string; count: number }>
  }>
  commentsExpanded: boolean
  timestamp: number
}

export interface Pin {
  id: string
  name: string
  color: string
  x: number
  y: number
}
