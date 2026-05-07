import { FolderOpen } from "lucide-react";

const IdleScreen = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background gap-4">
      <FolderOpen className="size-10 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">No data to display.</p>
    </div>
  );
};

export default IdleScreen;
