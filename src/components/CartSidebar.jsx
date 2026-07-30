import { SERVICES, SVC_MAP } from '../data.js';

/**
 * CartSidebar – slides in from the right.
 * Shows items with photo thumb, service selector, price, remove button.
 */
export default function CartSidebar({ items, onClose, onRemove, onChangeService, onCheckout, isOpen }) {
  const total = items.reduce((sum, it) => sum + (SVC_MAP[it.svcId]?.price || 0), 0);

  return (
    <>
      {/* Overlay */}
      <div
        id="cart-overlay"
        className={`cart-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside id="cart-sidebar" className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <span className="cart-title">🛒 Coș de Cumpărături</span>
          <button id="cart-close-btn" className="cart-close" onClick={onClose}>✕</button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🗂️</div>
              <div className="cart-empty-text">Coșul tău este gol.<br />Adaugă poze pentru a continua.</div>
            </div>
          ) : (
            items.map(item => {
              const svc = SVC_MAP[item.svcId];
              return (
                <div key={item.id} className="cart-item">
                  <img src={item.url} alt={item.name} className="cart-item-thumb" />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-svc">Serviciu aplicat:</div>
                    <select
                      id={`cart-svc-${item.id}`}
                      className="cart-item-svc-select"
                      value={item.svcId}
                      onChange={e => onChangeService(item.id, e.target.value)}
                    >
                      {SERVICES.map(s => (
                        <option key={s.id} value={s.id}>{s.icon} {s.label} – €{s.price}</option>
                      ))}
                    </select>
                  </div>
                  <span className="cart-item-price">€{svc?.price || 0}</span>
                  <button
                    id={`cart-remove-${item.id}`}
                    className="cart-item-remove"
                    onClick={() => onRemove(item.id)}
                    title="Șterge din coș"
                  >🗑</button>
                </div>
              );
            })
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total-row">
            <span className="cart-total-label">Total ({items.length} {items.length === 1 ? 'poză' : 'poze'})</span>
            <span className="cart-total-value">€{total.toFixed(2)}</span>
          </div>
          <button
            id="cart-checkout-btn"
            className="cart-checkout-btn"
            disabled={items.length === 0}
            onClick={onCheckout}
          >
            💳 Finalizează Comanda
          </button>
        </div>
      </aside>
    </>
  );
}
