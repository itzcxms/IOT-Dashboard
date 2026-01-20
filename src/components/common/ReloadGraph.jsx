import React from "react";
import { RefreshCw } from "lucide-react";

function ReloadGraph({ nom, data, getDataGraph }) {
  return (
    <button
      type="button"
      className={
        "h-9 px-4 py-2 has-[>svg]:px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
      }
      onClick={() => getDataGraph(nom, data[0] ?? null, data[1] ?? null)}
    >
      <RefreshCw size={8} />
    </button>
  );
}

export default ReloadGraph;
