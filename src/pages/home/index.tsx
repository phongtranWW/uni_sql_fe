import { HomeNavbar } from "./home-navbar";
import { HomeHero } from "./home-hero";
import { HomeFooter } from "./home-footer";

export function Home() {
  return (
    <div className="flex flex-col bg-background text-foreground">
      <HomeNavbar />
      <main className="flex-1">
        <HomeHero />
      </main>
      <HomeFooter />
    </div>
  );
}
