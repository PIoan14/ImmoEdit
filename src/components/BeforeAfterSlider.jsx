import { useState, useRef, useEffect, useCallback } from 'react';
import { DEMO_PAIRS, SVC_MAP } from '../data.js';

/**
 * Interactive Before/After comparison slider demonstrating the 3 exact backend services.
 * Shows perspective correction for Geometry, sky replacement & greenery for Nature,
 * and HDR window pull & manual retouch for Human Editor.
 */
export default function BeforeAfterSlider({ onSelectService }) {
  const [activePair, setActivePair] = useState(0);
  const [pos, setPos] = useState(50); // 0-100%
  const [showGrid, setShowGrid] = useState(false);
  const wrapRef = useRef(null);
  const dragging = useRef(false);

  const pair = DEMO_PAIRS[activePair] || DEMO_PAIRS[0];
  const svcInfo = SVC_MAP[pair.svcId] || {};

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

  const handleSelectServiceClick = () => {
    if (onSelectService) {
      onSelectService(pair.svcId);
    }
    const el = document.getElementById('servicii');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="ba-section" id="demo">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">Demo Live Cele 3 Servicii</div>
          <h2 className="section-title">
            Transformare <span>Înainte &amp; După</span>
          </h2>
          <p className="section-desc">
            Alege unul din cele 3 servicii de mai jos și trage slider-ul pentru a vedea exact ce transformări aplică fiecare serviciu pe fotografiile tăle.
          </p>
        </div>

        {/* 3 Service Tabs */}
        <div className="ba-tabs">
          {DEMO_PAIRS.map((p, i) => (
            <button
              key={p.id}
              id={`demo-tab-${p.id}`}
              className={`ba-tab ${activePair === i ? 'active' : ''}`}
              onClick={() => { setActivePair(i); setPos(50); setShowGrid(false); }}
            >
              <span className="ba-tab-icon">{p.icon}</span>
              <span className="ba-tab-title">{p.label}</span>
              <span className="ba-tab-price">{p.price}</span>
            </button>
          ))}
        </div>

        {/* Slider Box */}
        <div className="ba-container-outer">
          <div
            id="ba-slider"
            className="ba-wrapper"
            ref={wrapRef}
            onMouseDown={(e) => { dragging.current = true; handleMove(e.clientX); }}
            onTouchStart={(e) => { dragging.current = true; handleMove(e.touches[0].clientX); }}
          >
            {/* Before View (Original / Unedited layer) */}
            <div className="ba-layer before-layer">
              <img
                src={pair.beforeImg}
                alt="Înainte de editare"
                className="ba-img"
                style={pair.beforeStyle}
                draggable={false}
              />
              {/* Additional SVG sky or window overlays for before state if needed */}
              {pair.svcId === 'nature' && (
                <div className="demo-overcast-overlay" />
              )}
              {pair.svcId === 'human' && (
                <div className="demo-blown-windows-overlay" />
              )}
            </div>

            {/* After View (Clipped layer) */}
            <div
              className="ba-layer after-layer"
              style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
            >
              <img
                src={pair.afterImg}
                alt="După editare"
                className="ba-img"
                style={pair.afterStyle}
                draggable={false}
              />
              {pair.svcId === 'nature' && (
                <div className="demo-sunny-sky-overlay" />
              )}
            </div>

            {/* Visual Guide Grid Overlay */}
            {showGrid && (
              <div className="ba-grid-overlay">
                <div className="grid-line v-line-1" />
                <div className="grid-line v-line-2" />
                <div className="grid-line h-line-1" />
                <div className="grid-line h-line-2" />
                <span className="grid-tag">ALINIERE PERSPECTIVĂ & GRID</span>
              </div>
            )}

            {/* Divider Line & Handle */}
            <div className="ba-line" style={{ left: `${pos}%` }} />
            <div className="ba-handle" style={{ left: `${pos}%` }}>
              <span>‹</span><span>›</span>
            </div>

            {/* Floating Side Badges */}
            <div className="ba-floating-badges before">
              <span className="ba-label before-tag">ÎNAINTE (Brut)</span>
              {pair.beforeBadges.map((b, idx) => (
                <span key={idx} className="badge-item issue">{b}</span>
              ))}
            </div>

            <div className="ba-floating-badges after" style={{ opacity: pos > 15 ? 1 : 0.2 }}>
              <span className="ba-label after-tag">DUPĂ ({pair.shortLabel})</span>
              {pair.afterBadges.map((b, idx) => (
                <span key={idx} className="badge-item fix">{b}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid below slider */}
        {/* <div><img src="https://storage.cloud.google.com/original_pictures/dummy?authuser=1" alt="Descriere imagine"></img></div> */}
        <div className="demo-features-footer">
          <div className="demo-feature-card">
            <div className="df-icon">🎯</div>
            <div className="df-title">Rezultat Specific Serviciului</div>
            <div className="df-desc">Fiecare fotografie este procesată exact conform algoritmului sau instrucțiunilor serviciului selectat ({pair.label}).</div>
          </div>
          <div className="demo-feature-card">
            <div className="df-icon">⚡</div>
            <div className="df-title">Procesare 24-48 Ore</div>
            <div className="df-desc">Livrare rapidă direct în contul tău și în Google Cloud cu link protejat de descarcare.</div>
          </div>
          <div className="demo-feature-card">
            <div className="df-icon">🛡️</div>
            <div className="df-title">Garanție de Satisfacție</div>
            <div className="df-desc">O regenerare gratuită garantată sau retuș suplimentar de la editorul uman dacă dorești ajustări.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

