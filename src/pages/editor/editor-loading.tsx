import { Spinner } from "@/components/ui/spinner";

const EditorLoading = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background gap-4">
      <Spinner className="size-10 text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading project...</p>
    </div>
  );
};

export default EditorLoading;
