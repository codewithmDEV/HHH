import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import { communityStore } from '../lib/store'
import type { CommunityPost } from '../types'

const categories = [
  { key: 'reflection' as const, label: 'Reflection', icon: 'moon' },
  { key: 'question' as const, label: 'Question', icon: 'lightbulb' },
  { key: 'encouragement' as const, label: 'Encouragement', icon: 'heart' },
  { key: 'experience' as const, label: 'Experience', icon: 'star' },
]

const seedPosts: Omit<CommunityPost, 'id' | 'createdAt'>[] = [
  {
    authorName: 'Aisha',
    content: 'Today I felt overwhelmed with school and work, but I remembered that Allah does not burden a soul beyond what it can bear. That gave me peace to keep going.',
    category: 'reflection',
    hearts: 12,
  },
  {
    authorName: 'Yusuf',
    content: 'Does anyone have advice on finding halal freelance work while studying? I want to start earning but I\'m not sure where to begin.',
    category: 'question',
    hearts: 8,
  },
  {
    authorName: 'Maryam',
    content: 'You are not behind in life. Allah\'s timing is perfect. Keep making du\'a and trust the process. Every step toward Him is a step in the right direction.',
    category: 'encouragement',
    hearts: 24,
  },
  {
    authorName: 'Bilal',
    content: 'I started waking up for Fajr consistently this month. The quiet of those early mornings has become the most peaceful part of my day. May Allah make it easy for all of you too.',
    category: 'experience',
    hearts: 31,
  },
]

export default function Community() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [showForm, setShowForm] = useState(false)
  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<CommunityPost['category']>('reflection')

  function refresh() {
    const existing = communityStore.list()
    if (existing.length === 0) {
      seedPosts.forEach((p) => communityStore.create(p))
    }
    setPosts(communityStore.list())
  }

  useEffect(() => {
    refresh()
  }, [])

  function handleSubmit() {
    if (!content.trim() || !authorName.trim()) return
    communityStore.create({
      authorName: authorName.trim(),
      content: content.trim(),
      category,
    })
    setAuthorName('')
    setContent('')
    setCategory('reflection')
    setShowForm(false)
    refresh()
  }

  function heart(id: string) {
    communityStore.heart(id)
    refresh()
  }

  function formatTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Community" subtitle="Share, learn, and grow together" />

      <div className="px-5">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full btn-primary flex items-center justify-center gap-2 mb-5"
        >
          <Icon name="edit" size={18} />
          <span>Share a Post</span>
        </button>

        {showForm && (
          <div className="card mb-5 animate-scale-in space-y-4">
            <div>
              <label className="text-xs text-stone font-medium block mb-1">Your name (or a nickname)</label>
              <input
                className="input-field"
                placeholder="e.g. Aisha"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-stone font-medium block mb-1.5">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setCategory(c.key)}
                    className={`p-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                      category === c.key
                        ? 'bg-forest text-cream'
                        : 'bg-forest/5 text-stone border border-forest/10'
                    }`}
                  >
                    <Icon name={c.icon} size={14} />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              className="input-field min-h-[120px]"
              placeholder="Share your reflection, question, or encouragement..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={handleSubmit} className="btn-primary flex-1">
                Share
              </button>
              <button onClick={() => setShowForm(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {posts.map((post) => {
            const catInfo = categories.find((c) => c.key === post.category)
            return (
              <div key={post.id} className="card animate-slide-up">
                <div className="flex items-start gap-3 mb-2">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center">
                    <Icon name={catInfo?.icon || 'community'} size={18} className="text-forest" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm text-forest">{post.authorName}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-moss/20 text-forest/70">
                        {catInfo?.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone">{formatTime(post.createdAt)}</p>
                  </div>
                </div>
                <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                <button
                  onClick={() => heart(post.id)}
                  className="mt-3 flex items-center gap-1.5 text-stone hover:text-clay transition-colors"
                >
                  <Icon name="heart" size={16} />
                  <span className="text-xs">{post.hearts}</span>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
