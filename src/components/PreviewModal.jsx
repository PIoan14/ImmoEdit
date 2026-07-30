import { useState } from 'react';
import { SVC_MAP } from '../data.js';

const FAKE_DRIVE_URL = 'https://drive.google.com/drive/folders/ImmoEdit_DEMO_LINK_1234';

/**
 * PreviewModal – protected photo preview with like/dislike flow.
 *
 * Attempt flow:
 *  attempt=1 → first preview → like → download | dislike → free AI regen (attempt 2)
 *  attempt=2 → regen preview → like → download | dislike → human editor (attempt 3)
 *  attempt=3 → human editor preview → like → download | dislike → REFUND
 */
export default function PreviewModal({ isOpen, onClose, items, onPortfolioAdd }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [attempt, setAttempt] = useState(1);
  const [obs, setObs] = useState('');
  const [phase, setPhase] = useState('preview'); // 'preview' | 'regen' | 'download' | 'refund'

  if (!isOpen || items.length === 0) return null;

  const photo = items[photoIdx];
  const svc = SVC_MAP[photo?.svcId];
  const total = items.length;

  const handleLike = () => {
    console.log(`[ImmoEdit Preview] 👍 LIKE – ${photo.name} – Attempt ${attempt}`);
    onPortfolioAdd({ ...photo, attempt });
    setPhase('download');
  };

  const handleDislike = () => {
    console.log(`[ImmoEdit Preview] 👎 DISLIKE – ${photo.name} – Obs: "${obs}" – Attempt ${attempt}`);
    if (attempt < 3) {
      setAttempt(a => a + 1);
      setObs('');
      setPhase('regen');
      setTimeout(() => setPhase('preview'), 2000);
    } else {
      setPhase('refund');
    }
  };

  const attemptLabel = {
    1: 'Preview inițial',
    2: 'Regenerare AI gratuită',
    3: 'Editor uman – revizuire finală',
  };
  const attemptColor = { 1: '#c49ae8', 2: '#8de8d5', 3: '#e8c49a' };

  return (
    <div id="preview-modal-overlay" className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal modal-wide" id="preview-modal">
        <div className="modal-header">
          <span className="modal-title">🔒 Preview Protejat – Poza {photoIdx + 1}/{total}</span>
          <button id="preview-modal-close" className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          {/* Photo nav dots */}
          {total > 1 && (
            <div className="preview-nav" style={{ pointerEvents: 'all', marginBottom: 'var(--gap-sm)', display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
              {items.map((_, i) => (
                <button
                  key={i}
                  id={`prev-dot-${i}`}
                  onClick={() => { setPhotoIdx(i); setAttempt(1); setPhase('preview'); setObs(''); }}
                  style={{
                    width: 10, height: 10, borderRadius: '50%',
                    border: 'none', cursor: 'pointer',
                    background: i === photoIdx ? 'var(--gold-1)' : 'var(--color-border-2)',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}

          {/* Attempt badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--gap-sm)' }}>
            <span className="preview-attempt-badge" style={{ borderColor: `${attemptColor[attempt]}40`, color: attemptColor[attempt], background: `${attemptColor[attempt]}15` }}>
              🔄 {attemptLabel[attempt]}
            </span>
          </div>

          {/* REGEN Loading */}
          {phase === 'regen' && (
            <div className="processing-anim" style={{ padding: 'var(--gap-md) 0' }}>
              <div className="processing-spinner" />
              <div className="processing-title">
                {attempt === 2 ? 'Regenerare AI în curs…' : 'Editor uman procesează…'}
              </div>
              <div className="processing-desc">
                {attempt === 2 ? 'Aplicăm corecțiile AI. Gratis.' : 'Trimitând la echipa noastră de editori.'}
              </div>
            </div>
          )}

          {/* Protected Preview */}
          {phase === 'preview' && photo && (
            <div className="preview-protected">
              {/* Shield notice */}
              <div className="preview-shield">
                <div className="preview-shield-icon">🛡️</div>
                <div className="preview-shield-text">
                  Această imagine este protejată · Screenshot și înregistrarea ecranului sunt dezactivate · Descărcarea este disponibilă doar după aprobare
                </div>
              </div>

              {/* Image with watermark */}
              <div className="preview-img-wrap">
                <img src={photo.url} alt="Preview" className="preview-img" />
                <div className="preview-watermark">ImmoEdit PREVIEW</div>
              </div>

              {/* Feedback actions */}
              <div className="preview-feedback" style={{ pointerEvents: 'all' }}>
                <div className="preview-feedback-title">Ești mulțumit de rezultat?</div>
                <div className="preview-obs">
                  <textarea
                    id="preview-obs-input"
                    placeholder="Adaugă o observație (opțional)…"
                    value={obs}
                    onChange={e => setObs(e.target.value)}
                    style={{ pointerEvents: 'all' }}
                  />
                </div>
                <div className="preview-actions">
                  <button id="preview-dislike-btn" className="btn-danger" onClick={handleDislike}>
                    👎 Nu îmi place
                    {attempt < 3 ? ' (regenerare gratuită)' : ' (ramburs)'}
                  </button>
                  <button id="preview-like-btn" className="btn-success" onClick={handleLike}>
                    👍 Îmi place · Descarcă
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DOWNLOAD SUCCESS */}
          {phase === 'download' && (
            <div className="download-success">
              <div className="success-icon-wrap">🎉</div>
              <div className="success-title">Poza ta este gata!</div>
              <div className="success-desc">
                Link-ul de descărcare a fost trimis pe email. Pozele vor fi disponibile în Drive pentru 7 zile.
              </div>
              <div className="drive-link-box">
                <span className="drive-link-icon">📁</span>
                <span className="drive-link-url">{FAKE_DRIVE_URL}</span>
                <button
                  id="copy-drive-link"
                  className="drive-link-copy"
                  onClick={() => { navigator.clipboard?.writeText(FAKE_DRIVE_URL); }}
                >
                  Copiază
                </button>
              </div>
              {photoIdx < total - 1 ? (
                <button id="preview-next-photo" className="btn-primary" onClick={() => { setPhotoIdx(i => i + 1); setAttempt(1); setPhase('preview'); setObs(''); }}>
                  Continuă cu poza {photoIdx + 2} →
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 'var(--gap-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button id="preview-view-portfolio" className="btn-primary" onClick={onClose}>
                    📸 Vezi Portofoliu
                  </button>
                  <button id="preview-close-done" className="btn-secondary" onClick={onClose}>
                    Închide
                  </button>
                </div>
              )}
            </div>
          )}

          {/* REFUND */}
          {phase === 'refund' && (
            <div className="download-success">
              <div className="success-icon-wrap" style={{ background: 'rgba(248,122,122,0.12)', borderColor: 'rgba(248,122,122,0.3)' }}>💸</div>
              <div className="success-title" style={{ color: '#f87a7a' }}>Ramburs inițiat</div>
              <div className="success-desc">
                Ne pare rău că nu am atins așteptările tale. Suma plătită va fi rambursată în 3-5 zile lucrătoare.
              </div>
              <button id="refund-close-btn" className="btn-secondary" onClick={onClose}>Închide</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
