export type Intention = {
  id: string
  title: string
  description: string
  category: 'deen' | 'dunya' | 'balance'
  focusAreas: string[]
  reflection: string
  isNurtured: boolean
  createdAt: string
  updatedAt: string
}

export type NurtureLog = {
  id: string
  intentionId: string
  logDate: string
  note: string
  createdAt: string
}

export type SalahLog = {
  id: string
  logDate: string
  fajr: boolean
  dhuhr: boolean
  asr: boolean
  maghrib: boolean
  isha: boolean
  note: string
  createdAt: string
}

export type JournalEntry = {
  id: string
  title: string
  content: string
  mood: 'grateful' | 'reflective' | 'striving' | 'peaceful' | 'struggling'
  linkedIntentionId: string | null
  createdAt: string
}

export type CommunityPost = {
  id: string
  authorName: string
  content: string
  category: 'reflection' | 'question' | 'encouragement' | 'experience'
  hearts: number
  createdAt: string
}

export type Sponsorship = {
  id: string
  orphanageName: string
  orphanageLocation: string
  amount: number
  frequency: 'monthly' | 'one_time'
  isActive: boolean
  startedAt: string
  note: string
}

export type GuidanceChat = {
  id: string
  question: string
  response: string
  sources: string[]
  createdAt: string
}
