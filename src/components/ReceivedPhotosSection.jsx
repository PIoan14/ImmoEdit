import { useState, useEffect, useRef } from 'react';
import { unzip } from '../utils/unzip.js';

const API_BASE = 'http://localhost:8003';

/**
 * ReceivedPhotosSection – the client enters their order code and sees the edited
 * photos returned by the server. Each photo can be liked/disliked, downloaded,
 * commented on and sent back for another round of editing.
 *
 * /getProducts?code=... returns a ZIP archive with all photos, which is
 * unpacked in the browser. Feedback / resend have no endpoint yet, so they
 * are kept locally for now.
 */
export default function ReceivedPhotosSection({ onToast }) {
  const [code, setCode] = useState('');
  const [photos, setPhotos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const objectUrls = useRef([]);

  const revokeAll = () => {
    objectUrls.current.forEach(u => URL.revokeObjectURL(u));
    objectUrls.current = [];
  };

  useEffect(() => revokeAll, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/getProducts?code=${encodeURIComponent(code)}`, {
        headers: { accept: 'application/zip' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // The server responds with a ZIP archive containing all edited photos.
      const files = (await unzip(await res.arrayBuffer()))
        .filter(f => f.blob.type.startsWith('image/'));

      revokeAll();
      setPhotos(files.map((file, i) => {
        const url = URL.createObjectURL(file.blob);
        objectUrls.current.push(url);
        return {
          id: i + 1,
          name: file.name,
          url,
          reaction: null,        // 'like' | 'dislike' | null
          comments: [],
          draft: '',
          resent: false,
        };
      }));
    } catch (err) {
      setError(err.message);
      setPhotos(null);
    } finally {
      setLoading(false);
    }
  };

  const updatePhoto = (id, patch) =>
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, ...(typeof patch === 'function' ? patch(p) : patch) } : p));

  const toggleReaction = (id, reaction) =>
    updatePhoto(id, p => ({ reaction: p.reaction === reaction ? null : reaction }));

  const addComment = (id) =>
    updatePhoto(id, p => {
      const text = p.draft.trim();
      if (!text) return {};
      return { comments: [...p.comments, { text, at: new Date() }], draft: '' };
    });

  const resend = (id) => {
    updatePhoto(id, p => {
      const text = p.draft.trim();
      return {
        resent: true,
        comments: text ? [...p.comments, { text, at: new Date() }] : p.comments,
        draft: '',
      };
    });
    onToast?.('Fotografia a fost retrimisă la editare', 'success');
  };

  return (
    <section className="received-section" id="fotografii-primite">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Fotografii primite</div>
          <h2 className="section-title">
            Fotografiile Tale <span>Editate</span>
          </h2>
          <p className="section-desc">
            Introdu codul primit la comandă pentru a vedea, descărca și evalua fotografiile editate.
          </p>
        </div>

        <form className="received-gate" onSubmit={handleSubmit}>
          <div className="form-group received-gate-input">
            <label className="form-label" htmlFor="received-code">Cod comandă</label>
            <input
              id="received-code"
              className="form-input"
              placeholder="Introdu codul aici"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
          </div>
          <button id="received-submit" className="btn-primary received-gate-btn" type="submit" disabled={!code || loading}>
            {loading ? 'Se încarcă...' : 'OK'}
          </button>
        </form>

        {error && (
          <div className="received-error">
            Nu am putut încărca fotografiile ({error}). Încearcă din nou.
          </div>
        )}

        {loading && <div className="processing-spinner received-spinner" />}

        {photos && !loading && (
          photos.length === 0 ? (
            <div className="portfolio-placeholder received-empty">
              Nu există încă fotografii editate pentru acest cod.
            </div>
          ) : (
            <div className="received-list">
              {photos.map((photo, idx) => {
                const status = photo.resent
                  ? { cls: 'resent',  label: '↻ Retrimisă la editare' }
                  : photo.reaction === 'like'
                    ? { cls: 'liked',    label: '✓ Aprobată' }
                    : photo.reaction === 'dislike'
                      ? { cls: 'disliked', label: '✕ Necesită modificări' }
                      : { cls: 'new',      label: '● Nouă' };

                return (
                <article key={photo.id} className="received-card">
                  <header className="received-card-head">
                    <div className="received-card-num">{String(idx + 1).padStart(2, '0')}</div>
                    <div className="received-card-heading">
                      <div className="received-card-title">Fotografia {idx + 1} din {photos.length}</div>
                      <div className="received-card-file">{photo.name}</div>
                    </div>
                    <span className={`received-status ${status.cls}`}>{status.label}</span>
                  </header>

                  <div className="received-card-body">
                    <div className="received-media">
                      <a className="received-img-wrap" href={photo.url} target="_blank" rel="noreferrer" title="Deschide la dimensiune completă">
                        <img src={photo.url} alt={`Fotografie editată ${idx + 1}`} className="received-img" />
                        <span className="received-zoom">⤢ Mărește</span>
                      </a>

                      <div className="received-toolbar">
                        <div className="reaction-group">
                          <span className="received-toolbar-label">Evaluare</span>
                          <button
                            type="button"
                            className={`reaction-btn like ${photo.reaction === 'like' ? 'active' : ''}`}
                            onClick={() => toggleReaction(photo.id, 'like')}
                            aria-pressed={photo.reaction === 'like'}
                          >
                            👍 Îmi place
                          </button>
                          <button
                            type="button"
                            className={`reaction-btn dislike ${photo.reaction === 'dislike' ? 'active' : ''}`}
                            onClick={() => toggleReaction(photo.id, 'dislike')}
                            aria-pressed={photo.reaction === 'dislike'}
                          >
                            👎 Nu îmi place
                          </button>
                        </div>
                        <a className="btn-primary btn-sm received-download" href={photo.url} download={photo.name}>
                          ⬇ Descarcă
                        </a>
                      </div>
                    </div>

                    <aside className="received-comments">
                      <div className="received-comments-head">
                        <span className="received-comments-title">💬 Observații</span>
                        <span className="received-comments-count">{photo.comments.length}</span>
                      </div>

                      <div className="received-comment-list">
                        {photo.comments.length === 0 ? (
                          <div className="received-comment-empty">
                            Nicio observație încă. Spune-ne ce ai dori să modificăm.
                          </div>
                        ) : (
                          photo.comments.map((c, i) => (
                            <div key={i} className="received-comment">
                              <div className="received-comment-text">{c.text}</div>
                              <div className="received-comment-time">
                                {c.at.toLocaleString('ro-RO', { dateStyle: 'short', timeStyle: 'short' })}
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="received-composer">
                        <textarea
                          className="form-input received-textarea"
                          placeholder="Ex: cerul puțin mai luminos, îndreaptă linia acoperișului..."
                          value={photo.draft}
                          onChange={e => updatePhoto(photo.id, { draft: e.target.value })}
                        />
                        <div className="received-comment-actions">
                          <button
                            type="button"
                            className="btn-secondary btn-sm"
                            disabled={!photo.draft.trim()}
                            onClick={() => addComment(photo.id)}
                          >
                            Trimite observația
                          </button>
                          <button
                            type="button"
                            className="btn-resend btn-sm"
                            disabled={photo.resent || (!photo.draft.trim() && photo.comments.length === 0)}
                            onClick={() => resend(photo.id)}
                          >
                            {photo.resent ? '✓ Retrimisă' : '↻ Retrimite la editare'}
                          </button>
                        </div>
                      </div>
                    </aside>
                  </div>
                </article>
                );
              })}
            </div>
          )
        )}
      </div>
    </section>
  );
}
