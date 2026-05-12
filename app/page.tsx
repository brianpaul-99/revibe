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
  return (
    <>
      <ProgressBar />
      <Nav />
      <main>
        <HeroScroll />
        <About />
        <Pricing />
        <Services />
        <Founder />
        <Process />
        <FAQ />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
