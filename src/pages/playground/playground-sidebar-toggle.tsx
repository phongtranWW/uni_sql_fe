interface PlaygroundSidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const PlaygroundSidebarToggle = ({
  isOpen,
  onToggle,
}: PlaygroundSidebarToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 hover:bg-accent rounded-md transition-colors"
      aria-label="Toggle schema panel"
      title={isOpen ? "Hide schema" : "Show schema"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
      </svg>
    </button>
  );
};

export default PlaygroundSidebarToggle;
