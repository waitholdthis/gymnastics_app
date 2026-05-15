import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CinematicBand from "@/components/CinematicBand";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <TrustBar />
        <Features />
        <HowItWorks />
        <CinematicBand />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
