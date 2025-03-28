"use client";

import { cn } from "@/lib/utils";

interface LinearLoaderProps {
  className?: string;
}

export const LinearLoader = ({ className }: LinearLoaderProps) => {
  return (
    <div className={cn("absolute top-0 left-0 right-0 h-0.5", className)}>
      <div className="h-full bg-primary/20" />
      <div className="absolute top-0 left-0 h-full w-[30%] bg-primary [animation:linear-loading_1s_ease-in-out_infinite] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent" />
    </div>
  );
}; 