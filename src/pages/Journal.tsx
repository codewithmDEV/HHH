import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import { journalStore, intentionsStore } from '../lib/store'
import type { JournalEntry, Intention } from '../types'

const moods = [
  { key: 'grateful' as const, label: 'Grateful', emoji: '🌿' },
  { key: 'reflective' as const, label: 'Reflective', emoji: '🌙' },
  { key: 'striving' as const, label: 'Striving', emoji: '✦' },
  { key: 'peaceful' as const, label: 'Peaceful', emoji: '🕊' },
  { key: 'struggling' as const, label: 'Struggling', emoji: '🌧' },
]

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [intentions, setIntentions] = useState<Intention[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<JournalEntry['mood']>('reflective')
  const [linkedIntentionId, setLinkedIntentionId] = useState<string | null>(null)

  function refresh() {
    setEntries(journalStore.list())
    setIntentions(intentionsStore.list())
  }

  useEffect(() => {
    refresh()
  }, [])

  function handleSubmit() {
    if (!content.trim()) return
    journalStore.create({
      title: title.trim(),
      content: content.trim(),
      mood,
      linkedIntentionId,
    })
    setTitle('')
    setContent('')
    setMood('reflective')
    setLinkedIntentionId(null)
    setShowForm(false)
    refresh()
  }

  function remove(id: string) {
    journalStore.remove(id)
    refresh()
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Reflection Journal" subtitle="A quiet space to reflect and grow" />

      <div className="px-5">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full btn-primary flex items-center justify-center gap-2 mb-5"
        >
          <Icon name="edit" size={18} />
          <span>Write a Reflection</span>
        </button>

        {showForm && (
          <div className="card mb-5 animate-scale-in space-y-4">
            <input
              className="input-field"
              placeholder="Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="input-field min-h-[160px]"
              placeholder="What is on your heart today?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div>
              <label className="text-xs text-stone font-medium block mb-1.5">How are you feeling?</label>
              <div className="flex gap-2 flex-wrap">
                {moods.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMood(m.key)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      mood === m.key
                        ? 'bg-forest text-cream'
                        : 'bg-forest/5 text-stone border border-forest/10'
                    }`}
                  >
                    <span className="mr-1">{m.emoji}</span>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            {intentions.length > 0 && (
              <div>
                <label className="text-xs text-stone font-medium block mb-1.5">
                  Linked Intention (optional)
                </label>
                <select
                  className="input-field"
                  value={linkedIntentionId ?? ''}
                  onChange={(e) => setLinkedIntentionId(e.target.value || null)}
                >
                  <option value="">None</option>
                  {intentions.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={handleSubmit} className="btn-primary flex-1">
                Save Reflection
              </button>
              <button onClick={() => setShowForm(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </div>
        )}

        {entries.length === 0 && !showForm && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="journal" size={28} className="text-forest/40" />
            </div>
            <p className="text-stone text-sm">
              Your journal is empty. This is a space for honesty — not performance.
              Write when you're ready.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {entries.map((entry) => {
            const moodInfo = moods.find((m) => m.key === entry.mood)
            const linkedIntention = intentions.find((i) => i.id === entry.linkedIntentionId)
            return (
              <div key={entry.id} className="card animate-slide-up">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{moodInfo?.emoji}</span>
                    {entry.title && (
                      <h3 className="font-serif text-lg font-semibold text-forest">{entry.title}</h3>
                    )}
                  </div>
                  <button
                    onClick={() => remove(entry.id)}
                    className="text-stone/40 hover:text-red-400 transition-colors"
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </div>
                <p className="text-sm text-ink/80 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
                <div className="mt-3 pt-2 border-t border-forest/10 flex items-center justify-between">
                  <span className="text-xs text-stone">{formatDate(entry.createdAt)}</span>
                  {linkedIntention && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-clay/10 text-clay-dark">
                      {linkedIntention.title}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
