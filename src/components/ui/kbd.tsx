import { cn } from "@/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-7 min-h-7 w-fit min-w-7 shrink-0 items-center justify-center gap-1 rounded-md border border-border border-b-2 bg-linear-to-b from-muted to-muted/80 px-2 font-mono text-[11px] font-semibold text-foreground shadow-xs select-none",
        "[&_svg:not([class*='size-'])]:size-3",
        "[[data-slot=tooltip-content]_&]:border-0 [[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:from-transparent [[data-slot=tooltip-content]_&]:to-transparent [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
