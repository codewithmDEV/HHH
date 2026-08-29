import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import { intentionsStore, nurtureStore } from '../lib/store'
import type { Intention } from '../types'

const categories = [
  { key: 'deen' as const, label: 'Deen', desc: 'Faith & worship' },
  { key: 'dunya' as const, label: 'Dunya', desc: 'Work & world' },
  { key: 'balance' as const, label: 'Balance', desc: 'Both worlds' },
]

export default function Intentions() {
  const [intentions, setIntentions] = useState<Intention[]>([])
  const [nurtureMap, setNurtureMap] = useState<Record<string, boolean>>({})
  const [logCountMap, setLogCountMap] = useState<Record<string, number>>({})
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<'deen' | 'dunya' | 'balance'>('balance')
  const [focusAreas, setFocusAreas] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function refresh() {
    try {
      const list = await intentionsStore.list()
      setIntentions(list)
      const nMap: Record<string, boolean> = {}
      const lMap: Record<string, number> = {}
      for (const i of list) {
        nMap[i.id] = await nurtureStore.isNurturedToday(i.id)
        lMap[i.id] = (await nurtureStore.forIntention(i.id)).length
      }
      setNurtureMap(nMap)
      setLogCountMap(lMap)
    } catch (e) {
      console.error('Failed to load intentions', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleSubmit() {
    if (!title.trim()) return
    try {
      await intentionsStore.create({
        title: title.trim(),
        description: description.trim(),
        category,
        focusAreas: focusAreas
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      })
      setTitle('')
      setDescription('')
      setFocusAreas('')
      setCategory('balance')
      setShowForm(false)
      refresh()
    } catch (e) {
      console.error('Failed to create intention', e)
    }
  }

  async function toggleNurture(id: string) {
    const today = new Date().toISOString().split('T')[0]
    try {
      await nurtureStore.toggle(id, today)
      refresh()
    } catch (e) {
      console.error('Failed to toggle nurture', e)
    }
  }

  async function markGrown(id: string) {
    const intention = intentions.find((i) => i.id === id)
    if (intention) {
      try {
        await intentionsStore.update(id, { isNurtured: !intention.isNurtured })
        refresh()
      } catch (e) {
        console.error('Failed to update intention', e)
      }
    }
  }

  async function remove(id: string) {
    try {
      await intentionsStore.remove(id)
      refresh()
    } catch (e) {
      console.error('Failed to remove intention', e)
    }
  }

  async function updateReflection(id: string, reflection: string) {
    try {
      await intentionsStore.update(id, { reflection })
    } catch (e) {
      console.error('Failed to update reflection', e)
    }
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Intentions" subtitle="Set intentions, nurture them gently" />
        <div className="px-5 text-center py-12">
          <Icon name="refresh" size={24} className="text-forest/40 animate-spin mx-auto mb-3" />
          <p className="text-stone text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Intentions"
        subtitle="Set intentions, nurture them gently"
        action={{ label: 'Set an Intention', to: '#', icon: 'plus' }}
      />

      <div className="px-5">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full btn-primary flex items-center justify-center gap-2 mb-5"
        >
          <Icon name="plus" size={18} />
          <span>Set an Intention</span>
        </button>

        {showForm && (
          <div className="card mb-5 animate-scale-in space-y-4">
            <div>
              <label className="text-xs text-stone font-medium block mb-1">What do you intend?</label>
              <input
                className="input-field"
                placeholder="e.g. Pray Fajr on time"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-stone font-medium block mb-1">Describe it</label>
              <textarea
                className="input-field min-h-[80px]"
                placeholder="Why does this matter to you?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-stone font-medium block mb-1.5">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setCategory(c.key)}
                    className={`p-2 rounded-xl text-center transition-all ${
                      category === c.key
                        ? 'bg-forest text-cream'
                        : 'bg-forest/5 text-stone border border-forest/10'
                    }`}
                  >
                    <p className="text-sm font-medium">{c.label}</p>
                    <p className="text-[10px] opacity-70">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-stone font-medium block mb-1">
                Focus Areas (comma-separated)
              </label>
              <input
                className="input-field"
                placeholder="e.g. Morning routine, Quran study"
                value={focusAreas}
                onChange={(e) => setFocusAreas(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSubmit} className="btn-primary flex-1">
                Set Intention
              </button>
              <button onClick={() => setShowForm(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </div>
        )}

        {intentions.length === 0 && !showForm && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="intention" size={28} className="text-forest/40" />
            </div>
            <p className="text-stone text-sm">
              No intentions yet. Set your first one — gently, without pressure.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {intentions.map((intention) => {
            const nurturedToday = nurtureMap[intention.id] ?? false
            const logCount = logCountMap[intention.id] ?? 0
            const isExpanded = expandedId === intention.id

            return (
              <div key={intention.id} className="card animate-slide-up">
                <div
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : intention.id)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleNurture(intention.id)
                    }}
                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      nurturedToday ? 'bg-clay text-cream' : 'bg-forest/10 text-forest/40'
                    }`}
                  >
                    <Icon name={nurturedToday ? 'check' : 'plus'} size={18} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg font-semibold text-forest">{intention.title}</h3>
                    {intention.description && (
                      <p className="text-xs text-stone mt-0.5 line-clamp-2">{intention.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-forest/10 text-forest capitalize">
                        {intention.category}
                      </span>
                      <span className="text-[10px] text-stone">{logCount} days nurtured</span>
                      {intention.isNurtured && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-clay/15 text-clay-dark">
                          I've grown in this
                        </span>
                      )}
                    </div>
                  </div>
                  <Icon
                    name={isExpanded ? 'close' : 'plus'}
                    size={16}
                    className="text-stone/50 shrink-0 mt-1"
                  />
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-forest/10 space-y-3 animate-fade-in">
                    {intention.focusAreas.length > 0 && (
                      <div>
                        <p className="text-xs text-stone font-medium mb-1.5">Focus Areas</p>
                        <div className="flex flex-wrap gap-1.5">
                          {intention.focusAreas.map((area, i) => (
                            <span
                              key={i}
                              className="text-xs px-2.5 py-1 rounded-full bg-moss/20 text-forest"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="text-xs text-stone font-medium block mb-1">
                        Reflection
                      </label>
                      <textarea
                        className="input-field min-h-[60px]"
                        placeholder="How have you grown in this?"
                        defaultValue={intention.reflection}
                        onBlur={(e) => {
                          if (e.target.value !== intention.reflection) {
                            updateReflection(intention.id, e.target.value)
                          }
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => markGrown(intention.id)}
                        className={`flex-1 text-sm rounded-xl px-3 py-2.5 font-medium transition-all ${
                          intention.isNurtured
                            ? 'bg-clay/15 text-clay-dark'
                            : 'bg-forest/5 text-forest border border-forest/10'
                        }`}
                      >
                        {intention.isNurtured ? "I've grown in this ✓" : "Mark: I've grown in this"}
                      </button>
                      <button
                        onClick={() => remove(intention.id)}
                        className="px-3 py-2.5 rounded-xl bg-red-50 text-red-500 border border-red-100"
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
