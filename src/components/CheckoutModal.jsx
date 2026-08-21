import { useState, useEffect } from 'react';
import { SVC_MAP } from '../data.js';

const PROCESSING_STEPS = [
  { id: 'upload',  label: 'Se uploadează pozele…' },
  { id: 'queue',   label: 'Se adaugă în coadă de procesare…' },
  { id: 'ai',      label: 'Se aplică corecțiile AI…' },
  { id: 'review',  label: 'Verificare calitate finală…' },
  { id: 'cloud',   label: 'Se stochează în Google Cloud (7 zile)…' },
  { id: 'send',    label: 'Se finalizează trimiterea…' },
];

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * CheckoutModal – multi-step: info form → summary → processing → result.
 * The processing animation always plays out, but the result step (success
 * or failure) reflects the actual outcome of the POST to the local server.
 */
export default function CheckoutModal({ isOpen, onClose, items, onOrderSuccess }) {
  const [step, setStep] = useState(1); // 1=form, 2=summary, 3=processing, 4=result
  const [procStep, setProcStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });

  const total = items.reduce((s, it) => s + (SVC_MAP[it.svcId]?.price || 0), 0);

  // Reset on open
  useEffect(() => {
    if (isOpen) { setStep(1); setProcStep(0); setError(null); }
  }, [isOpen]);

  // Cosmetic step-by-step reveal while the real request is in flight
  useEffect(() => {
    if (step !== 3) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i < PROCESSING_STEPS.length) setProcStep(i);
      else clearInterval(timer);
    }, 900);
    return () => clearInterval(timer);
  }, [step]);

  const handlePay = async () => {
    if (!form.name || !form.email || submitting) return;
    setSubmitting(true);
    setError(null);
    setStep(3);
    setProcStep(0);

    const minDuration = new Promise(res => setTimeout(res, PROCESSING_STEPS.length * 900));

    try {
      const pictures = await Promise.all(items.map(async it => ({
        price: SVC_MAP[it.svcId]?.price || 0,
        task: it.svcId,
        picture_content: await fileToBase64(it.file),
      })));

      console.log("Here")
      const request = fetch('http://localhost:8001/ReceiveNest', {
        method: 'POST',
        headers: { accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().slice(0, 10),
          pictures,
          total_price: total,
        }),
      }).then(res => {
        if (!res.ok) throw new Error(`Server a răspuns cu status ${res.status}`);
      });

      await Promise.all([request, minDuration]);
      setStep(4);
      onOrderSuccess();
    } catch (error) {
      await minDuration;

      console.log("Error :" + error)
      setError(
        error instanceof Error
          ? error.message
          : 'A apărut o eroare necunoscută.'
      );
      //setError('Trimiterea comenzii a eșuat. Verifică conexiunea și încearcă din nou.');
      setStep(4);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setStep(2);
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
            {step === 4 && (error ? '❌ Comandă Eșuată' : '✅ Comandă Trimisă!')}
          </span>
          {!submitting && <button id="checkout-modal-close" className="modal-close" onClick={onClose}>✕</button>}
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
                <button id="checkout-pay" className="btn-primary" disabled={submitting} onClick={handlePay}>
                  {submitting ? '⏳ Se trimite…' : `💳 Plătește €${total.toFixed(2)}`}
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

          {/* Step 4 – Result: success or failure */}
          {step === 4 && !error && (
            <div className="processing-anim">
              <div className="success-icon-wrap" style={{ margin: '0 auto var(--gap-md)' }}>✅</div>
              <div className="processing-title">Comanda a fost trimisă cu succes!</div>
              <div className="processing-desc">Te contactăm pe email când pozele sunt gata.</div>
              <div className="flex-row mt-sm" style={{ justifyContent: 'center' }}>
                <button id="checkout-done-close" className="btn-primary" onClick={onClose}>Închide</button>
              </div>
            </div>
          )}
          {step === 4 && error && (
            <div className="processing-anim">
              <div className="success-icon-wrap" style={{ margin: '0 auto var(--gap-md)', background: 'rgba(232,110,110,0.12)', border: '1px solid rgba(232,110,110,0.3)' }}>❌</div>
              <div className="processing-title">{error}</div>
              <div className="flex-row mt-sm" style={{ justifyContent: 'center' }}>
                <button id="checkout-retry" className="btn-primary" onClick={handleRetry}>Încearcă din nou</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
