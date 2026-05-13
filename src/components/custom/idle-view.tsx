const IdleView = () => {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center gap-6">
      <div className="relative w-[100px] h-[100px]">
        {/* First block (Blue) */}
        <div
          className="absolute w-[30px] h-[30px] bg-blue-600 dark:bg-blue-500 shadow-sm"
          style={{
            boxSizing: "border-box",
            top: "50%",
            left: "50%",
            animation: "idle-float-1 3s ease-in-out infinite",
          }}
        />
        {/* Second block (Orange) */}
        <div
          className="absolute w-[30px] h-[30px] bg-orange-500 dark:bg-orange-400 shadow-sm"
          style={{
            boxSizing: "border-box",
            top: "calc(50% - 30px)",
            left: "calc(50% - 30px)",
            animation: "idle-float-2 3s ease-in-out infinite",
          }}
        />

        <style>{`
          @keyframes idle-float-1 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes idle-float-2 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(8px); }
          }
        `}</style>
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Waiting ...
      </p>
    </div>
  );
};

export default IdleView;
