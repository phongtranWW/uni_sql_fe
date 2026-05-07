import { Link } from "react-router";
import { Github, ArrowRight, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="relative flex h-svh flex-col items-center justify-center px-6 pt-16 text-center">
      {/* Decorative Abstract Shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large Circle Top Right */}
        <div className="absolute top-[15%] right-[10%] size-32 rounded-full bg-orange-500 opacity-70 shadow-2xl lg:size-48" />
        {/* Medium Circle Middle Left */}
        <div className="absolute top-[45%] left-[5%] size-24 rounded-full bg-blue-500 opacity-60 shadow-xl lg:size-32" />
        
        {/* Small Circle Top Center-Left */}
        <div className="absolute top-[25%] left-[20%] size-16 rounded-full bg-purple-500 opacity-60 shadow-lg lg:size-20" />
        
        {/* Medium Circle Bottom Right */}
        <div className="absolute bottom-[20%] right-[25%] size-16 rounded-full bg-emerald-500 opacity-80 shadow-xl lg:size-24" />
        
        {/* Small dot */}
        <div className="absolute top-[35%] right-[35%] size-6 rounded-full bg-amber-400 shadow-md" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
          <Workflow className="size-4 text-primary" />
          Visual Database Design Tool
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Design Your Database{" "}
          <span className="text-primary">
            Visually
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Drag, drop, and connect — build SQL schemas with an intuitive visual
          editor. Export to SQL, collaborate in real-time, and bring your data
          models to life.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="text-base" asChild>
            <Link to="/login">
              Get Started
              <ArrowRight />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-base" asChild>
            <a
              href="https://github.com/phongtranWW/uni_sql_fe"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="size-5" />
              View on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
