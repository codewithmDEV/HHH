import { useState, useEffect, useRef } from 'react'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'

type Surah = {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

const surahs: Surah[] = [
  { number: 1, name: 'Al-Fatiha', englishName: 'Al-Fatiha', englishNameTranslation: 'The Opening', numberOfAyahs: 7, revelationType: 'Meccan' },
  { number: 2, name: 'Al-Baqara', englishName: 'Al-Baqara', englishNameTranslation: 'The Cow', numberOfAyahs: 286, revelationType: 'Medinan' },
  { number: 3, name: 'Aal-i-Imraan', englishName: 'Aal-i-Imraan', englishNameTranslation: 'The Family of Imraan', numberOfAyahs: 200, revelationType: 'Medinan' },
  { number: 4, name: 'An-Nisaa', englishName: 'An-Nisaa', englishNameTranslation: 'The Women', numberOfAyahs: 176, revelationType: 'Medinan' },
  { number: 5, name: 'Al-Maaida', englishName: 'Al-Maaida', englishNameTranslation: 'The Table', numberOfAyahs: 120, revelationType: 'Medinan' },
  { number: 6, name: "Al-An'aam", englishName: "Al-An'aam", englishNameTranslation: 'The Cattle', numberOfAyahs: 165, revelationType: 'Meccan' },
  { number: 7, name: "Al-A'raaf", englishName: "Al-A'raaf", englishNameTranslation: 'The Heights', numberOfAyahs: 206, revelationType: 'Meccan' },
  { number: 8, name: 'Al-Anfaal', englishName: 'Al-Anfaal', englishNameTranslation: 'The Spoils of War', numberOfAyahs: 75, revelationType: 'Medinan' },
  { number: 9, name: 'At-Tawba', englishName: 'At-Tawba', englishNameTranslation: 'The Repentance', numberOfAyahs: 129, revelationType: 'Medinan' },
  { number: 10, name: 'Yunus', englishName: 'Yunus', englishNameTranslation: 'Jonas', numberOfAyahs: 109, revelationType: 'Meccan' },
  { number: 11, name: 'Hud', englishName: 'Hud', englishNameTranslation: 'Hud', numberOfAyahs: 123, revelationType: 'Meccan' },
  { number: 12, name: 'Yusuf', englishName: 'Yusuf', englishNameTranslation: 'Joseph', numberOfAyahs: 111, revelationType: 'Meccan' },
  { number: 13, name: "Ar-Ra'd", englishName: "Ar-Ra'd", englishNameTranslation: 'The Thunder', numberOfAyahs: 43, revelationType: 'Medinan' },
  { number: 14, name: 'Ibrahim', englishName: 'Ibrahim', englishNameTranslation: 'Abraham', numberOfAyahs: 52, revelationType: 'Meccan' },
  { number: 15, name: 'Al-Hijr', englishName: 'Al-Hijr', englishNameTranslation: 'The Rock', numberOfAyahs: 99, revelationType: 'Meccan' },
  { number: 16, name: 'An-Nahl', englishName: 'An-Nahl', englishNameTranslation: 'The Bee', numberOfAyahs: 128, revelationType: 'Meccan' },
  { number: 17, name: 'Al-Israa', englishName: 'Al-Israa', englishNameTranslation: 'The Night Journey', numberOfAyahs: 111, revelationType: 'Meccan' },
  { number: 18, name: 'Al-Kahf', englishName: 'Al-Kahf', englishNameTranslation: 'The Cave', numberOfAyahs: 110, revelationType: 'Meccan' },
  { number: 19, name: 'Maryam', englishName: 'Maryam', englishNameTranslation: 'Mary', numberOfAyahs: 98, revelationType: 'Meccan' },
  { number: 20, name: 'Taa-Haa', englishName: 'Taa-Haa', englishNameTranslation: 'Taa-Haa', numberOfAyahs: 135, revelationType: 'Meccan' },
  { number: 36, name: 'Yaseen', englishName: 'Yaseen', englishNameTranslation: 'Yaseen', numberOfAyahs: 83, revelationType: 'Meccan' },
  { number: 55, name: 'Ar-Rahmaan', englishName: 'Ar-Rahmaan', englishNameTranslation: 'The Most Merciful', numberOfAyahs: 78, revelationType: 'Medinan' },
  { number: 56, name: 'Al-Waaqia', englishName: 'Al-Waaqia', englishNameTranslation: 'The Inevitable', numberOfAyahs: 96, revelationType: 'Meccan' },
  { number: 67, name: 'Al-Mulk', englishName: 'Al-Mulk', englishNameTranslation: 'The Sovereignty', numberOfAyahs: 30, revelationType: 'Meccan' },
  { number: 112, name: 'Al-Ikhlaas', englishName: 'Al-Ikhlaas', englishNameTranslation: 'Sincerity', numberOfAyahs: 4, revelationType: 'Meccan' },
  { number: 113, name: 'Al-Falaq', englishName: 'Al-Falaq', englishNameTranslation: 'The Dawn', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 114, name: 'An-Naas', englishName: 'An-Naas', englishNameTranslation: 'Mankind', numberOfAyahs: 6, revelationType: 'Meccan' },
]

type Ayah = {
  number: number
  text: string
  translation: string
}

const surahContent: Record<number, Ayah[]> = {
  1: [
    { number: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'In the name of Allah, the Most Gracious, the Most Merciful.' },
    { number: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translation: 'All praise is due to Allah, Lord of the worlds.' },
    { number: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ', translation: 'The Most Gracious, the Most Merciful.' },
    { number: 4, text: 'مَالِكِ يَوْمِ الدِّينِ', translation: 'Master of the Day of Judgment.' },
    { number: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translation: 'You alone we worship, and You alone we ask for help.' },
    { number: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', translation: 'Guide us to the straight path.' },
    { number: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', translation: 'The path of those upon whom You have bestowed favor, not of those who have evoked anger or of those who are astray.' },
  ],
  112: [
    { number: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', translation: 'Say: He is Allah, the One.' },
    { number: 2, text: 'اللَّهُ الصَّمَدُ', translation: 'Allah, the Eternal Refuge.' },
    { number: 3, text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', translation: 'He neither begets nor is born.' },
    { number: 4, text: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', translation: 'And there is none comparable to Him.' },
  ],
  113: [
    { number: 1, text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', translation: 'Say: I seek refuge in the Lord of the dawn.' },
    { number: 2, text: 'مِن شَرِّ مَا خَلَقَ', translation: 'From the evil of what He has created.' },
    { number: 3, text: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', translation: 'And from the evil of darkness when it settles.' },
    { number: 4, text: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', translation: 'And from the evil of the blowers in knots.' },
    { number: 5, text: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', translation: 'And from the evil of an envier when he envies.' },
  ],
  114: [
    { number: 1, text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', translation: 'Say: I seek refuge in the Lord of mankind.' },
    { number: 2, text: 'مَلِكِ النَّاسِ', translation: 'The Sovereign of mankind.' },
    { number: 3, text: 'إِلَٰهِ النَّاسِ', translation: 'The God of mankind.' },
    { number: 4, text: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', translation: 'From the evil of the retreating whisperer.' },
    { number: 5, text: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', translation: 'Who whispers into the breasts of mankind.' },
    { number: 6, text: 'مِنَ الْجِنَّةِ وَالنَّاسِ', translation: 'From among the jinn and mankind.' },
  ],
}

export default function Quran() {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null)
  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!selectedSurah) return

    if (surahContent[selectedSurah.number]) {
      setAyahs(surahContent[selectedSurah.number])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    setAyahs([])

    fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${selectedSurah.number}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then((data) => {
        const fetched = (data.verses || []).map((v: { verse_number: number; text_uthmani: string }) => ({
          number: v.verse_number,
          text: v.text_uthmani,
          translation: '',
        }))
        setAyahs(fetched)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load this surah. Please try again later.')
        setLoading(false)
      })
  }, [selectedSurah])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [selectedSurah])

  if (selectedSurah) {
    return (
      <div className="animate-fade-in">
        <header className="px-5 pt-6 pb-4">
          <button
            onClick={() => setSelectedSurah(null)}
            className="flex items-center gap-1 text-stone text-sm mb-2"
          >
            <Icon name="arrowLeft" size={18} />
            <span>All Surahs</span>
          </button>
          <div className="card-forest">
            <h1 className="text-2xl font-serif font-bold text-cream">{selectedSurah.englishName}</h1>
            <p className="text-cream/70 text-sm mt-1">
              {selectedSurah.englishNameTranslation} · {selectedSurah.numberOfAyahs} verses ·{' '}
              {selectedSurah.revelationType}
            </p>
          </div>
        </header>

        <div ref={scrollRef} className="px-5 pb-4">
          {loading && (
            <div className="text-center py-12">
              <Icon name="refresh" size={24} className="text-forest/40 animate-spin mx-auto mb-3" />
              <p className="text-stone text-sm">Loading...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-stone text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {ayahs.map((ayah) => (
                <div key={ayah.number} className="card animate-slide-up">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center text-xs font-serif font-semibold text-forest">
                      {ayah.number}
                    </span>
                    <p className="text-xl text-forest leading-loose text-right flex-1" dir="rtl" lang="ar">
                      {ayah.text}
                    </p>
                  </div>
                  {ayah.translation && (
                    <p className="text-sm text-stone leading-relaxed pl-11 mt-2 italic">
                      {ayah.translation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Quran Reader" subtitle="Read and reflect on the Book of Allah" />

      <div className="px-5">
        <div className="space-y-2">
          {surahs.map((surah) => (
            <button
              key={surah.number}
              onClick={() => setSelectedSurah(surah)}
              className="w-full card flex items-center justify-between hover:bg-moss/40 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center text-sm font-serif font-semibold text-forest">
                  {surah.number}
                </span>
                <div>
                  <h3 className="font-serif text-base font-semibold text-forest">{surah.englishName}</h3>
                  <p className="text-xs text-stone">
                    {surah.englishNameTranslation} · {surah.numberOfAyahs} verses
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-serif text-forest/60" dir="rtl" lang="ar">
                  {surah.name}
                </p>
                <p className="text-[10px] text-stone">{surah.revelationType}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
