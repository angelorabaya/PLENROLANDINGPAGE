import Navbar from "@/components/landing/navbar";
import HeroSection from "@/components/landing/hero-section";
import MandateSection from "@/components/landing/mandate-section";
import TeamSection from "@/components/landing/team-section";
import RegulatorySection from "@/components/landing/regulatory-section";
import NewsSection from "@/components/landing/news-section";
import ResourcesSection from "@/components/landing/resources-section";
import LocationSection from "@/components/landing/location-section";
import Footer from "@/components/landing/footer";
import OrdinanceChat from "@/components/landing/ordinance-chat";

export default function Home() {
  return (
    <main className="flex-1">
      <Navbar />
      <HeroSection />
      <MandateSection />
      <TeamSection />
      <RegulatorySection />
      <NewsSection />
      <ResourcesSection />
      <LocationSection />
      <Footer />
      <OrdinanceChat />
    </main>
  );
}
