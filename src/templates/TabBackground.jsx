import { useState, useEffect } from "react";

function TabBackground({ ts }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const imgs = ts.bgImages || [];

  useEffect(() => {
    if (ts.bgMode !== "slideshow" || imgs.length < 2) return;
    const iv = setInterval(() => {
      setFade(false);
      setTimeout(() => { setSlideIdx(i => (i+1) % imgs.length); setFade(true); }, 600);
    }, (ts.slideshowInterval || 5) * 1000);
    return () => clearInterval(iv);
  }, [ts.bgMode, imgs.length, ts.slideshowInterval]);

  if (!imgs.length || ts.bgMode === "none") return null;

  const src = imgs[ts.bgMode === "slideshow" ? slideIdx % imgs.length : 0];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}>
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:`url(${src})`,
        backgroundSize:"cover", backgroundPosition:"center",
        opacity: fade ? 1 : 0,
        transition:"opacity 0.6s ease",
      }} />
      <div style={{ position:"absolute", inset:0, background:`rgba(0,0,0,${ts.bgOverlay ?? 0.5})` }} />
    </div>
  );
}

export { TabBackground };
