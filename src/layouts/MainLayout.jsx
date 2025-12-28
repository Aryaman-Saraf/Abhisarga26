import { Outlet } from "react-router-dom"
import Oneko from "../components/Oneko"
import SmoothScroll from "../components/SmoothScroll"
import Navigation from "../components/Navigation"
import Footer from "../sections/Footer"

export default function MainLayout() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-[#030204] text-white">
        <Oneko />
        <Navigation />
        <Outlet />
        <Footer />
      </div>
    </SmoothScroll>
  )
}
