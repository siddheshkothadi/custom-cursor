import { useEffect, useRef } from "react";

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

const mousePosition = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

const CustomCursor = () => {
  const circleRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMouseMove = (e: any) => {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    };

    const moveCursor = (reference: HTMLElement, amount: number): number => {
      const prevLeft =
        reference.style.left === ""
          ? window.innerWidth / 2
          : parseFloat(reference.style.left);

      const prevTop =
        reference.style.top === ""
          ? window.innerHeight / 2
          : parseFloat(reference.style.top);

      const lerpX = lerp(prevLeft, mousePosition.x, amount);
      const lerpY = lerp(prevTop, mousePosition.y, amount);

      reference.style.left = lerpX + "px";
      reference.style.top = lerpY + "px";

      return requestAnimationFrame(() => moveCursor(reference, amount));
    };

    document.addEventListener("mousemove", onMouseMove);

    let circleAnimationFrameId: number;
    let dotAnimationFrameId: number;

    if (circleRef.current && dotRef.current) {
      circleAnimationFrameId = moveCursor(circleRef.current, 0.1);
      dotAnimationFrameId = moveCursor(dotRef.current, 0.2);
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(circleAnimationFrameId);
      cancelAnimationFrame(dotAnimationFrameId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot"></div>
      <div ref={circleRef} className="cursor-circle"></div>
    </>
  );
};

export default CustomCursor;
