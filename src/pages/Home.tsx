import { useState, useEffect } from 'react'
import FeatureCard from '../components/FeatureCard'
import Icon from '../components/Icon'
import { salahStore, intentionsStore, nurtureStore } from '../lib/store'

const reflections = [
  'The one who walks with Allah in private will be carried by Him in public.',
  'Your ambition and your prayer are not at odds — they are both conversations with the One who gave you both.',
  'The sweetness of faith comes not from perfection, but from returning — again and again.',
  'Build as if the world depends on you, and pray as if everything depends on Him.',
  'Every intention you set is a seed. Every time you return to it, you water it.',
  'You are not behind. You are exactly where Allah meant for you to be — right now.',
]

export default function Home() {
  const [reflection] = useState(() => {
    const day = Math.floor(Date.now() / 86400000)
    return reflections[day % reflections.length]
  })
  const [salahToday, setSalahToday] = useState(0)
  const [totalSalah, setTotalSalah] = useState(0)
  const [activeIntentions, setActiveIntentions] = useState(0)
  const [nurturedToday, setNurturedToday] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const today = await salahStore.getToday()
        if (today) {
          setSalahToday([today.fajr, today.dhuhr, today.asr, today.maghrib, today.isha].filter(Boolean).length)
        }
        const salahHistory = await salahStore.list()
        setTotalSalah(salahHistory.length)
        const intentions = await intentionsStore.list()
        setActiveIntentions(intentions.length)
        let nurturedCount = 0
        for (const i of intentions) {
          if (await nurtureStore.isNurturedToday(i.id)) nurturedCount++
        }
        setNurturedToday(nurturedCount)
      } catch (e) {
        console.error('Failed to load home data', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 5) return 'A quiet night to return to'
    if (h < 12) return 'A blessed morning'
    if (h < 17) return 'A peaceful afternoon'
    if (h < 20) return 'A gentle evening'
    return 'A still night'
  })()

  return (
    <div className="px-5 pt-8 pb-4 animate-fade-in">
      <div className="mb-6">
        <p className="text-stone text-sm">{greeting}</p>
        <h1 className="text-3xl text-forest font-serif font-bold mt-1">Your Space</h1>
      </div>

      <div className="card-forest mb-5 animate-slide-up">
        <div className="flex items-start gap-2">
          <Icon name="sparkle" size={18} className="text-clay-light shrink-0 mt-1" />
          <p className="font-serif text-lg leading-relaxed text-cream/95 italic">{reflection}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="salah" size={16} className="text-clay" />
            <span className="text-xs text-stone font-medium">Salah Today</span>
          </div>
          <p className="text-2xl font-serif font-bold text-forest">{loading ? '—' : `${salahToday}/5`}</p>
          <p className="text-xs text-stone mt-0.5">{loading ? '...' : `${totalSalah} days nurtured`}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="intention" size={16} className="text-clay" />
            <span className="text-xs text-stone font-medium">Intentions</span>
          </div>
          <p className="text-2xl font-serif font-bold text-forest">{loading ? '—' : activeIntentions}</p>
          <p className="text-xs text-stone mt-0.5">{loading ? '...' : `${nurturedToday} nurtured today`}</p>
        </div>
      </div>

      <h2 className="text-lg text-forest font-serif font-semibold mb-3">Explore</h2>
      <div className="space-y-3">
        <FeatureCard
          to="/guidance"
          icon="guidance"
          label="Seek Guidance"
          description="Ask and find answers rooted in Quran and Sunnah"
          accent
        />
        <div className="grid grid-cols-2 gap-3">
          <FeatureCard to="/income" icon="income" label="Halal Income" description="Learn and brainstorm" />
          <FeatureCard to="/orphan" icon="orphan" label="Sponsorship" description="Care for orphans" />
          <FeatureCard to="/quran" icon="quran" label="Quran Reader" description="Read and reflect" />
          <FeatureCard to="/community" icon="community" label="Community" description="Share and grow together" />
        </div>
      </div>
    </div>
  )
}
