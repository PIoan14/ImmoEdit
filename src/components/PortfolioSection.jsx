import { useState } from 'react';
import { SVC_MAP, DEMO_PORTFOLIO } from '../data.js';

/**
 * PortfolioSection – Instagram-like grid showing before/after pairs.
 * Liked items go to a new cart; disliked get re-sent.
 */
export default function PortfolioSection({ userItems, onAddToCart }) {
  // Combine demo items with user-approved items
  const allItems = [...DEMO_PORTFOLIO, ...userItems];
  const [likes, setLikes] = useState({});
  const [addedIds, setAddedIds] = useState(new Set());

  const toggleLike = (id) => setLikes(p => ({ ...p, [id]: p[id] === 'like' ? null : 'like' }));
  const toggleDislike = (id) => setLikes(p => ({ ...p, [id]: p[id] === 'dislike' ? null : 'dislike' }));

  const likedItems = allItems.filter(i => likes[i.id] === 'like' && !addedIds.has(i.id));

  const handleAddLikedToCart = () => {
    const cartItems = likedItems.map(i => ({
      id: `port-${i.id}-${Date.now()}`,
      url: i.after,
      name: i.name,
      svcId: i.svc,
      file: null,
    }));
    onAddToCart(cartItems);
    setAddedIds(prev => new Set([...prev, ...likedItems.map(i => i.id)]));
  };

  return (
    <section className="portfolio-section" id="portofoliu">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Portofoliu</div>
          <h2 className="section-title">
            Pozele <span>Editate</span>
          </h2>
          <p className="section-desc">
            Dă like pozelor care îți plac și adaugă-le în coș pentru a comanda. Dislike trimite poza înapoi la editor.
          </p>
        </div>

        {/* Liked items banner */}
        {likedItems.length > 0 && (
          <div style={{
            background: 'rgba(94,196,176,0.08)', border: '1px solid rgba(94,196,176,0.25)',
            borderRadius: 'var(--radius-md)', padding: 'var(--gap-md)',
            marginBottom: 'var(--gap-lg)', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between', gap: 'var(--gap-sm)', flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--teal-2)' }}>
              👍 {likedItems.length} {likedItems.length === 1 ? 'poză selectată' : 'poze selectate'}
            </span>
            <button id="portfolio-add-to-cart" className="btn-primary" onClick={handleAddLikedToCart}>
              🛒 Adaugă în coș
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="portfolio-grid">
          {allItems.map(item => {
            const svc = SVC_MAP[item.svc];
            const vote = likes[item.id];
            return (
              <div key={item.id} className="portfolio-card">
                <div className="portfolio-card-imgs">
                  <img src={item.before} alt="Înainte" className="portfolio-card-img" />
                  <img src={item.after}  alt="După"   className="portfolio-card-img" />
                </div>
                <div className="portfolio-card-body">
                  <div className="portfolio-card-svc">{svc?.icon} {svc?.label}</div>
                  <div className="portfolio-card-name">{item.name}</div>
                  <div className="portfolio-card-actions">
                    <button
                      id={`port-like-${item.id}`}
                      className={`port-btn like ${vote === 'like' ? 'active' : ''}`}
                      onClick={() => toggleLike(item.id)}
                    >
                      👍 {vote === 'like' ? 'Selectat' : 'Îmi place'}
                    </button>
                    <button
                      id={`port-dislike-${item.id}`}
                      className={`port-btn dislike ${vote === 'dislike' ? 'active' : ''}`}
                      onClick={() => toggleDislike(item.id)}
                    >
                      👎 {vote === 'dislike' ? 'Retrimis' : 'Retrimite'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
