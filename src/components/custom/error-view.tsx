interface ErrorViewProps {
  message?: string;
}

const ErrorView = ({ message }: ErrorViewProps) => {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center gap-6">
      <div className="relative w-[100px] h-[100px]">
        {/* Blue block - crashed & tilted */}
        <div
          className="absolute w-[30px] h-[30px] bg-blue-600 dark:bg-blue-500 shadow-sm"
          style={{
            boxSizing: "border-box",
            top: "55%",
            left: "40%",
            transform: "rotate(15deg)",
            animation: "error-flicker 4s infinite",
          }}
        />
        {/* Orange block - crashed & overlapping */}
        <div
          className="absolute w-[30px] h-[30px] bg-orange-500 dark:bg-orange-400 shadow-sm"
          style={{
            boxSizing: "border-box",
            top: "40%",
            left: "25%",
            transform: "rotate(-25deg)",
            animation: "error-flicker 4s infinite 0.5s",
          }}
        />

        <style>{`
          @keyframes error-flicker {
            0%, 92% { opacity: 1; }
            93% { opacity: 0.2; }
            94% { opacity: 1; }
            96% { opacity: 0.1; }
            98% { opacity: 1; }
            100% { opacity: 1; }
          }
        `}</style>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-destructive">
          {message || "Failed to load data"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Please refresh the page to try again
        </p>
      </div>
    </div>
  );
};

export default ErrorView;
