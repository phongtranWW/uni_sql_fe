import { Github, Linkedin } from "lucide-react";

export function MainFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <p className="text-sm text-muted-foreground">
          © {year} UniSQL. Built by{" "}
          <span className="font-medium text-foreground">Phong Tran</span>
        </p>

        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com/in/phong-tr%E1%BA%A7n-7a5534308/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="LinkedIn profile"
          >
            <Linkedin className="size-5" />
          </a>
          <a
            href="https://github.com/phongtranWW"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub repository"
          >
            <Github className="size-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
