const StatsSection = () => {
  return (
    <section className="px-6 pb-20">
      <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-8 text-center">
        <div>
          <p className="text-6xl sm:text-7xl md:text-[96px] leading-none font-black text-primary">
            0
          </p>
          <p className="text-2xl sm:text-3xl md:text-5xl font-semibold text-foreground">
            GitHub stars
          </p>
        </div>
        <div>
          <p className="text-6xl sm:text-7xl md:text-[96px] leading-none font-black text-primary">
            0
          </p>
          <p className="text-2xl sm:text-3xl md:text-5xl font-semibold text-foreground">
            GitHub forks
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
