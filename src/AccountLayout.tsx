import type { ReactNode } from "react";
import { SchoolBrand } from "./SchoolBrand";

export function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-dvh bg-canvas px-4 py-6 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        <a
          href="#/"
          className="mb-5 inline-flex rounded-md text-ink"
          aria-label="Westbridge Connect home"
        >
          <SchoolBrand />
        </a>
        <div className="rounded-xl border border-line border-t-4 border-t-navy bg-white p-5 sm:p-8">
          {children}
        </div>
      </div>
    </main>
  );
}
