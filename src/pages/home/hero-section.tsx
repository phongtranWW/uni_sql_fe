import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import HeroDiagram from "./hero-diagram";

const HeroSection = () => {
  return (
    <section className="relative overflow-x-hidden py-0">
      <div className="absolute z-10 mb-6 h-fit justify-center left-24 top-1/2 -translate-y-1/2 pointer-events-none">
        <h1 className="w-fit text-left text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-primary">
          Draw, Copy, and Paste
        </h1>
        <p className="w-1/2 my-3 text-base sm:text-lg lg:text-xl leading-tight text-foreground font-semibold">
          Free and open source, simple, and intuitive database design editor,
          data-modeler, and SQL generator.
          <span className="text-muted-foreground"> No sign up</span>
        </p>
        <div className="w-fit flex flex-wrap items-center gap-4 justify-start">
          <Button
            variant="outline"
            size="lg"
            className="h-12 sm:h-14 px-8 sm:px-10 rounded-full bg-card text-card-foreground text-lg sm:text-xl lg:text-2xl font-bold hover:bg-card/90 border-border pointer-events-auto"
          >
            Learn more
          </Button>
          <Button
            size="lg"
            asChild
            className="h-12 sm:h-14 px-8 sm:px-10 rounded-full bg-primary text-primary-foreground text-lg sm:text-xl lg:text-2xl font-bold hover:bg-primary/90 pointer-events-auto"
          >
            <Link to="/editor">
              Try it for yourself <ArrowRight className="size-6" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="w-screen relative left-1/2 -translate-x-1/2">
        <HeroDiagram />
      </div>
    </section>
  );
};

export default HeroSection;
