"use client";

import { useEffect, useState } from "react";

/**
 * True only for pointers that can genuinely hover. Touch browsers fire a
 * synthetic mouseenter on tap, so hover-driven UI has to be switched off there:
 * without this a tapped card stays stuck open, because the second tap clears the
 * pin while the phantom hover still holds it.
 *
 * Starts false so the server and the first client render agree; a real desktop
 * pointer flips it on mount.
 */
export function useCanHover(): boolean {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return canHover;
}
