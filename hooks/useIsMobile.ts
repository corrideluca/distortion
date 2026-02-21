import { useState, useEffect } from "react";

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(true); // default true avoids SSR flash
  useEffect(() => {
    setIsMobile(window.innerWidth < breakpoint);
  }, [breakpoint]);
  return isMobile;
}
