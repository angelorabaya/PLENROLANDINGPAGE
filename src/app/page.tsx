import Navbar from "@/components/landing/navbar";
import HeroSection from "@/components/landing/hero-section";
import DepartmentHeadMessage from "@/components/landing/department-head-message";
import MandateSection from "@/components/landing/mandate-section";
import TeamSection from "@/components/landing/team-section";
import RegulatorySection from "@/components/landing/regulatory-section";
import NewsSection from "@/components/landing/news-section";
import ResourcesSection from "@/components/landing/resources-section";
import LocationSection from "@/components/landing/location-section";
import Footer from "@/components/landing/footer";
import OrdinanceChat from "@/components/landing/ordinance-chat";
import BackToTop from "@/components/landing/back-to-top";

export default function Home() {
  return (
    <main className="flex-1">
      <Navbar />
      <HeroSection />
      <DepartmentHeadMessage />
      <MandateSection />
      <TeamSection />
      <RegulatorySection />
      <NewsSection />
      <ResourcesSection />
      <LocationSection />
      <Footer />
      <BackToTop />
      <OrdinanceChat />
    </main>
  );
}
