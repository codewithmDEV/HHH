import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'

type Tab = 'learn' | 'brainstorm'

type Lesson = {
  title: string
  content: string
  principle: string
}

const lessons: Lesson[] = [
  {
    title: 'The Dignity of Earning',
    content:
      'The Prophet Muhammad (peace be upon him) said: "No one has ever eaten a better food than that which he earned by his own hands. The Prophet of Allah, Dawud, used to eat from the earnings of his own hands." (Sahih Bukhari)\n\nEarning your own income is not just a necessity — it is an act of dignity and worship. When you work with honesty and integrity, you are following in the footsteps of the prophets themselves.',
    principle: 'Earning by your own hands is a form of worship.',
  },
  {
    title: 'Halal vs Haram Income',
    content:
      'Allah says: "Allah has permitted trade and forbidden interest." (Quran 2:275)\n\nThe distinction between halal and haram income is not just about what you sell — it is about how you sell it. Honesty, transparency, and fairness are essential. The Prophet said: "The truthful, trustworthy merchant will be with the prophets, the truthful, and the martyrs." (Tirmidhi)\n\nHaram income includes: interest (riba), deception in trade, selling prohibited items, gambling, and anything that causes harm to others.',
    principle: 'How you earn matters as much as what you earn.',
  },
  {
    title: 'The Barakah of Halal',
    content:
      'The Prophet Muhammad (peace be upon him) said: "Charity does not decrease wealth." (Sahih Muslim)\n\nWhen your income is halal, there is barakah (blessing) in it. A small amount of halal income can go further than a large amount of haram income. This is not a mathematical formula — it is a spiritual reality.\n\nBarakah means: your money feels sufficient, your needs are met, and you find contentment. When you choose halal even when haram seems easier, Allah replaces what you feared losing with something better.',
    principle: 'Barakah is real — trust it.',
  },
  {
    title: 'Providing for Your Family',
    content:
      'The Prophet Muhammad (peace be upon him) said: "When a Muslim spends on his family, seeking reward for it, it is an act of charity for him." (Sahih Bukhari)\n\nProviding for your family is not just a worldly responsibility — it is an act of worship. Every meal you provide, every bill you pay, every gift you give — when done with the intention of pleasing Allah, it becomes charity.\n\nThis reframes the pressure of providing: you are not just earning to survive, you are earning to worship.',
    principle: 'Providing for your family is sadaqah.',
  },
  {
    title: 'Avoiding Riba',
    content:
      'Allah says: "O you who have believed, fear Allah and give up what remains of interest, if you should be believers." (Quran 2:278)\n\nInterest (riba) is strictly prohibited in Islam. This includes both paying and receiving interest. In modern contexts, this means being careful with:\n\n- Conventional mortgages and loans with interest\n- Credit cards (if you carry a balance)\n- Interest-bearing bank accounts (consider Islamic banking alternatives)\n- Investment products that involve interest\n\nThe hardship of avoiding riba is temporary. Allah promises: "Whoever fears Allah — He will make for him a way out. And He will provide for him from where he does not expect." (Quran 65:2-3)',
    principle: 'Avoiding riba is hard but Allah provides the way out.',
  },
  {
    title: 'Zakat — Purifying Your Wealth',
    content:
      'Zakat is the third pillar of Islam — a mandatory annual charity of 2.5% on qualifying wealth above the nisab threshold.\n\nAllah says: "Take from their wealth a charity by which you purify them and cause them to increase." (Quran 9:103)\n\nZakat is not a tax — it is a purification. It cleanses your wealth from the attachment of greed and reminds you that everything you have is from Allah.\n\nBeyond zakat, voluntary charity (sadaqah) is highly encouraged. The Prophet said: "Every Muslim has to give in charity." When asked what if someone has nothing, he said: "They should work with their hands and give in charity." (Sahih Bukhari)',
    principle: 'Zakat purifies — sadaqah multiplies.',
  },
]

const ideaTemplates = [
  {
    title: 'Freelance Digital Services',
    description: 'Offer skills like graphic design, writing, video editing, or web development to clients worldwide. Start on platforms like Upwork or Fiverr, then build direct relationships.',
    skills: ['Design', 'Writing', 'Coding', 'Video Editing'],
    halal: 'No interest involved. You trade your time and skill for fair compensation.',
  },
  {
    title: 'Online Course Creation',
    description: 'Teach what you know — whether it is Quran memorization, Arabic, coding, or business skills. Create once, earn ongoing.',
    skills: ['Teaching', 'Subject expertise', 'Basic video skills'],
    halal: 'Selling knowledge is halal and encouraged. The Prophet said seeking knowledge is obligatory.',
  },
  {
    title: 'E-commerce — Physical Products',
    description: 'Sell halal products online — modest fashion, Islamic books, natural cosmetics, or artisan goods. Use platforms like Shopify or Etsy.',
    skills: ['Product sourcing', 'Marketing', 'Customer service'],
    halal: 'Ensure products are halal, pricing is fair, and no deception in advertising.',
  },
  {
    title: 'Content Creation — Islamic Education',
    description: 'Create YouTube, TikTok, or Instagram content sharing Islamic knowledge, reflections, or educational content. Monetize through halal sponsorships and products.',
    skills: ['Communication', 'Video creation', 'Research'],
    halal: 'Avoid haram advertising. Focus on beneficial content and halal brand partnerships.',
  },
  {
    title: 'Halal Food Business',
    description: 'Start a halal meal prep service, cater events, or open a small food stall. The food industry has consistent demand and allows for community connection.',
    skills: ['Cooking', 'Food safety', 'Customer service'],
    halal: 'Serving halal food is a service to the community. Ensure cleanliness and honesty.',
  },
  {
    title: 'Tutoring — Academic or Islamic',
    description: 'Tutor students in academic subjects or Quran and Islamic studies. Start locally, then expand online.',
    skills: ['Teaching', 'Patience', 'Subject knowledge'],
    halal: 'Teaching is one of the most honored professions in Islam.',
  },
  {
    title: 'App Development',
    description: 'Build mobile apps or web tools that solve problems for the Muslim community — prayer reminders, halal restaurant finders, Islamic finance trackers.',
    skills: ['Programming', 'Design', 'Problem-solving'],
    halal: 'Building beneficial tools is a form of sadaqah jariyah (ongoing charity).',
  },
  {
    title: 'Consulting — Halal Finance',
    description: 'Help Muslims navigate halal investing, avoid riba, and plan their finances according to Islamic principles. Requires some financial knowledge.',
    skills: ['Financial literacy', 'Islamic finance knowledge', 'Communication'],
    halal: 'Guiding others to halal financial decisions is a great service.',
  },
  {
    title: 'Handcrafts and Artisan Goods',
    description: 'Create and sell handmade items — calligraphy, leather goods, candles, or pottery. Sell at markets, online, or through social media.',
    skills: ['Crafting', 'Creativity', 'Marketing'],
    halal: 'Handmade goods with honest pricing and quality craftsmanship.',
  },
  {
    title: 'Social Media Management',
    description: 'Help Muslim businesses and organizations manage their social media presence. Many need help but lack the skills or time.',
    skills: ['Social media', 'Content planning', 'Communication'],
    halal: 'Helping halal businesses grow is a service to the community.',
  },
  {
    title: 'Translation Services',
    description: 'Translate between Arabic and English (or other languages) for Islamic content, books, or business communications.',
    skills: ['Bilingual fluency', 'Writing', 'Cultural knowledge'],
    halal: 'Bridging language gaps to spread knowledge is highly beneficial.',
  },
  {
    title: 'Fitness Coaching — Halal',
    description: 'Offer personal training or fitness coaching, especially for the Muslim community. Provide gender-segregated or online sessions.',
    skills: ['Fitness knowledge', 'Motivation', 'Communication'],
    halal: 'Helping others stay healthy is part of the Islamic emphasis on caring for the body.',
  },
]

export default function Income() {
  const [tab, setTab] = useState<Tab>('learn')
  const [generatedIdea, setGeneratedIdea] = useState<(typeof ideaTemplates)[0] | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  function generateIdea() {
    setIsGenerating(true)
    setGeneratedIdea(null)
    setTimeout(() => {
      const random = ideaTemplates[Math.floor(Math.random() * ideaTemplates.length)]
      setGeneratedIdea(random)
      setIsGenerating(false)
    }, 600)
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Halal Income" subtitle="Learn, brainstorm, and build with intention" />

      <div className="px-5">
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab('learn')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === 'learn' ? 'bg-forest text-cream' : 'bg-forest/5 text-stone border border-forest/10'
            }`}
          >
            Learn
          </button>
          <button
            onClick={() => setTab('brainstorm')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === 'brainstorm' ? 'bg-forest text-cream' : 'bg-forest/5 text-stone border border-forest/10'
            }`}
          >
            Brainstorm
          </button>
        </div>

        {tab === 'learn' && (
          <div className="space-y-3 animate-fade-in">
            {lessons.map((lesson, i) => (
              <div key={i} className="card animate-slide-up">
                <div className="flex items-start gap-2 mb-2">
                  <Icon name="book" size={18} className="text-clay shrink-0 mt-1" />
                  <h3 className="font-serif text-lg font-semibold text-forest">{lesson.title}</h3>
                </div>
                <p className="text-sm text-ink/80 whitespace-pre-wrap leading-relaxed">{lesson.content}</p>
                <div className="mt-3 pt-2 border-t border-forest/10 flex items-center gap-2">
                  <Icon name="sparkle" size={14} className="text-clay" />
                  <p className="text-xs text-clay-dark font-medium italic">{lesson.principle}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'brainstorm' && (
          <div className="animate-fade-in">
            <div className="card-forest mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="lightbulb" size={20} className="text-clay-light" />
                <h3 className="font-serif text-lg font-semibold text-cream">Idea Generator</h3>
              </div>
              <p className="text-cream/70 text-sm mb-4">
                Not sure where to start? Let me suggest a halal income idea for you.
              </p>
              <button
                onClick={generateIdea}
                disabled={isGenerating}
                className="btn-clay w-full flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Icon name="refresh" size={18} className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Icon name="sparkle" size={18} />
                    <span>{generatedIdea ? 'Generate Another' : 'Generate an Idea'}</span>
                  </>
                )}
              </button>
            </div>

            {generatedIdea && (
              <div className="card animate-scale-in mb-5">
                <h3 className="font-serif text-xl font-semibold text-forest mb-2">
                  {generatedIdea.title}
                </h3>
                <p className="text-sm text-ink/80 leading-relaxed mb-3">{generatedIdea.description}</p>
                <div className="mb-3">
                  <p className="text-xs text-stone font-medium mb-1.5">Skills You'll Need</p>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedIdea.skills.map((skill, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-moss/20 text-forest">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-forest/10 flex items-start gap-2">
                  <Icon name="check" size={16} className="text-clay shrink-0 mt-0.5" />
                  <p className="text-xs text-stone">
                    <span className="font-medium text-forest">Why it's halal: </span>
                    {generatedIdea.halal}
                  </p>
                </div>
              </div>
            )}

            <h3 className="text-lg text-forest font-serif font-semibold mb-3">All Ideas</h3>
            <div className="space-y-2">
              {ideaTemplates.map((idea, i) => (
                <button
                  key={i}
                  onClick={() => setGeneratedIdea(idea)}
                  className="w-full card text-left hover:bg-moss/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-forest">{idea.title}</h4>
                    <Icon name="arrowRight" size={14} className="text-stone/40" />
                  </div>
                  <p className="text-xs text-stone mt-1 line-clamp-2">{idea.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
