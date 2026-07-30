import { useState, useEffect } from 'react';
import { SVC_MAP } from '../data.js';

const PROCESSING_STEPS = [
  { id: 'upload',  label: 'Se uploadează pozele…' },
  { id: 'queue',   label: 'Se adaugă în coadă de procesare…' },
  { id: 'ai',      label: 'Se aplică corecțiile AI…' },
  { id: 'review',  label: 'Verificare calitate finală…' },
  { id: 'cloud',   label: 'Se stochează în Google Cloud (7 zile)…' },
  { id: 'done',    label: 'Gata! Preview disponibil.' },
];

/**
 * CheckoutModal – multi-step: info form → summary → processing → done.
 * After "processing" completes it calls onProcessingDone to open preview.
 */
export default function CheckoutModal({ isOpen, onClose, items, onProcessingDone }) {
  const [step, setStep] = useState(1); // 1=form, 2=summary, 3=processing, 4=done
  const [procStep, setProcStep] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });

  const total = items.reduce((s, it) => s + (SVC_MAP[it.svcId]?.price || 0), 0);

  // Reset on open
  useEffect(() => {
    if (isOpen) { setStep(1); setProcStep(0); }
  }, [isOpen]);

  // Animate processing steps
  useEffect(() => {
    if (step !== 3) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setProcStep(i);
      if (i >= PROCESSING_STEPS.length) {
        clearInterval(timer);
        setStep(4);
        setTimeout(() => {
          onClose();
          onProcessingDone();
        }, 1200);
      }
    }, 900);
    return () => clearInterval(timer);
  }, [step, onClose, onProcessingDone]);

  const handlePay = () => {
    if (!form.name || !form.email) return;
    setStep(3);
    console.log('[ImmoEdit Checkout] Plată inițiată:', { ...form, items: items.map(i => ({ name: i.name, svc: i.svcId })), total });
  };

  if (!isOpen) return null;

  return (
    <div id="checkout-modal-overlay" className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal" id="checkout-modal">
        <div className="modal-header">
          <span className="modal-title">
            {step === 1 && '📋 Datele Tale'}
            {step === 2 && '🧾 Sumar Comandă'}
            {step === 3 && '⏳ Se Procesează…'}
            {step === 4 && '✅ Comandă Plasată!'}
          </span>
          {step < 3 && <button id="checkout-modal-close" className="modal-close" onClick={onClose}>✕</button>}
        </div>

        <div className="modal-body">
          {/* Step indicator */}
          <div className="checkout-step-bar">
            {['Date', 'Sumar', 'Procesare'].map((lbl, i) => (
              <div key={lbl} className={`checkout-step ${step - 1 === i ? 'active' : step - 1 > i ? 'done' : ''}`}>
                {lbl}
              </div>
            ))}
          </div>

          {/* Step 1 – Form */}
          {step === 1 && (
            <div className="checkout-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nume complet *</label>
                  <input id="checkout-name" className="form-input" placeholder="Ion Popescu" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon</label>
                  <input id="checkout-phone" className="form-input" placeholder="+40 721 000 000" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input id="checkout-email" className="form-input" type="email" placeholder="ion@agentie.ro" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Observații (opțional)</label>
                <input id="checkout-notes" className="form-input" placeholder="Ex: fara lumina flash, stil minimalist…" value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} />
              </div>
              <div className="flex-row mt-sm" style={{ justifyContent: 'flex-end' }}>
                <button id="checkout-next" className="btn-primary" disabled={!form.name || !form.email} onClick={() => setStep(2)}>
                  Continuă →
                </button>
              </div>
            </div>
          )}

          {/* Step 2 – Summary */}
          {step === 2 && (
            <>
              <div className="checkout-summary">
                {items.map(item => {
                  const svc = SVC_MAP[item.svcId];
                  return (
                    <div key={item.id} className="checkout-summary-item">
                      <img src={item.url} alt={item.name} className="checkout-summary-thumb" />
                      <span className="checkout-summary-name">{item.name}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{svc?.icon} {svc?.shortLabel}</span>
                      <span className="checkout-summary-price">€{svc?.price}</span>
                    </div>
                  );
                })}
                <div className="checkout-total">
                  <span className="checkout-total-label">Total de plată</span>
                  <span className="checkout-total-value">€{total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                <button id="checkout-back" className="btn-secondary" onClick={() => setStep(1)}>← Înapoi</button>
                <button id="checkout-pay" className="btn-primary" onClick={handlePay}>
                  💳 Plătește €{total.toFixed(2)}
                </button>
              </div>
            </>
          )}

          {/* Step 3 – Processing */}
          {step === 3 && (
            <div className="processing-anim">
              <div className="processing-spinner" />
              <div className="processing-title">Se procesează pozele tale</div>
              <div className="processing-desc">Te rugăm să nu închizi această fereastră.</div>
              <div className="processing-steps">
                {PROCESSING_STEPS.map((ps, i) => (
                  <div key={ps.id} className={`proc-step ${i < procStep ? 'done' : i === procStep ? 'active' : 'pending'}`}>
                    <div className="proc-step-icon">
                      {i < procStep ? '✓' : i === procStep ? '◌' : '○'}
                    </div>
                    {ps.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 – Done flash */}
          {step === 4 && (
            <div className="processing-anim">
              <div className="success-icon-wrap" style={{ margin: '0 auto var(--gap-md)' }}>✅</div>
              <div className="processing-title">Procesare completă!</div>
              <div className="processing-desc">Se deschide preview-ul…</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
