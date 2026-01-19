import React from "react";
import { cn } from "@/lib/utils";

/**
 * Interactive discovery point with pulsing animation
 * Positioned absolutely on the background image
 */
function DiscoveryPoint({ 
  position, // { top, left } in percentages
  label,
  number,
  onClick,
  isActive = false 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute z-10 flex items-center justify-center",
        "w-10 h-10 rounded-full",
        "bg-white/90 backdrop-blur-sm",
        "shadow-lg cursor-pointer",
        "transition-all duration-300 ease-out",
        "hover:scale-110 hover:bg-white",
        "focus:outline-none focus:ring-2 focus:ring-white/50",
        isActive && "scale-110 bg-white"
      )}
      style={{
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -50%)"
      }}
      aria-label={`Point ${number}: ${label}`}
    >
      {/* Pulsing ring animation */}
      <span 
        className={cn(
          "absolute inset-0 rounded-full",
          "animate-ping bg-white/40"
        )}
        style={{ animationDuration: "2s" }}
      />
      
      {/* Inner dot */}
      <span 
        className={cn(
          "relative w-3 h-3 rounded-full",
          "bg-blue-600"
        )}
      />
    </button>
  );
}

export default DiscoveryPoint;
