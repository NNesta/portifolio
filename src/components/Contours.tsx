import { useEffect, useRef } from "react";
import { drawContours } from "../lib/contours";

/** The hero's topographic lines. All the drawing lives in lib/contours.ts. */
export function Contours() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => (canvas.current ? drawContours(canvas.current) : undefined), []);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="contour-mask pointer-events-none absolute inset-0 -z-10 size-full print:hidden"
    />
  );
}
