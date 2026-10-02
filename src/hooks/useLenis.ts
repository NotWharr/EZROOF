import { createContext, useContext } from "react";
import type Lenis from "lenis";

// Shared Lenis instance so modals and fullscreen can lock/unlock
// background scroll without prop drilling.
export const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}
