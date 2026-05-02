import { Link } from "react-router";
import { Github, ArrowRight, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="relative flex h-svh flex-col items-center justify-center px-6 pt-16 text-center">
      {/* Decorative gradient blob */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
          <Workflow className="size-4 text-primary" />
          Visual Database Design Tool
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Design Your Database{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
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
