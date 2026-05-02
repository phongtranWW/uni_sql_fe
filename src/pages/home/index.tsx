import { MainNavbar } from "@/components/custom/main-navbar";
import { HomeHero } from "./home-hero";
import { MainFooter } from "@/components/custom/main-footer";

export function Home() {
  return (
    <div className="flex flex-col bg-background text-foreground">
      <MainNavbar />
      <main className="flex-1">
        <HomeHero />
      </main>
      <MainFooter />
    </div>
  );
}
