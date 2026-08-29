import { supabase } from './supabase'
import type {
  Intention,
  NurtureLog,
  SalahLog,
  JournalEntry,
  CommunityPost,
  Sponsorship,
  GuidanceChat,
} from '../types'

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

// ---- Intentions ----

export const intentionsStore = {
  async list(): Promise<Intention[]> {
    const { data, error } = await supabase
      .from('intentions')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []).map(mapIntention)
  },

  async create(data: Pick<Intention, 'title' | 'description' | 'category' | 'focusAreas'>): Promise<Intention> {
    const { data: row, error } = await supabase
      .from('intentions')
      .insert({
        title: data.title,
        description: data.description,
        category: data.category,
        focus_areas: data.focusAreas,
      })
      .select()
      .single()
    if (error) throw error
    return mapIntention(row)
  },

  async update(id: string, patch: Partial<Intention>): Promise<void> {
    const dbPatch: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (patch.title !== undefined) dbPatch.title = patch.title
    if (patch.description !== undefined) dbPatch.description = patch.description
    if (patch.category !== undefined) dbPatch.category = patch.category
    if (patch.focusAreas !== undefined) dbPatch.focus_areas = patch.focusAreas
    if (patch.reflection !== undefined) dbPatch.reflection = patch.reflection
    if (patch.isNurtured !== undefined) dbPatch.is_nurtured = patch.isNurtured
    const { error } = await supabase.from('intentions').update(dbPatch).eq('id', id)
    if (error) throw error
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('intentions').delete().eq('id', id)
    if (error) throw error
  },
}

// ---- Nurture Log ----

export const nurtureStore = {
  async list(): Promise<NurtureLog[]> {
    const { data, error } = await supabase
      .from('nurture_log')
      .select('*')
      .order('log_date', { ascending: false })
    if (error) throw error
    return (data || []).map(mapNurtureLog)
  },

  async forIntention(intentionId: string): Promise<NurtureLog[]> {
    const { data, error } = await supabase
      .from('nurture_log')
      .select('*')
      .eq('intention_id', intentionId)
      .order('log_date', { ascending: false })
    if (error) throw error
    return (data || []).map(mapNurtureLog)
  },

  async toggle(intentionId: string, logDate: string, note = ''): Promise<void> {
    const { data: existing, error: findErr } = await supabase
      .from('nurture_log')
      .select('id')
      .eq('intention_id', intentionId)
      .eq('log_date', logDate)
      .maybeSingle()
    if (findErr) throw findErr

    if (existing) {
      const { error } = await supabase.from('nurture_log').delete().eq('id', existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('nurture_log')
        .insert({ intention_id: intentionId, log_date: logDate, note })
      if (error) throw error
    }
  },

  async isNurturedToday(intentionId: string): Promise<boolean> {
    const today = todayStr()
    const { data, error } = await supabase
      .from('nurture_log')
      .select('id')
      .eq('intention_id', intentionId)
      .eq('log_date', today)
      .maybeSingle()
    if (error) throw error
    return !!data
  },
}

// ---- Salah Log ----

export const salahStore = {
  async list(): Promise<SalahLog[]> {
    const { data, error } = await supabase
      .from('salah_log')
      .select('*')
      .order('log_date', { ascending: false })
    if (error) throw error
    return (data || []).map(mapSalahLog)
  },

  async getToday(): Promise<SalahLog | null> {
    const today = todayStr()
    const { data, error } = await supabase
      .from('salah_log')
      .select('*')
      .eq('log_date', today)
      .maybeSingle()
    if (error) throw error
    return data ? mapSalahLog(data) : null
  },

  async upsertToday(patch: Partial<Omit<SalahLog, 'id' | 'logDate' | 'createdAt'>>): Promise<SalahLog> {
    const today = todayStr()
    const { data: existing, error: findErr } = await supabase
      .from('salah_log')
      .select('*')
      .eq('log_date', today)
      .maybeSingle()
    if (findErr) throw findErr

    if (existing) {
      const updateData: Record<string, unknown> = {}
      if (patch.fajr !== undefined) updateData.fajr = patch.fajr
      if (patch.dhuhr !== undefined) updateData.dhuhr = patch.dhuhr
      if (patch.asr !== undefined) updateData.asr = patch.asr
      if (patch.maghrib !== undefined) updateData.maghrib = patch.maghrib
      if (patch.isha !== undefined) updateData.isha = patch.isha
      if (patch.note !== undefined) updateData.note = patch.note
      const { data: row, error } = await supabase
        .from('salah_log')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single()
      if (error) throw error
      return mapSalahLog(row)
    }

    const { data: row, error } = await supabase
      .from('salah_log')
      .insert({
        log_date: today,
        fajr: patch.fajr ?? false,
        dhuhr: patch.dhuhr ?? false,
        asr: patch.asr ?? false,
        maghrib: patch.maghrib ?? false,
        isha: patch.isha ?? false,
        note: patch.note ?? '',
      })
      .select()
      .single()
    if (error) throw error
    return mapSalahLog(row)
  },
}

// ---- Journal ----

export const journalStore = {
  async list(): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []).map(mapJournalEntry)
  },

  async create(data: Pick<JournalEntry, 'title' | 'content' | 'mood' | 'linkedIntentionId'>): Promise<JournalEntry> {
    const { data: row, error } = await supabase
      .from('journal_entries')
      .insert({
        title: data.title,
        content: data.content,
        mood: data.mood,
        linked_intention_id: data.linkedIntentionId,
      })
      .select()
      .single()
    if (error) throw error
    return mapJournalEntry(row)
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('journal_entries').delete().eq('id', id)
    if (error) throw error
  },
}

// ---- Community ----

export const communityStore = {
  async list(): Promise<CommunityPost[]> {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []).map(mapCommunityPost)
  },

  async create(data: Pick<CommunityPost, 'authorName' | 'content' | 'category'>): Promise<CommunityPost> {
    const { data: row, error } = await supabase
      .from('community_posts')
      .insert({
        author_name: data.authorName,
        content: data.content,
        category: data.category,
      })
      .select()
      .single()
    if (error) throw error
    return mapCommunityPost(row)
  },

  async heart(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_hearts', { post_id: id })
    if (error) throw error
  },
}

// ---- Sponsorships ----

export const sponsorshipStore = {
  async list(): Promise<Sponsorship[]> {
    const { data, error } = await supabase
      .from('sponsorships')
      .select('*')
      .order('started_at', { ascending: false })
    if (error) throw error
    return (data || []).map(mapSponsorship)
  },

  async create(data: Pick<Sponsorship, 'orphanageName' | 'orphanageLocation' | 'amount' | 'frequency' | 'note'>): Promise<Sponsorship> {
    const { data: row, error } = await supabase
      .from('sponsorships')
      .insert({
        orphanage_name: data.orphanageName,
        orphanage_location: data.orphanageLocation,
        amount: data.amount,
        frequency: data.frequency,
        note: data.note,
      })
      .select()
      .single()
    if (error) throw error
    return mapSponsorship(row)
  },

  async toggleActive(id: string): Promise<void> {
    const { data: row, error: fetchErr } = await supabase
      .from('sponsorships')
      .select('is_active')
      .eq('id', id)
      .maybeSingle()
    if (fetchErr) throw fetchErr
    if (!row) return
    const { error } = await supabase
      .from('sponsorships')
      .update({ is_active: !row.is_active })
      .eq('id', id)
    if (error) throw error
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('sponsorships').delete().eq('id', id)
    if (error) throw error
  },
}

// ---- Guidance Chats ----

export const guidanceStore = {
  async list(): Promise<GuidanceChat[]> {
    const { data, error } = await supabase
      .from('guidance_chats')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []).map(mapGuidanceChat)
  },

  async create(data: Pick<GuidanceChat, 'question' | 'response' | 'sources'>): Promise<GuidanceChat> {
    const { data: row, error } = await supabase
      .from('guidance_chats')
      .insert({
        question: data.question,
        response: data.response,
        sources: data.sources,
      })
      .select()
      .single()
    if (error) throw error
    return mapGuidanceChat(row)
  },

  async clear(): Promise<void> {
    const { error } = await supabase.from('guidance_chats').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) throw error
  },
}

// ---- Mappers (DB snake_case -> app camelCase) ----

function mapIntention(row: Record<string, unknown>): Intention {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    category: row.category as Intention['category'],
    focusAreas: (row.focus_areas as string[]) || [],
    reflection: (row.reflection as string) || '',
    isNurtured: (row.is_nurtured as boolean) || false,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

function mapNurtureLog(row: Record<string, unknown>): NurtureLog {
  return {
    id: row.id as string,
    intentionId: row.intention_id as string,
    logDate: row.log_date as string,
    note: (row.note as string) || '',
    createdAt: row.created_at as string,
  }
}

function mapSalahLog(row: Record<string, unknown>): SalahLog {
  return {
    id: row.id as string,
    logDate: row.log_date as string,
    fajr: (row.fajr as boolean) || false,
    dhuhr: (row.dhuhr as boolean) || false,
    asr: (row.asr as boolean) || false,
    maghrib: (row.maghrib as boolean) || false,
    isha: (row.isha as boolean) || false,
    note: (row.note as string) || '',
    createdAt: row.created_at as string,
  }
}

function mapJournalEntry(row: Record<string, unknown>): JournalEntry {
  return {
    id: row.id as string,
    title: (row.title as string) || '',
    content: row.content as string,
    mood: row.mood as JournalEntry['mood'],
    linkedIntentionId: (row.linked_intention_id as string) || null,
    createdAt: row.created_at as string,
  }
}

function mapCommunityPost(row: Record<string, unknown>): CommunityPost {
  return {
    id: row.id as string,
    authorName: row.author_name as string,
    content: row.content as string,
    category: row.category as CommunityPost['category'],
    hearts: (row.hearts as number) || 0,
    createdAt: row.created_at as string,
  }
}

function mapSponsorship(row: Record<string, unknown>): Sponsorship {
  return {
    id: row.id as string,
    orphanageName: row.orphanage_name as string,
    orphanageLocation: (row.orphanage_location as string) || '',
    amount: Number(row.amount) || 0,
    frequency: row.frequency as Sponsorship['frequency'],
    isActive: (row.is_active as boolean) ?? true,
    startedAt: row.started_at as string,
    note: (row.note as string) || '',
  }
}

function mapGuidanceChat(row: Record<string, unknown>): GuidanceChat {
  return {
    id: row.id as string,
    question: row.question as string,
    response: row.response as string,
    sources: (row.sources as string[]) || [],
    createdAt: row.created_at as string,
  }
}
