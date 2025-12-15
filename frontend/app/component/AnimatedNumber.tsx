import { useState, useEffect } from "react";

export function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  return (
    <span
      className={`transition-all duration-300 inline-block ${
        animating ? "scale-150 text-yellow-400" : ""
      }`}
    >
      {value}
    </span>
  );
}
