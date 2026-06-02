import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero'
import Services from '../components/sections/Services'
import AISection from '../components/sections/AISection'
import AIDemo from '../components/sections/AIDemo'
import Portfolio from '../components/sections/Portfolio'
import Pricing from '../components/sections/Pricing'
import Testimonials from '../components/sections/Testimonials'
import { FAQ, Contact } from '../components/sections/ContactFAQ'
import AIAssistant from '../components/ui/AIAssistant'
import WhatsAppButton from '../components/WhatsAppButton'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'
import TrustSection from '../components/TrustSection'
import ClientLogos from '../components/ClientLogos'
export default function Home() {
  return (
    <div className="relative min-h-screen bg-dark-900">
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Services />
        <AISection />
        <AIDemo />
        <Portfolio />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Contact />
        </main>
       <Footer />
       <TrustSection />
       <ClientLogos />
       <Testimonials />
       <Footer />
       <WhatsAppButton phone="919380916728" />
      {/* AI Assistant - floats on all pages */}
      <AIAssistant />
    </div>
  )
}
