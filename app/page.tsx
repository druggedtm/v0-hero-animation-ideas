import Hero from "@/components/hero"
import Navigation from "@/components/navigation"
import About from "@/components/about"
import Services from "@/components/services"
import Team from "@/components/team"
import Footer from "@/components/footer"
import ContactCTA from "@/components/contact-cta"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Services />
        <Team />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  )
}
