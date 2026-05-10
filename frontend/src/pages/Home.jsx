import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero'
import Services from '../components/sections/Services'
import Portfolio from '../components/sections/Portfolio'
import Pricing from '../components/sections/Pricing'
import Testimonials from '../components/sections/Testimonials'
import { FAQ, Contact } from '../components/sections/ContactFAQ'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-dark-900">
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Services />
        <Portfolio />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
