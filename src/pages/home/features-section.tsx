import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FEATURE_TABS } from "./constants";

const FeaturesSection = () => {
  return (
    <section id="features" className="px-6 pb-20">
      <Card className="mx-auto max-w-6xl rounded-4xl border-border bg-card py-10">
        <CardContent className="space-y-8">
          <p className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-snug">
            Build diagrams with a few clicks, see the full picture, export SQL
            scripts, customize your editor, and more.
          </p>

          <Tabs defaultValue="diagram">
            <TabsList className="w-full justify-start rounded-xl border border-border bg-muted p-1 gap-1 h-auto flex-wrap">
              {FEATURE_TABS.map(({ value, label, icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  {icon}
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {FEATURE_TABS.map(({ value, title, description }) => (
              <TabsContent key={value} value={value}>
                <div className="rounded-3xl border border-border overflow-hidden bg-background">
                  <div className="h-12 bg-muted border-b border-border px-4 flex items-center justify-between">
                    <div className="text-base font-semibold text-foreground">
                      {title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {description}
                    </div>
                  </div>
                  <div className="h-72 bg-[radial-gradient(circle,var(--color-primary)_1.3px,transparent_1.5px)] bg-size-[33px_33px]" />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
};

export default FeaturesSection;
