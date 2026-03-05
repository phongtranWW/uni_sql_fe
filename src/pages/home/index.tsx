import Header from "./header";
import HeroSection from "./hero-section";
import FeaturesSection from "./features-section";
import StatsSection from "./stats-section";
import DocsSection from "./docs-section";
import Footer from "./footer";

export const Home = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <DocsSection />
      <Footer />
    </main>
  );
};
