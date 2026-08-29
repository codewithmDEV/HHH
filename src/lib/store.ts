import type {
  Intention,
  NurtureLog,
  SalahLog,
  JournalEntry,
  CommunityPost,
  Sponsorship,
  GuidanceChat,
} from '../types'

const PREFIX = 'hhh_'

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function write<T>(key: string, data: T[]): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(data))
}

function uid(): string {
  return crypto.randomUUID()
}

function now(): string {
  return new Date().toISOString()
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

// ---- Intentions ----

export const intentionsStore = {
  list(): Intention[] {
    return read<Intention>('intentions').sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  },
  create(data: Pick<Intention, 'title' | 'description' | 'category' | 'focusAreas'>): Intention {
    const item: Intention = {
      id: uid(),
      title: data.title,
      description: data.description,
      category: data.category,
      focusAreas: data.focusAreas,
      reflection: '',
      isNurtured: false,
      createdAt: now(),
      updatedAt: now(),
    }
    const all = read<Intention>('intentions')
    all.push(item)
    write('intentions', all)
    return item
  },
  update(id: string, patch: Partial<Intention>): void {
    const all = read<Intention>('intentions')
    const idx = all.findIndex((i) => i.id === id)
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...patch, updatedAt: now() }
      write('intentions', all)
    }
  },
  remove(id: string): void {
    write(
      'intentions',
      read<Intention>('intentions').filter((i) => i.id !== id),
    )
  },
}

// ---- Nurture Log ----

export const nurtureStore = {
  list(): NurtureLog[] {
    return read<NurtureLog>('nurture_log').sort(
      (a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime(),
    )
  },
  forIntention(intentionId: string): NurtureLog[] {
    return read<NurtureLog>('nurture_log')
      .filter((l) => l.intentionId === intentionId)
      .sort((a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime())
  },
  toggle(intentionId: string, logDate: string, note = ''): void {
    const all = read<NurtureLog>('nurture_log')
    const existing = all.find((l) => l.intentionId === intentionId && l.logDate === logDate)
    if (existing) {
      write('nurture_log', all.filter((l) => l.id !== existing.id))
    } else {
      all.push({ id: uid(), intentionId, logDate, note, createdAt: now() })
      write('nurture_log', all)
    }
  },
  isNurturedToday(intentionId: string): boolean {
    const today = todayStr()
    return read<NurtureLog>('nurture_log').some(
      (l) => l.intentionId === intentionId && l.logDate === today,
    )
  },
}

// ---- Salah Log ----

export const salahStore = {
  list(): SalahLog[] {
    return read<SalahLog>('salah_log').sort(
      (a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime(),
    )
  },
  getToday(): SalahLog | null {
    const today = todayStr()
    return read<SalahLog>('salah_log').find((l) => l.logDate === today) || null
  },
  upsertToday(patch: Partial<Omit<SalahLog, 'id' | 'logDate' | 'createdAt'>>): SalahLog {
    const all = read<SalahLog>('salah_log')
    const today = todayStr()
    let entry = all.find((l) => l.logDate === today)
    if (entry) {
      entry = { ...entry, ...patch }
      write('salah_log', all.map((l) => (l.id === entry!.id ? entry! : l)))
      return entry
    }
    const newEntry: SalahLog = {
      id: uid(),
      logDate: today,
      fajr: patch.fajr ?? false,
      dhuhr: patch.dhuhr ?? false,
      asr: patch.asr ?? false,
      maghrib: patch.maghrib ?? false,
      isha: patch.isha ?? false,
      note: patch.note ?? '',
      createdAt: now(),
    }
    all.push(newEntry)
    write('salah_log', all)
    return newEntry
  },
}

// ---- Journal ----

export const journalStore = {
  list(): JournalEntry[] {
    return read<JournalEntry>('journal_entries').sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  },
  create(data: Pick<JournalEntry, 'title' | 'content' | 'mood' | 'linkedIntentionId'>): JournalEntry {
    const item: JournalEntry = {
      id: uid(),
      title: data.title,
      content: data.content,
      mood: data.mood,
      linkedIntentionId: data.linkedIntentionId,
      createdAt: now(),
    }
    const all = read<JournalEntry>('journal_entries')
    all.push(item)
    write('journal_entries', all)
    return item
  },
  remove(id: string): void {
    write('journal_entries', read<JournalEntry>('journal_entries').filter((e) => e.id !== id))
  },
}

// ---- Community ----

export const communityStore = {
  list(): CommunityPost[] {
    return read<CommunityPost>('community_posts').sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  },
  create(data: Pick<CommunityPost, 'authorName' | 'content' | 'category'>): CommunityPost {
    const item: CommunityPost = {
      id: uid(),
      authorName: data.authorName,
      content: data.content,
      category: data.category,
      hearts: 0,
      createdAt: now(),
    }
    const all = read<CommunityPost>('community_posts')
    all.push(item)
    write('community_posts', all)
    return item
  },
  heart(id: string): void {
    const all = read<CommunityPost>('community_posts')
    const item = all.find((p) => p.id === id)
    if (item) {
      item.hearts += 1
      write('community_posts', all)
    }
  },
}

// ---- Sponsorships ----

export const sponsorshipStore = {
  list(): Sponsorship[] {
    return read<Sponsorship>('sponsorships').sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    )
  },
  create(data: Pick<Sponsorship, 'orphanageName' | 'orphanageLocation' | 'amount' | 'frequency' | 'note'>): Sponsorship {
    const item: Sponsorship = {
      id: uid(),
      orphanageName: data.orphanageName,
      orphanageLocation: data.orphanageLocation,
      amount: data.amount,
      frequency: data.frequency,
      isActive: true,
      startedAt: now(),
      note: data.note,
    }
    const all = read<Sponsorship>('sponsorships')
    all.push(item)
    write('sponsorships', all)
    return item
  },
  toggleActive(id: string): void {
    const all = read<Sponsorship>('sponsorships')
    const item = all.find((s) => s.id === id)
    if (item) {
      item.isActive = !item.isActive
      write('sponsorships', all)
    }
  },
  remove(id: string): void {
    write('sponsorships', read<Sponsorship>('sponsorships').filter((s) => s.id !== id))
  },
}

// ---- Guidance Chats ----

export const guidanceStore = {
  list(): GuidanceChat[] {
    return read<GuidanceChat>('guidance_chats').sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  },
  create(data: Pick<GuidanceChat, 'question' | 'response' | 'sources'>): GuidanceChat {
    const item: GuidanceChat = {
      id: uid(),
      question: data.question,
      response: data.response,
      sources: data.sources,
      createdAt: now(),
    }
    const all = read<GuidanceChat>('guidance_chats')
    all.push(item)
    write('guidance_chats', all)
    return item
  },
  clear(): void {
    write('guidance_chats', [])
  },
}
