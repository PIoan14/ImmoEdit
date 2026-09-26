import { useState, useEffect } from 'react';
import { SERVICES, HOW_STEPS, DEMO_PAIRS } from './data.js';
import BeforeAfterSlider   from './components/BeforeAfterSlider.jsx';
import ServicesSection     from './components/ServicesSection.jsx';
import CartSidebar         from './components/CartSidebar.jsx';
import CheckoutModal       from './components/CheckoutModal.jsx';
import ReceivedPhotosSection from './components/ReceivedPhotosSection.jsx';
import { useToast, ToastContainer } from './components/Toast.jsx';

/* ═══════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════ */
function Navbar({ cartCount, onOpenCart, onNav, activePage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { id: 'demo',      label: '▶ Demo',       page: 'home',  section: 'demo' },
    { id: 'servicii',  label: '⚙ Servicii',   page: 'home',  section: 'servicii' },
    { id: 'primite',   label: '📥 Fotografii primite', page: 'received', section: null },
  ];

  const handleNav = (link) => {
    setMenuOpen(false);
    if (!link.section) { onNav(link.page); window.scrollTo({ top: 0 }); return; }
    onNav('home');
    setTimeout(() => document.getElementById(link.section)?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <>
      <nav id="main-navbar" className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <a href="#" id="nav-logo" className="nav-logo" onClick={e => { e.preventDefault(); onNav('home'); }}>
            <div className="nav-logo-icon">IE</div>
            <span className="nav-logo-text">ImmoEdit</span>
          </a>

          <ul className="nav-links">
            {navLinks.map(link => (
              <li key={link.id}>
                <button
                  id={`nav-${link.id}`}
                  className={`nav-btn ${activePage === link.page ? 'active' : ''}`}
                  onClick={() => handleNav(link)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="nav-right">
            <button id="nav-cart-btn" className="cart-btn" onClick={onOpenCart}>
              🛒 Coș
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button id="nav-cta" className="btn-primary" onClick={() => { onNav('home'); setTimeout(() => document.getElementById('servicii')?.scrollIntoView({ behavior: 'smooth' }), 50); }}>
              Încarcă Acum
            </button>
            <button
              id="nav-hamburger"
              className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(m => !m)}
              aria-label="Meniu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`nav-mobile ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <button key={link.id} id={`mob-${link.id}`} className="nav-btn" onClick={() => handleNav(link)}>
            {link.label}
          </button>
        ))}
        <button id="mob-cart" className="cart-btn w-full" style={{ justifyContent: 'center' }} onClick={() => { setMenuOpen(false); onOpenCart(); }}>
          🛒 Coș {cartCount > 0 && `(${cartCount})`}
        </button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   HERO PREVIEW – fanned "hand" of demo photos (front card links to demo)
═══════════════════════════════════════════════ */
function HeroPreview() {
  const pair = DEMO_PAIRS.find(p => p.svcId === 'nature') || DEMO_PAIRS[0];
  const sidePairs = DEMO_PAIRS.filter(p => p.id !== pair.id).slice(0, 2);
  const goToDemo = () => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="hero-visual">
      <div className="hero-hand">
        {sidePairs.map((p, i) => (
          <div key={p.id} className={`hero-card hero-card-side ${i === 0 ? 'left' : 'right'}`} aria-hidden="true">
            <span className="hero-preview-img">
              <img src={p.afterImg} alt="" style={p.afterStyle} draggable={false} />
            </span>
            <span className="hero-preview-caption">
              <span>{p.icon} {p.label}</span>
            </span>
          </div>
        ))}

        <button type="button" className="hero-card hero-preview" onClick={goToDemo} aria-label="Vezi demo înainte și după">
          <span className="hero-preview-img">
            <span className="hero-preview-layer">
              <img src={pair.beforeImg} alt="" style={pair.beforeStyle} draggable={false} />
              <span className="demo-overcast-overlay" />
            </span>
            <span className="hero-preview-layer after">
              <img src={pair.afterImg} alt="" style={pair.afterStyle} draggable={false} />
              <span className="demo-sunny-sky-overlay" />
            </span>
            <span className="hero-preview-divider" />
            <span className="ba-label before-tag hero-preview-tag left">ÎNAINTE</span>
            <span className="ba-label after-tag hero-preview-tag right">DUPĂ</span>
          </span>
          <span className="hero-preview-caption">
            <span>{pair.icon} {pair.label}</span>
            <span className="hero-preview-price">{pair.price}</span>
          </span>
        </button>
      </div>

      <div className="hero-chips">
        <span className="hero-chip">☀ Cer înlocuit automat</span>
        <span className="hero-chip">⚡ Livrare în 24h</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════ */
function Hero({ onExplore }) {
  return (
    <section className="hero" id="acasa">
      <div className="hero-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="hero-grid" />

      <div className="container hero-layout">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Platformă AI · Agenți Imobiliari
          </div>

          <h1 className="hero-title">
            Fotografii Imobiliare<br />
            <span>Transformate Profesional</span>
          </h1>

          <p className="hero-subtitle">
            Corectăm perspectiva, transformăm cerul, retuș manual de expert.
            Upload rapid, rezultate premium — de pe telefonul tău.
          </p>

          <div className="hero-actions">
            <button id="hero-cta-upload" className="hero-btn-primary" onClick={onExplore}>
              📷 Încarcă Pozele
            </button>
            <button id="hero-cta-demo" className="hero-btn-secondary" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
              ▶ Vezi Demo
            </button>
          </div>

          <ul className="hero-trust">
            <li>✓ Plată doar per fotografie</li>
            <li>✓ Regenerare gratuită</li>
            <li>✓ Protejat GDPR</li>
          </ul>

          <div className="hero-stats">
            <div>
              <div className="stat-num">3</div>
              <div className="stat-lbl">Servicii</div>
            </div>
            <div>
              <div className="stat-num">24h</div>
              <div className="stat-lbl">Livrare</div>
            </div>
            <div>
              <div className="stat-num">7 zile</div>
              <div className="stat-lbl">Stocare Cloud</div>
            </div>
            <div>
              <div className="stat-num">100%</div>
              <div className="stat-lbl">Satisfacție</div>
            </div>
          </div>
        </div>

        <HeroPreview />
      </div>

      <button
        className="hero-scroll-cue"
        aria-label="Derulează în jos"
        onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════
   HOW IT WORKS STRIP
═══════════════════════════════════════════════ */
function HowSection() {
  return (
    <section className="how-section" id="cum-functioneaza">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Proces</div>
          <h2 className="section-title">Cum <span>Funcționează</span></h2>
          <p className="section-desc">4 pași simpli de la poze brute la proprietate impecabilă online.</p>
        </div>
        <div className="how-grid">
          {HOW_STEPS.map(s => (
            <div key={s.num} className="how-item">
              <div className="how-num">{s.num}</div>
              <div className="how-title">{s.title}</div>
              <div className="how-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="nav-logo" style={{ marginBottom: 'var(--gap-sm)' }}>
              <div className="nav-logo-icon">IE</div>
              <span className="nav-logo-text">ImmoEdit</span>
            </div>
            <p className="footer-brand-desc">
              Platformă AI de editare fotografii imobiliare. Pozele tale de pe telefon, transformate în imagini de agenție top.
              Stocare securizată Google Cloud 7 zile.
            </p>
          </div>
          <div>
            <div className="footer-col-title">Servicii</div>
            <ul className="footer-links">
              {SERVICES.map(s => <li key={s.id}><a href="#servicii">{s.icon} {s.label}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Platformă</div>
            <ul className="footer-links">
              <li><a href="#demo">Demo Live</a></li>
              <li><a href="#cum-functioneaza">Cum Funcționează</a></li>
              <li><a href="#acasa">Prețuri</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Legal</div>
            <ul className="footer-links">
              <li><a href="#">Termeni și Condiții</a></li>
              <li><a href="#">Politică GDPR</a></li>
              <li><a href="#">Politică Ramburs</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 ImmoEdit. Stocare Google Cloud · 7 zile · Protejat GDPR</span>
          <div className="footer-socials">
            <a id="social-ig"  href="#" className="social-btn" aria-label="Instagram">📸</a>
            <a id="social-fb"  href="#" className="social-btn" aria-label="Facebook">💼</a>
            <a id="social-li"  href="#" className="social-btn" aria-label="LinkedIn">🔗</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   TEMP TEST BUTTON (remove later)
═══════════════════════════════════════════════ */
function TestFetchButton() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:800/getProducts', {
        headers: { accept: 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      setImageUrl(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', borderTop: '2px dashed #999' }}>
      <button
        id="test-fetch-btn"
        onClick={handleTest}
        disabled={loading}
        style={{ padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.9rem' }}
      >
        {loading ? 'Se încarcă...' : '🧪 Test /test'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>Eroare: {error}</p>}
      {imageUrl && (
        <div style={{ marginTop: '1rem' }}>
          <img src={imageUrl} alt="Test response" style={{ maxWidth: '100%', maxHeight: 400, display: 'block', margin: '0 auto' }} />
          <a
            href={imageUrl}
            download="test-image.png"
            style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.9rem' }}
          >
            ⬇ Descarcă imaginea
          </a>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState('home');           // 'home' | 'received'
  const [selectedService, setSelectedService] = useState('geometry');
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { toasts, addToast } = useToast();

  /* Cart operations */
  const addToCart = (items) => {
    setCartItems(prev => [...prev, ...items]);
    addToast(`${items.length} ${items.length === 1 ? 'poză adăugată' : 'poze adăugate'} în coș`, 'success');
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
    addToast('Poză ștearsă din coș', 'default');
  };

  const changeCartItemService = (id, svcId) => {
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, svcId } : i));
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
    addToast('Comanda a fost trimisă cu succes!', 'success');
  };

  return (
    <>
      <Navbar
        cartCount={cartItems.length}
        onOpenCart={() => setCartOpen(true)}
        onNav={setPage}
        activePage={page}
      />

      {page === 'home' && (
        <>
          <Hero onExplore={() => document.getElementById('servicii')?.scrollIntoView({ behavior: 'smooth' })} />
          <BeforeAfterSlider onSelectService={setSelectedService} />
          <div className="divider" />
          <HowSection />
          <div className="divider" />
          <ServicesSection
            selectedService={selectedService}
            onSelectService={setSelectedService}
            onAddToCart={addToCart}
            onOpenCart={() => setCartOpen(true)}
          />
        </>
      )}

      {page === 'received' && (
        <>
          <div style={{ height: 70 }} />
          <ReceivedPhotosSection onToast={addToast} />
        </>
      )}

      <Footer />

      {/* TEMP: test fetch button — remove later */}
      <TestFetchButton />

      {/* Cart */}
      <CartSidebar
        isOpen={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onChangeService={changeCartItemService}
        onCheckout={handleCheckout}
      />

      {/* Checkout */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      <ToastContainer toasts={toasts} />
    </>
  );
}
