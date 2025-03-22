
import React from "react";

export function LoadingDots() {
  return (
    <div className="flex items-center space-x-1 px-2 py-1">
      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-loading-dot-1"></div>
      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-loading-dot-2"></div>
      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-loading-dot-3"></div>
    </div>
  );
}
