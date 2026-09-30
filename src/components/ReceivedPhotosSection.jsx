import { useState, useEffect, useRef } from 'react';
import { unzip } from '../utils/unzip.js';
import { SectionDecor } from './ServiceDecor.jsx';

/**
 * ReceivedPhotosSection – the client enters their order code and sees the edited
 * photos returned by the server. Each photo can be liked/disliked, downloaded,
 * given a single observation and sent back for another round of editing.
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
      const res = await fetch(`${import.meta.env.API_BASE}/getProducts?code=${encodeURIComponent(code)}`, {
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
          note: null,            // the single observation: { text, at } | null
          draft: '',
          editing: false,        // true while the sent observation is being edited
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

  // Only one observation per photo – it can be edited until the photo is resent.
  const saveNote = (id) =>
    updatePhoto(id, p => {
      const text = p.draft.trim();
      if (!text) return {};
      return { note: { text, at: new Date(), edited: !!p.note }, draft: '', editing: false };
    });

  const startEdit = (id) =>
    updatePhoto(id, p => ({ editing: true, draft: p.note?.text ?? '' }));

  const cancelEdit = (id) =>
    updatePhoto(id, { editing: false, draft: '' });

  const resend = (id) => {
    updatePhoto(id, p => {
      const text = p.draft.trim();
      return {
        resent: true,
        note: p.note ?? (text ? { text, at: new Date() } : null),
        draft: '',
      };
    });
    onToast?.('Fotografia a fost retrimisă la editare', 'success');
  };

  return (
    <section className="received-section" id="fotografii-primite">
      <SectionDecor layout="c" />
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
                <div key={photo.id} className="received-item">
                  <article className="received-card">
                    <div className="received-frame">
                      <a className="received-img-wrap" href={photo.url} target="_blank" rel="noreferrer" title="Deschide la dimensiune completă">
                        <img src={photo.url} alt="" aria-hidden="true" className="received-img-bg" />
                        <img src={photo.url} alt={`Fotografie editată ${idx + 1}`} className="received-img" />
                        <span className="received-img-tag">✦ Editată profesional</span>
                        <span className="received-zoom">⤢ Mărește</span>
                      </a>
                    </div>
                  </article>

                  <aside className="received-notes" aria-label={`Fotografia ${idx + 1} din ${photos.length}`}>
                    <header className="received-notes-head">
                      <a className="received-notes-thumb" href={photo.url} target="_blank" rel="noreferrer" title="Deschide fotografia">
                        <img src={photo.url} alt="" />
                        <span className="received-notes-thumb-num">{String(idx + 1).padStart(2, '0')}</span>
                      </a>
                      <div className="received-notes-heading">
                        <div className="received-notes-title">Fotografia {idx + 1} din {photos.length}</div>
                        <div className="received-notes-file">{photo.name}</div>
                        <span className={`received-status ${status.cls}`}>{status.label}</span>
                      </div>
                    </header>

                    <div className="received-notes-body">
                      <div className="received-composer">
                        <label className="received-composer-label" htmlFor={`note-${photo.id}`}>💬 OBSERVAȚIE</label>
                        {photo.note && !photo.editing ? (
                          <div className="received-comment">
                            <div className="received-comment-text">{photo.note.text}</div>
                            <div className="received-comment-time">
                              {photo.note.edited ? 'Editată' : 'Trimisă'} {photo.note.at.toLocaleString('ro-RO', { dateStyle: 'short', timeStyle: 'short' })}
                            </div>
                          </div>
                        ) : (
                          <textarea
                            id={`note-${photo.id}`}
                            className="form-input received-textarea"
                            placeholder="Ex: cerul puțin mai luminos, îndreaptă linia acoperișului..."
                            value={photo.draft}
                            onChange={e => updatePhoto(photo.id, { draft: e.target.value })}
                          />
                        )}
                        <div className="received-comment-actions">
                          {photo.editing ? (
                            <>
                              <button type="button" className="btn-secondary btn-sm" onClick={() => cancelEdit(photo.id)}>
                                Anulează
                              </button>
                              <button
                                type="button"
                                className="btn-primary btn-sm"
                                disabled={!photo.draft.trim()}
                                onClick={() => saveNote(photo.id)}
                              >
                                ✓ Salvează modificarea
                              </button>
                            </>
                          ) : (
                            <>
                              {photo.note ? (
                                <button
                                  type="button"
                                  className="btn-secondary btn-sm"
                                  disabled={photo.resent}
                                  onClick={() => startEdit(photo.id)}
                                >
                                  ✎ Editează observația
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn-secondary btn-sm"
                                  disabled={!photo.draft.trim()}
                                  onClick={() => saveNote(photo.id)}
                                >
                                  Trimite observația
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn-resend btn-sm"
                                disabled={photo.resent || (!photo.draft.trim() && !photo.note)}
                                onClick={() => resend(photo.id)}
                              >
                                {photo.resent ? '✓ Retrimisă' : '↻ Retrimite la editare'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="received-toolbar">
                        <div className="received-toolbar-label">EVALUEAZĂ ȘI DESCARCĂ</div>
                        <div className="received-actions">
                          <button
                            type="button"
                            className={`received-action reaction-btn like ${photo.reaction === 'like' ? 'active' : ''}`}
                            onClick={() => toggleReaction(photo.id, 'like')}
                            aria-pressed={photo.reaction === 'like'}
                          >
                            <span className="received-action-icon" aria-hidden="true">👍</span>
                            <span>Îmi place</span>
                          </button>
                          <button
                            type="button"
                            className={`received-action reaction-btn dislike ${photo.reaction === 'dislike' ? 'active' : ''}`}
                            onClick={() => toggleReaction(photo.id, 'dislike')}
                            aria-pressed={photo.reaction === 'dislike'}
                          >
                            <span className="received-action-icon" aria-hidden="true">👎</span>
                            <span>Nu îmi place</span>
                          </button>
                          <a className="received-action received-download" href={photo.url} download={photo.name}>
                            <span className="received-action-icon" aria-hidden="true">⬇</span>
                            <span>Descarcă</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </section>
  );
}
