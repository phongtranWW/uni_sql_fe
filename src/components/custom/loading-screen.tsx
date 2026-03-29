import { Spinner } from "@/components/ui/spinner";

interface LoadingScreenProps {
  content: string;
}

const LoadingScreen = ({ content }: LoadingScreenProps) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background gap-4">
      <Spinner className="size-10 text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">{content}</p>
    </div>
  );
};

export default LoadingScreen;
