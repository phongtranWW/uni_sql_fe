import { Card, CardContent } from "@/components/ui/card";
import { Github, MessageCircle } from "lucide-react";

const DocsSection = () => {
  return (
    <section id="docs" className="px-6 pb-14">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-4xl sm:text-5xl md:text-7xl font-black text-foreground">
          Reach out to us
        </p>
        <p className="mt-3 text-xl sm:text-2xl md:text-4xl text-foreground">
          We love hearing from you. Join our community on Discord, GitHub, and
          X.
        </p>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card className="rounded-2xl bg-secondary text-secondary-foreground border-border py-2">
            <CardContent className="flex items-center justify-center gap-3 py-7">
              <Github className="size-11" />
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                See the source
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl bg-primary text-primary-foreground border-primary/80 py-2">
            <CardContent className="flex items-center justify-center gap-3 py-7">
              <MessageCircle className="size-11" />
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Join us on Discord
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl bg-secondary text-secondary-foreground border-border py-2">
            <CardContent className="flex items-center justify-center gap-3 py-7">
              <p className="text-6xl font-black">X</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Follow us on X
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DocsSection;
