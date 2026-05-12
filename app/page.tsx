import Nav from '@/components/Nav/Nav';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import HeroScroll from '@/components/Hero/HeroScroll';
import About from '@/components/About/About';
import Pricing from '@/components/Pricing/Pricing';
import Services from '@/components/Services/Services';
import Founder from '@/components/Founder/Founder';
import Process from '@/components/Process/Process';
import FAQ from '@/components/FAQ/FAQ';
import Blog from '@/components/Blog/Blog';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  const showInsights = process.env.NODE_ENV === 'development';

  return (
    <>
      <ProgressBar />
      <Nav showInsights={showInsights} />
      <main>
        <HeroScroll />
        <About />
        <Pricing />
        <Services />
        <Founder />
        <Process />
        <FAQ />
        {/* Insights stays local-only until production content is ready. */}
        {showInsights ? <Blog /> : null}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
