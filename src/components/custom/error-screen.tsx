import { TriangleAlert } from "lucide-react";

const ErrorScreen = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background gap-4">
      <TriangleAlert className="size-10 text-destructive" />
      <p className="text-sm text-destructive">
        Something went wrong. Please try again.
      </p>
    </div>
  );
};

export default ErrorScreen;
