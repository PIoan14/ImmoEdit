import { useState } from 'react';

/**
 * PortfolioSection – access gate for viewing edited photos.
 * No backend endpoint exists yet for validating the email/key, so this only
 * reveals the placeholder explanation locally; real validation gets wired
 * up once that endpoint exists.
 */
export default function PortfolioSection() {
  const [email, setEmail] = useState('');
  const [key, setKey] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleAccess = (e) => {
    e.preventDefault();
    if (!email || !key) return;
    setSubmitted(true);
  };

  return (
    <section className="portfolio-section" id="portofoliu">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Portofoliu</div>
          <h2 className="section-title">
            Accesează-ți <span>Pozele</span>
          </h2>
          <p className="section-desc">
            Introdu adresa de email și cheia primite pentru a accesa portofoliul comenzii tale.
          </p>
        </div>

        <div className="portfolio-gate">
          <form className="checkout-form" onSubmit={handleAccess}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                id="portfolio-email"
                className="form-input"
                type="email"
                placeholder="ion@agentie.ro"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cheie</label>
              <input
                id="portfolio-key"
                className="form-input"
                type="text"
                placeholder="Cheia primită la comandă"
                value={key}
                onChange={e => setKey(e.target.value)}
              />
            </div>
            <div className="flex-row mt-sm" style={{ justifyContent: 'flex-end' }}>
              <button id="portfolio-access" className="btn-primary" type="submit" disabled={!email || !key}>
                🔑 Accesează portofoliul
              </button>
            </div>
          </form>

          {submitted && (
            <div className="portfolio-placeholder">
              Aici vor apărea fotografiile editate după efectuarea plății și procesarea comenzii.
              Fotografiile vor putea fi descărcate sau retrimise ulterior.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
