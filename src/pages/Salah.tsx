import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import { salahStore } from '../lib/store'
import type { SalahLog } from '../types'

const prayers = [
  { key: 'fajr', label: 'Fajr', time: 'Dawn', icon: 'sun' },
  { key: 'dhuhr', label: 'Dhuhr', time: 'Midday', icon: 'sun' },
  { key: 'asr', label: 'Asr', time: 'Afternoon', icon: 'sun' },
  { key: 'maghrib', label: 'Maghrib', time: 'Sunset', icon: 'moon' },
  { key: 'isha', label: 'Isha', time: 'Night', icon: 'moon' },
] as const

export default function Salah() {
  const [today, setToday] = useState<SalahLog | null>(null)
  const [history, setHistory] = useState<SalahLog[]>([])

  function refresh() {
    setToday(salahStore.getToday())
    setHistory(salahStore.list().slice(0, 14))
  }

  useEffect(() => {
    refresh()
  }, [])

  function toggle(key: keyof Pick<SalahLog, 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'>) {
    const current = today ?? salahStore.upsertToday({})
    const newVal = !current[key]
    salahStore.upsertToday({ [key]: newVal })
    refresh()
  }

  const completedCount = today
    ? [today.fajr, today.dhuhr, today.asr, today.maghrib, today.isha].filter(Boolean).length
    : 0

  return (
    <div className="animate-fade-in">
      <PageHeader title="Salah Tracker" subtitle="A gentle record of your daily prayers" />

      <div className="px-5">
        <div className="card-forest mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-cream/70 text-sm">Today</p>
              <p className="text-3xl font-serif font-bold text-cream">
                {completedCount}/5
              </p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-cream/20 flex items-center justify-center">
              <span className="text-cream font-serif text-lg">{Math.round((completedCount / 5) * 100)}%</span>
            </div>
          </div>
          <div className="space-y-2">
            {prayers.map((p) => {
              const isDone = today?.[p.key] ?? false
              return (
                <button
                  key={p.key}
                  onClick={() => toggle(p.key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all active:scale-[0.98] ${
                    isDone ? 'bg-cream/15' : 'bg-cream/5'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isDone ? 'bg-clay text-cream' : 'bg-cream/10 text-cream/40'
                    }`}
                  >
                    {isDone ? <Icon name="check" size={18} /> : <Icon name={p.icon} size={18} />}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium text-sm ${isDone ? 'text-cream' : 'text-cream/50'}`}>
                      {p.label}
                    </p>
                    <p className="text-xs text-cream/40">{p.time}</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 transition-colors ${
                      isDone ? 'border-clay bg-clay' : 'border-cream/20'
                    }`}
                  >
                    {isDone && <Icon name="check" size={14} className="text-cream" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {history.length > 0 && (
          <div>
            <h2 className="text-lg text-forest font-serif font-semibold mb-3">Recent Reflection</h2>
            <div className="space-y-2">
              {history.map((log) => {
                const count = [log.fajr, log.dhuhr, log.asr, log.maghrib, log.isha].filter(Boolean).length
                const date = new Date(log.logDate + 'T00:00:00')
                return (
                  <div key={log.id} className="card flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      {log.note && <p className="text-xs text-stone mt-0.5">{log.note}</p>}
                    </div>
                    <div className="flex gap-1">
                      {prayers.map((p) => (
                        <div
                          key={p.key}
                          className={`w-2.5 h-2.5 rounded-full ${
                            log[p.key] ? 'bg-clay' : 'bg-forest/10'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-serif font-semibold text-forest ml-2">{count}/5</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
