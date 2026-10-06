import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white border border-borda rounded-app px-5 py-[18px] ${className}`}
      {...props}
    />
  );
}
