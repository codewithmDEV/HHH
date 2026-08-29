import { Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Salah from './pages/Salah'
import Intentions from './pages/Intentions'
import Guidance from './pages/Guidance'
import Journal from './pages/Journal'
import Income from './pages/Income'
import Orphan from './pages/Orphan'
import Quran from './pages/Quran'
import Community from './pages/Community'

export default function App() {
  return (
    <div className="min-h-screen bg-cream max-w-md mx-auto relative shadow-2xl">
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/salah" element={<Salah />} />
            <Route path="/intentions" element={<Intentions />} />
            <Route path="/guidance" element={<Guidance />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/income" element={<Income />} />
            <Route path="/orphan" element={<Orphan />} />
            <Route path="/quran" element={<Quran />} />
            <Route path="/community" element={<Community />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
