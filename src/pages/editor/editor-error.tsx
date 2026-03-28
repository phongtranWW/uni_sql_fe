import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const EditorError = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm p-6 border rounded-lg shadow-sm bg-card text-card-foreground">
        <div className="bg-destructive/10 p-3 rounded-full">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Failed to load</h2>
          <p className="text-sm text-muted-foreground text-balance">
            We encountered an error while trying to fetch the project. Please check your connection and try again.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} className="w-full mt-2">
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default EditorError;
