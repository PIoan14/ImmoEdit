import { useState, useRef, useEffect, useCallback } from 'react';
import { DEMO_PAIRS } from '../data.js';

/**
 * Interactive Before/After comparison slider.
 * Drag the handle left/right to reveal before vs after.
 */
export default function BeforeAfterSlider() {
  const [activePair, setActivePair] = useState(0);
  const [pos, setPos] = useState(50); // 0-100
  const wrapRef = useRef(null);
  const dragging = useRef(false);

  const pair = DEMO_PAIRS[activePair];

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  const handleMove = useCallback((clientX) => {
    if (!wrapRef.current) return;
    const { left, width } = wrapRef.current.getBoundingClientRect();
    const pct = clamp(((clientX - left) / width) * 100, 2, 98);
    setPos(pct);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      handleMove(e.touches ? e.touches[0].clientX : e.clientX);
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [handleMove]);

  return (
    <section className="ba-section" id="demo">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Demo Live</div>
          <h2 className="section-title">
            Înainte <span>&amp; După</span>
          </h2>
          <p className="section-desc">
            Trage slider-ul pentru a vedea transformarea. Rezultate reale din proiectele noastre.
          </p>
        </div>

        {/* Category tabs */}
        <div className="ba-tabs">
          {DEMO_PAIRS.map((p, i) => (
            <button
              key={p.id}
              id={`demo-tab-${p.id}`}
              className={`ba-tab ${activePair === i ? 'active' : ''}`}
              onClick={() => { setActivePair(i); setPos(50); }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div
          id="ba-slider"
          className="ba-wrapper"
          ref={wrapRef}
          onMouseDown={(e) => { dragging.current = true; handleMove(e.clientX); }}
          onTouchStart={(e) => { dragging.current = true; handleMove(e.touches[0].clientX); }}
        >
          {/* Before */}
          <img src={pair.before} alt="Înainte de editare" className="ba-img before" draggable={false} />

          {/* After (clipped) */}
          <img
            src={pair.after}
            alt="După editare"
            className="ba-img after"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
            draggable={false}
          />

          {/* Divider line */}
          <div className="ba-line" style={{ left: `${pos}%` }} />

          {/* Handle */}
          <div className="ba-handle" style={{ left: `${pos}%` }}>⇔</div>

          {/* Labels */}
          <span className="ba-label before">ÎNAINTE</span>
          <span className="ba-label after">DUPĂ</span>
        </div>
      </div>
    </section>
  );
}
