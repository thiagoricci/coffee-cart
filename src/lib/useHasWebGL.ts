"use client";

import { useEffect, useState } from "react";

/**
 * Whether this browser can give us a WebGL context. OpenStreetMap's embed now
 * requires one and paints its own blue "your browser does not support WebGL"
 * panel when it is missing, which lands inside our cream card.
 *
 * `null` means "not probed yet": the caller keeps showing the embed, so the
 * common case never flashes a fallback. The probe runs once, on mount.
 */
export function useHasWebGL(): boolean | null {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    let supported = false;
    try {
      const canvas = document.createElement("canvas");
      supported = !!(
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      );
    } catch {
      supported = false;
    }
    setHasWebGL(supported);
  }, []);

  return hasWebGL;
}
