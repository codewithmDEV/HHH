import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import { sponsorshipStore } from '../lib/store'
import type { Sponsorship } from '../types'

const featuredOrphanages = [
  {
    name: 'Al-Noor Orphanage',
    location: 'Istanbul, Türkiye',
    description: 'Provides shelter, education, and care for 45 children who have lost their parents.',
    suggestedAmount: 50,
  },
  {
    name: 'Dar Al-Yateem',
    location: 'Cairo, Egypt',
    description: 'Home to 60 orphans, providing food, schooling, and emotional support.',
    suggestedAmount: 40,
  },
  {
    name: 'House of Hope',
    location: 'Jakarta, Indonesia',
    description: 'Supports 80 children with education, healthcare, and daily needs.',
    suggestedAmount: 35,
  },
  {
    name: 'Rahma Children\'s Home',
    location: 'Dhaka, Bangladesh',
    description: 'Caring for 120 orphans with a focus on education and Quran memorization.',
    suggestedAmount: 30,
  },
]

export default function Orphan() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedOrphanage, setSelectedOrphanage] = useState<typeof featuredOrphanages[0] | null>(null)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState<'monthly' | 'one_time'>('monthly')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  async function refresh() {
    try {
      setSponsorships(await sponsorshipStore.list())
    } catch (e) {
      console.error('Failed to load sponsorships', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  function openForm(orphanage?: typeof featuredOrphanages[0]) {
    if (orphanage) {
      setSelectedOrphanage(orphanage)
      setName(orphanage.name)
      setLocation(orphanage.location)
      setAmount(String(orphanage.suggestedAmount))
    } else {
      setSelectedOrphanage(null)
      setName('')
      setLocation('')
      setAmount('')
    }
    setFrequency('monthly')
    setNote('')
    setShowForm(true)
  }

  async function handleSubmit() {
    const amt = parseFloat(amount)
    if (!name.trim() || isNaN(amt) || amt <= 0) return
    setSubmitting(true)
    try {
      await sponsorshipStore.create({
        orphanageName: name.trim(),
        orphanageLocation: location.trim(),
        amount: amt,
        frequency,
        note: note.trim(),
      })
      setShowForm(false)
      setName('')
      setLocation('')
      setAmount('')
      setNote('')
      refresh()
    } catch (e) {
      console.error('Failed to create sponsorship', e)
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleActive(id: string) {
    try {
      await sponsorshipStore.toggleActive(id)
      refresh()
    } catch (e) {
      console.error('Failed to toggle sponsorship', e)
    }
  }

  async function remove(id: string) {
    try {
      await sponsorshipStore.remove(id)
      refresh()
    } catch (e) {
      console.error('Failed to remove sponsorship', e)
    }
  }

  const totalMonthly = sponsorships
    .filter((s) => s.isActive && s.frequency === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0)

  if (loading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Orphan Sponsorship" subtitle="Care for those who need it most" />
        <div className="px-5 text-center py-12">
          <Icon name="refresh" size={24} className="text-forest/40 animate-spin mx-auto mb-3" />
          <p className="text-stone text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Orphan Sponsorship" subtitle="Care for those who need it most" />

      <div className="px-5">
        <div className="card-forest mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="orphan" size={20} className="text-clay-light" />
            <h3 className="font-serif text-lg font-semibold text-cream">Your Sponsorships</h3>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-cream/70 text-sm">Monthly giving</p>
              <p className="text-3xl font-serif font-bold text-cream">${totalMonthly}</p>
            </div>
            <div className="text-right">
              <p className="text-cream/70 text-sm">Active</p>
              <p className="text-3xl font-serif font-bold text-cream">
                {sponsorships.filter((s) => s.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-sm text-stone mb-3 italic">
            "I and the caretaker of an orphan will be in Paradise like this" — and he held up his two fingers
            together. (Sahih Bukhari)
          </p>
        </div>

        {showForm && (
          <div className="card mb-5 animate-scale-in space-y-4">
            <div>
              <label className="text-xs text-stone font-medium block mb-1">Orphanage Name</label>
              <input
                className="input-field"
                placeholder="Orphanage name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-stone font-medium block mb-1">Location</label>
              <input
                className="input-field"
                placeholder="City, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-stone font-medium block mb-1">Amount ($)</label>
              <input
                className="input-field"
                type="number"
                placeholder="50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-stone font-medium block mb-1.5">Frequency</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFrequency('monthly')}
                  className={`p-2.5 rounded-xl text-sm font-medium transition-all ${
                    frequency === 'monthly'
                      ? 'bg-forest text-cream'
                      : 'bg-forest/5 text-stone border border-forest/10'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setFrequency('one_time')}
                  className={`p-2.5 rounded-xl text-sm font-medium transition-all ${
                    frequency === 'one_time'
                      ? 'bg-forest text-cream'
                      : 'bg-forest/5 text-stone border border-forest/10'
                  }`}
                >
                  One Time
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-stone font-medium block mb-1">Note (optional)</label>
              <textarea
                className="input-field min-h-[60px]"
                placeholder="Any details or intentions..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1 disabled:opacity-50">
                {submitting ? 'Saving...' : 'Begin Sponsorship'}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </div>
        )}

        {sponsorships.length > 0 && (
          <div className="mb-5">
            <h3 className="text-lg text-forest font-serif font-semibold mb-3">Your Sponsorships</h3>
            <div className="space-y-2">
              {sponsorships.map((s) => (
                <div key={s.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-forest">{s.orphanageName}</h4>
                      {s.orphanageLocation && (
                        <p className="text-xs text-stone mt-0.5 flex items-center gap-1">
                          <Icon name="globe" size={12} />
                          {s.orphanageLocation}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-serif font-semibold text-clay-dark">
                          ${s.amount}
                        </span>
                        <span className="text-xs text-stone">
                          {s.frequency === 'monthly' ? '/month' : 'one time'}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            s.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-stone/10 text-stone'
                          }`}
                        >
                          {s.isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>
                      {s.note && <p className="text-xs text-stone mt-2 italic">{s.note}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => toggleActive(s.id)}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-forest/5 text-forest border border-forest/10"
                      >
                        {s.isActive ? 'Pause' : 'Resume'}
                      </button>
                      <button
                        onClick={() => remove(s.id)}
                        className="text-stone/40 hover:text-red-400 transition-colors px-2.5 py-1.5"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h3 className="text-lg text-forest font-serif font-semibold mb-3">Featured Orphanages</h3>
        <div className="space-y-3">
          {featuredOrphanages.map((orphanage, i) => (
            <div key={i} className="card animate-slide-up">
              <h4 className="font-serif text-lg font-semibold text-forest">{orphanage.name}</h4>
              <p className="text-xs text-stone flex items-center gap-1 mt-0.5">
                <Icon name="globe" size={12} />
                {orphanage.location}
              </p>
              <p className="text-sm text-ink/70 mt-2 leading-relaxed">{orphanage.description}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-forest/10">
                <span className="text-sm text-clay-dark font-medium">
                  From ${orphanage.suggestedAmount}/month
                </span>
                <button
                  onClick={() => openForm(orphanage)}
                  className="btn-clay !px-4 !py-2 text-xs"
                >
                  Sponsor
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => openForm()}
          className="w-full btn-ghost mt-4 flex items-center justify-center gap-2"
        >
          <Icon name="plus" size={16} />
          <span>Add Custom Sponsorship</span>
        </button>
      </div>
    </div>
  )
}
