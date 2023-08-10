import { useEffect, useRef } from "react";

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

const mousePosition = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

const prevPosition = {
  x: mousePosition.x,
  y: mousePosition.y,
};

const diff = {
  x: 0,
  y: 0,
};

const SMALLEST_POSSIBLE_WIDTH = 36;
const LARGEST_POSSIBLE_HEIGHT = 60;

let theta = 0;

const BubbleCursor = () => {
  const circleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMouseMove = (e: any) => {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    };
    
    const moveCursor = (reference: HTMLElement, amount: number): number => {
      prevPosition.x =
      reference.style.left === ""
      ? window.innerWidth / 2
      : parseFloat(reference.style.left);
      
      prevPosition.y =
      reference.style.top === ""
      ? window.innerHeight / 2
      : parseFloat(reference.style.top);
      
      diff.x = mousePosition.x - prevPosition.x;
      diff.y = mousePosition.y - prevPosition.y;
      
      let width = 48;
      let height = 48;
      
      if (Math.abs(diff.x) < 1.5 && Math.abs(diff.y) < 1.5) {
        reference.style.width = width + "px";
        reference.style.height = height + "px";
      } else {
        // width should always be smaller
        // calculate the distance with pythagoras thm.
        const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);

        // define the extent by which the width and height should change
        const extent = Math.min(dist * 0.16, 100);

        width = width - extent < SMALLEST_POSSIBLE_WIDTH ? SMALLEST_POSSIBLE_WIDTH : width - extent;
        height = height + extent > LARGEST_POSSIBLE_HEIGHT ? LARGEST_POSSIBLE_HEIGHT : height + extent;

        theta = Math.atan(diff.y / diff.x) * 180 / Math.PI - (90);

        reference.style.transform = `translate(-50%, -50%) rotate(${theta}deg)`;
        reference.style.width = width + "px";
        reference.style.height = height + "px";
      }

      const lerpX = lerp(prevPosition.x, mousePosition.x, amount);
      const lerpY = lerp(prevPosition.y, mousePosition.y, amount);

      reference.style.left = lerpX + "px";
      reference.style.top = lerpY + "px";

      return requestAnimationFrame(() => moveCursor(reference, amount));
    };

    let circleAnimationFrameId: number;

    if (circleRef.current) {
      document.addEventListener("mousemove", onMouseMove);
      circleAnimationFrameId = moveCursor(circleRef.current, 0.16);
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(circleAnimationFrameId);
    };
  }, []);

  return (
    <div ref={circleRef} className="cursor-circle"></div>
  );
};

export default BubbleCursor;
