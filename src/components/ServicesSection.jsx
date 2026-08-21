import { useState, useRef } from 'react';
import { SERVICES, SVC_MAP } from '../data.js';

/**
 * ServicesSection – three service cards + upload panel per service.
 * Uploaded files are accumulated into a shared cart array via onAddToCart.
 */
export default function ServicesSection({ onAddToCart, onOpenCart, selectedService = 'geometry', onSelectService }) {
  const [localService, setLocalService] = useState('geometry');
  const activeService = selectedService || localService;
  const setActiveService = (svcId) => {
    setLocalService(svcId);
    if (onSelectService) onSelectService(svcId);
  };
  const [files, setFiles] = useState({}); // { serviceId: [{ id, file, url, name }] }
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  const currentFiles = files[activeService] || [];

  const addFiles = (newFiles) => {
    const items = Array.from(newFiles)
      .filter(f => f.type.startsWith('image/'))
      .map(f => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file: f,
        url: URL.createObjectURL(f),
        name: f.name,
        svcId: activeService,
      }));
    if (!items.length) return;
    console.log(`[ImmoEdit Upload] Serviciu: "${activeService}" | ${items.length} poze adăugate:`, items.map(i => i.name));
    setFiles(prev => ({
      ...prev,
      [activeService]: [...(prev[activeService] || []), ...items],
    }));
  };

  const removeFile = (svcId, fileId) => {
    setFiles(prev => ({
      ...prev,
      [svcId]: (prev[svcId] || []).filter(f => f.id !== fileId),
    }));
  };

  const handleAddToCart = () => {
    const items = currentFiles.map(f => ({ ...f, svcId: activeService }));
    onAddToCart(items);
    setFiles(prev => ({ ...prev, [activeService]: [] }));
    onOpenCart();
  };

  const svc = SERVICES.find(s => s.id === activeService);

  return (
    <section className="services-section" id="servicii">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Servicii</div>
          <h2 className="section-title">
            Alege <span>Serviciul Potrivit</span>
          </h2>
          <p className="section-desc">
            Selectează tipul de editare și încarcă pozele. Prețul se calculează automat în coș.
          </p>
        </div>

        {/* Service Cards */}
        <div className="services-grid">
          {SERVICES.map(s => (
            <div
              key={s.id}
              id={`svc-card-${s.id}`}
              className={`service-card ${s.cardClass} ${activeService === s.id ? 'active' : ''}`}
              onClick={() => setActiveService(s.id)}
            >
              <span className={`svc-badge ${s.badge}`}>{s.badgeText}</span>
              <div className={`svc-icon ${s.cardClass}`}>{s.icon}</div>
              <div className="svc-title">{s.label}</div>
              <div className="svc-desc">{s.desc}</div>
              <div className="svc-price">{s.priceLabel}</div>
              <div className="svc-price-sub">per fotografie editată</div>
            </div>
          ))}
        </div>

        {/* Upload Panel */}
        <div className="upload-panel">
          <div className="upload-panel-header">
            <span style={{ fontSize: '1.4rem' }}>{svc.icon}</span>
            <div>
              <div className="upload-panel-title">Upload – {svc.label}</div>
              <div className="upload-panel-desc">Adaugă pozele pentru acest serviciu. {svc.priceLabel}.</div>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            id={`drop-zone-${activeService}`}
            className={`upload-drop-zone ${drag ? 'drag' : ''}`}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={e => addFiles(e.target.files)}
            />
            <div className="upload-drop-icon">📷</div>
            <div className="upload-drop-label">Trage pozele aici sau click pentru a selecta</div>
            <div className="upload-drop-hint">Acceptăm JPG, PNG, HEIC, WEBP</div>
            <div className="upload-drop-types">Maximum 50 MB per fișier · Multiple fișiere acceptate</div>
          </div>

          {/* Uploaded files preview grid */}
          {currentFiles.length > 0 && (
            <div className="upload-files-grid">
              {currentFiles.map(f => (
                <div key={f.id} className="upload-file-item">
                  <img src={f.url} alt={f.name} className="upload-file-thumb" />
                  <div className="upload-file-overlay">
                    <span className="upload-file-name">{f.name}</span>
                    <span className="upload-file-svc">{SVC_MAP[activeService]?.shortLabel}</span>
                  </div>
                  <button
                    id={`remove-${f.id}`}
                    className="upload-file-remove"
                    onClick={e => { e.stopPropagation(); removeFile(activeService, f.id); }}
                    title="Șterge"
                  >✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Add to cart button */}
          <button
            id={`add-to-cart-${activeService}`}
            className="upload-add-btn"
            disabled={currentFiles.length === 0}
            onClick={handleAddToCart}
          >
            {currentFiles.length === 0
              ? '→ Adaugă poze pentru a continua'
              : `🛒 Adaugă ${currentFiles.length} ${currentFiles.length === 1 ? 'poză' : 'poze'} în coș – ${(currentFiles.length * svc.price).toFixed(0)} €`
            }
          </button>
        </div>
      </div>
    </section>
  );
}
