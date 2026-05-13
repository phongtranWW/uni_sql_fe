const LoadingView = () => {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center gap-6">
      <div className="relative w-[100px] h-[100px]">
        {/* First block */}
        <div
          className="absolute w-[30px] h-[30px] top-1/2 left-1/2 bg-blue-600 dark:bg-blue-500 animate-[up_2.4s_cubic-bezier(0,0,0.24,1.21)_infinite] shadow-sm"
          style={{ boxSizing: "border-box" }}
        />

        {/* Second block */}
        <div
          className="absolute w-[30px] h-[30px] bg-orange-500 dark:bg-orange-400 animate-[down_2.4s_cubic-bezier(0,0,0.24,1.21)_infinite] shadow-sm"
          style={{
            boxSizing: "border-box",
            top: "calc(50% - 30px)",
            left: "calc(50% - 30px)",
          }}
        />

        <style>{`
          @keyframes down {
            0%,
            100% {
              transform: none;
            }
            25% {
              transform: translateX(100%);
            }
            50% {
              transform: translateX(100%) translateY(100%);
            }
            75% {
              transform: translateY(100%);
            }
          }

          @keyframes up {
            0%,
            100% {
              transform: none;
            }
            25% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(-100%) translateY(-100%);
            }
            75% {
              transform: translateY(-100%);
            }
          }
        `}</style>
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Load data ...
      </p>
    </div>
  );
};

export default LoadingView;
