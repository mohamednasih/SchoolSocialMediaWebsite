import React from "react";

interface AvatarProps {
  text: string;
  tone: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  online?: boolean;
  className?: string;
}

export function Avatar({ text, tone, size = "md", online, className = "" }: AvatarProps) {
  const sizeMap = {
    xs: "h-7 w-7 text-[10px]",
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-13 w-13 text-base",
    xl: "h-20 w-20 text-2xl font-black",
    "2xl": "h-24 w-24 text-3xl font-black",
  };

  const badgeSizeMap = {
    xs: "h-2 w-2 border-[1.5px] -bottom-0.5 -right-0.5",
    sm: "h-2.5 w-2.5 border-[2px] bottom-0 right-0",
    md: "h-3.5 w-3.5 border-2 bottom-0 right-0",
    lg: "h-4 w-4 border-2 bottom-0.5 right-0.5",
    xl: "h-5 w-5 border-[3px] bottom-1 right-1",
    "2xl": "h-6 w-6 border-4 bottom-1 right-1",
  };

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${sizeMap[size]} ${tone} flex items-center justify-center rounded-2xl font-bold tracking-tight shadow-sm ring-2 ring-white/90 select-none transition-transform hover:scale-105`}
        aria-hidden="true"
      >
        {text}
      </div>
      {online !== undefined && (
        <span
          className={`absolute rounded-full border-white shadow-xs ${
            online ? "bg-emerald-500" : "bg-slate-300"
          } ${badgeSizeMap[size]}`}
          title={online ? "Online" : "Offline"}
        />
      )}
    </div>
  );
}
