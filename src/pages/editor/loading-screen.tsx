import { Spinner } from "@/components/ui/spinner";

const LoadingScreen = () => (
  <div className="flex h-screen flex-col items-center justify-center gap-3">
    <Spinner />
    <p className="text-sm text-muted-foreground">Loading database...</p>
  </div>
);

export default LoadingScreen;
