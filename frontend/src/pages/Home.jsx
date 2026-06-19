import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Hero from '../components/home/Hero'
import Stats from '../components/home/Stats'
import FAQ from '../components/home/FAQ'
import HomeFAQ from '../components/home/HomeFAQ'
import FeaturedProjects from '../components/home/FeaturedProjects'
import IntroAnimation from '../components/common/IntroAnimation'

export default function Home() {
  return (
    <IntroAnimation>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1">
          {/* Hero */}
          <Hero />

          {/* Live stats */}
          <Stats />

          {/* Recent projects preview */}
          <FeaturedProjects />

          {/* Category grid */}
          <FAQ />

          {/* CTA Banner */}
          <section className="py-4 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-cta px-8 py-14 text-center">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider">
                    Start Building
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                    Ready to showcase<br className="hidden sm:block" /> your work?
                  </h2>
                  <p className="text-white/80 text-base max-w-md mx-auto">
                    Publish your project, build your portfolio, and get discovered
                    by the developer community. 6+ developers and counting.
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/publish"
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-gray-900
                        bg-white hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      Publish Your Project
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ accordion */}
          <HomeFAQ />
        </main>

        <Footer />
      </div>
    </IntroAnimation>
  )
}
