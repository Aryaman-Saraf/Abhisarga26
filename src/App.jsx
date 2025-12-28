import { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom"
import IntroVideo from "./components/IntroVideo"
import ContactPage from "./pages/ContactPage"
import HomePage from "./pages/HomePage"
import MainLayout from "./layouts/MainLayout"

const INTRO_KEY = "abhisarga_intro_timestamp"
const INTRO_COOLDOWN =100000 * 60  // 24 hours

export default function App() {
  const [booted, setBooted] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    const timestamp = localStorage.getItem(INTRO_KEY)
    if (timestamp) {
      const elapsed = Date.now() - Number(timestamp)
      if (elapsed < INTRO_COOLDOWN) {
        setShowIntro(false)
      }
    }

    setBooted(true)
  }, [])

  const handleIntroComplete = () => {
    localStorage.setItem(INTRO_KEY, Date.now().toString())
    setShowIntro(false)
  }

  if (!booted) return null

  if (showIntro) {
    return <IntroVideo onComplete={handleIntroComplete} />
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
    </Routes>
  )
}
