import { useState, useEffect, useRef } from 'react'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import { searchGuidance, suggestedQuestions } from '../lib/guidance'
import { guidanceStore } from '../lib/store'
import type { GuidanceChat } from '../types'

type Message = {
  id: string
  role: 'user' | 'guide'
  text: string
  sources?: string[]
}

export default function Guidance() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const history = guidanceStore.list().slice(0, 20).reverse()
    if (history.length > 0) {
      setMessages(
        history.map((h) => [
          { id: h.id + '-q', role: 'user' as const, text: h.question },
          { id: h.id + '-r', role: 'guide' as const, text: h.response, sources: h.sources },
        ]).flat(),
      )
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isThinking])

  function ask(question: string) {
    if (!question.trim()) return
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text: question }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setIsThinking(true)

    setTimeout(() => {
      const result = searchGuidance(question)
      const response = result
        ? result.response
        : "I don't have a specific answer for this yet, but I encourage you to reflect on this question and consult a qualified scholar. In the meantime, here is a general principle: the Prophet Muhammad (peace be upon him) said, 'The seeking of knowledge is obligatory upon every Muslim.' (Ibn Majah) — seek knowledge from authentic sources and scholars who can guide you."
      const sources = result ? result.sources : ['Ibn Majah', 'sunnah.com']

      const guideMsg: Message = { id: crypto.randomUUID(), role: 'guide', text: response, sources }
      setMessages((m) => [...m, guideMsg])
      setIsThinking(false)
      guidanceStore.create({ question, response, sources })
    }, 800 + Math.random() * 600)
  }

  return (
    <div className="animate-fade-in flex flex-col" style={{ height: 'calc(100vh - 72px)' }}>
      <PageHeader title="Seek Guidance" subtitle="Answers rooted in Quran and authenticated Sunnah" />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-4">
        {messages.length === 0 && (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="guidance" size={28} className="text-forest/50" />
            </div>
            <p className="text-stone text-sm mb-5">
              Ask a question about faith, worship, character, or navigating life.
              I'll share what the Quran and authenticated hadith say.
            </p>
            <div className="space-y-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="w-full card text-left text-sm text-forest hover:bg-moss/40 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              {msg.role === 'guide' && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-forest flex items-center justify-center mr-2 mt-1">
                  <Icon name="compass" size={16} className="text-cream" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-3.5 ${
                  msg.role === 'user'
                    ? 'bg-clay text-cream rounded-br-md'
                    : 'bg-moss/30 text-ink rounded-bl-md border border-forest/10'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-forest/10 flex flex-wrap gap-1.5">
                    {msg.sources.map((src, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-forest/10 text-forest/70"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start animate-fade-in">
              <div className="shrink-0 w-8 h-8 rounded-full bg-forest flex items-center justify-center mr-2 mt-1">
                <Icon name="compass" size={16} className="text-cream" />
              </div>
              <div className="bg-moss/30 rounded-2xl rounded-bl-md p-4 border border-forest/10">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-forest/40 animate-pulse-soft" />
                  <div className="w-2 h-2 rounded-full bg-forest/40 animate-pulse-soft" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-forest/40 animate-pulse-soft" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-3 pt-2 bg-cream border-t border-forest/10">
        <div className="flex gap-2 items-end">
          <textarea
            className="input-field min-h-[44px] max-h-24 resize-none flex-1"
            placeholder="Ask about prayer, patience, income, intention..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                ask(input)
              }
            }}
            rows={1}
          />
          <button
            onClick={() => ask(input)}
            disabled={!input.trim() || isThinking}
            className="btn-primary !px-4 !py-3 disabled:opacity-40"
          >
            <Icon name="send" size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
