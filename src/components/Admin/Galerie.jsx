import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import AdminLayout from './common/AdminLayout'

// ─── helpers ────────────────────────────────────────────────────────────────
const IMAGE_KEYS = ['image1','image2','image3','image4','image5',
                    'image6','image7','image8','image9','image10']

const getImages = (galerie) =>
  IMAGE_KEYS.map(k => galerie[k]).filter(Boolean)

// ─── LightBox ────────────────────────────────────────────────────────────────
const Lightbox = ({ images, index, onClose }) => {
  const [current, setCurrent] = useState(index)

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* counter */}
      <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        color: '#fff', fontSize: '0.85rem', opacity: 0.7, letterSpacing: 2 }}>
        {current + 1} / {images.length}
      </div>

      {/* close */}
      <button
        onClick={onClose}
        style={{ position: 'absolute', top: 14, right: 20,
          background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer' }}
      >✕</button>

      {/* prev */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); prev() }}
          style={{ position: 'absolute', left: 16, background: 'rgba(255,255,255,0.12)',
            border: 'none', color: '#fff', fontSize: 28, borderRadius: '50%',
            width: 48, height: 48, cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center' }}
        >‹</button>
      )}

      <img
        src={`${import.meta.env.VITE_BACKEND_URL_IMAGES}${images[current]}`}
        alt={`Image ${current + 1}`}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain',
          borderRadius: 8, boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
      />

      {/* next */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); next() }}
          style={{ position: 'absolute', right: 16, background: 'rgba(255,255,255,0.12)',
            border: 'none', color: '#fff', fontSize: 28, borderRadius: '50%',
            width: 48, height: 48, cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center' }}
        >›</button>
      )}

      {/* thumbnails strip */}
      {images.length > 1 && (
        <div style={{ position: 'absolute', bottom: 16, display: 'flex', gap: 6,
          maxWidth: '90vw', overflowX: 'auto', padding: '0 8px' }}
          onClick={e => e.stopPropagation()}>
          {images.map((img, i) => (
            <img
              key={i}
              src={`${import.meta.env.VITE_BACKEND_URL_IMAGES}${img}`}
              alt={`thumb-${i}`}
              onClick={() => setCurrent(i)}
              style={{
                width: 52, height: 40, objectFit: 'cover', borderRadius: 5, cursor: 'pointer',
                border: i === current ? '2px solid #fff' : '2px solid transparent',
                opacity: i === current ? 1 : 0.55, transition: 'all 0.2s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── GalerieCard ─────────────────────────────────────────────────────────────
const GalerieCard = ({ galerie, onImageClick }) => {
  const images = getImages(galerie)
  const [hovered, setHovered] = useState(null)

  if (!images.length) return null

  const [first, ...rest] = images
  const shown = images.slice(0, 5)   // max 5 dans la grille
  const extra = images.length - 5

  return (
    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 14, overflow: 'hidden' }}>
      {/* header */}
      <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between py-3 px-4">
        <div>
          <h6 className="fw-semibold mb-0" style={{ fontSize: '1rem' }}>
            {galerie.titre || `Galerie #${galerie.id}`}
          </h6>
          {galerie.description && (
            <p className="text-muted small mb-0 mt-1" style={{ maxWidth: 520 }}>
              {galerie.description}
            </p>
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2" style={{ fontSize: '0.75rem' }}>
            {images.length} image{images.length > 1 ? 's' : ''}
          </span>
          <a
            href={`/admin/galeries/edit/${galerie.id}`}
            className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1"
            style={{ fontSize: '0.8rem', borderRadius: 8, whiteSpace: 'nowrap' }}
          >
            ✏️ Modifier
          </a>
        </div>
      </div>

      {/* mosaic */}
      <div className="card-body p-3">
        <div style={{ display: 'grid', gap: 6,
          gridTemplateColumns: images.length === 1 ? '1fr' : images.length === 2 ? '1fr 1fr' : '2fr 1fr',
          gridTemplateRows: images.length >= 3 ? '180px 180px' : '240px',
        }}>
          {/* big first image */}
          <div
            style={{
              gridRow: images.length >= 3 ? '1 / 3' : '1',
              gridColumn: '1',
              borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
              position: 'relative',
            }}
            onClick={() => onImageClick(images, 0)}
            onMouseEnter={() => setHovered('main')}
            onMouseLeave={() => setHovered(null)}
          >
            <img
              src={`${import.meta.env.VITE_BACKEND_URL_IMAGES}${first}`}
              alt="main"
              style={{ width: '100%', height: '100%', objectFit: 'cover',
                transform: hovered === 'main' ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 0.35s ease' }}
            />
          </div>

          {/* side images */}
          {images.length >= 3 && shown.slice(1).map((img, i) => {
            const isLast   = i === shown.slice(1).length - 1
            const showMore = isLast && extra > 0

            return (
              <div
                key={i}
                style={{ borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                  position: 'relative' }}
                onClick={() => onImageClick(images, i + 1)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL_IMAGES}${img}`}
                  alt={`img-${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover',
                    transform: hovered === i ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.3s ease' }}
                />
                {showMore && (
                  <div style={{ position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '1.3rem', fontWeight: 700 }}>
                    +{extra}
                  </div>
                )}
              </div>
            )
          })}

          {/* 2-image layout: second image */}
          {images.length === 2 && (
            <div
              style={{ borderRadius: 10, overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => onImageClick(images, 1)}
              onMouseEnter={() => setHovered(1)}
              onMouseLeave={() => setHovered(null)}
            >
              <img
                src={`${import.meta.env.VITE_BACKEND_URL_IMAGES}${images[1]}`}
                alt="img-1"
                style={{ width: '100%', height: '100%', objectFit: 'cover',
                  transform: hovered === 1 ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.3s ease' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* footer */}
      <div className="card-footer bg-white border-top-0 text-muted px-4 py-2 d-flex align-items-center gap-2" style={{ fontSize: '0.78rem' }}>
        <span>🪪 ID #{galerie.id}</span>
        {galerie.created_at && (
          <>
            <span style={{ opacity: 0.3 }}>·</span>
            <span>Créée le {new Date(galerie.created_at).toLocaleDateString('fr-FR')}</span>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const Galerie = () => {
  const [articles, setArticles]           = useState([])
  const [selectedArticleId, setSelectedArticleId] = useState('')
  const [selectedArticle, setSelectedArticle]     = useState(null)
  const [galeries, setGaleries]           = useState([])
  const [loadingArticles, setLoadingArticles] = useState(true)
  const [loadingGaleries, setLoadingGaleries] = useState(false)
  const [error, setError]                 = useState(null)

  // lightbox state
  const [lightbox, setLightbox] = useState(null)  // { images, index }

  // ── load articles ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}Article`)
        const data = res.data?.Article ?? res.data?.data ?? res.data
        setArticles(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Erreur chargement articles:', err)
        setError('Impossible de charger les articles.')
      } finally {
        setLoadingArticles(false)
      }
    }
    fetchArticles()
  }, [])

  // ── load galeries when article changes ─────────────────────────────────────
  const fetchGaleries = useCallback(async (articleId) => {
    if (!articleId) { setGaleries([]); return }

    setLoadingGaleries(true)
    setError(null)
    setGaleries([])

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}galerie/${articleId}`,
        { params: { article_id: articleId } }
      )
      const data = res.data?.galeries ?? res.data?.data ?? res.data
      setGaleries(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Erreur chargement galeries:', err)
      setError('Impossible de charger les galeries pour cet article.')
    } finally {
      setLoadingGaleries(false)
    }
  }, [])

  const handleArticleChange = (e) => {
    const id = e.target.value
    setSelectedArticleId(id)
    setSelectedArticle(articles.find(a => String(a.id) === String(id)) || null)
    fetchGaleries(id)
  }

  const totalImages = galeries.reduce((acc, g) => acc + getImages(g).length, 0)

  return (
    <AdminLayout>
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}

      <div className="container py-5 px-4">
        <div className="container-fluid py-4">

          {/* ── Header ── */}
          <div className="d-flex align-items-start justify-content-between mb-5">
            <div>
              <h4 className="fw-semibold mb-1">Galeries par article</h4>
              <p className="text-muted small mb-0">
                Sélectionnez un article pour afficher toutes ses galeries photos.
              </p>
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
              {galeries.length > 0 && (
                <>
                  <span className="badge bg-success fs-6 px-3 py-2">
                    {galeries.length} galerie{galeries.length > 1 ? 's' : ''}
                  </span>
                  <span className="badge bg-info text-dark fs-6 px-3 py-2">
                    {totalImages} image{totalImages > 1 ? 's' : ''}
                  </span>
                </>
              )}
              <a
                href={ '/admin/AddGalerie'}
                className="btn btn-primary d-flex align-items-center gap-2"
                style={{ borderRadius: 10, fontWeight: 600, fontSize: '0.9rem' }}
              >
                <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>＋</span>
                Ajouter une galerie
              </a>
            </div>
          </div>

          {/* ── Article selector ── */}
          <div className="card border-0 shadow-sm mb-5">
            <div className="card-body">
              <h6 className="text-muted text-uppercase small fw-semibold mb-3">
                Sélectionner un article
              </h6>

              {loadingArticles ? (
                <div className="d-flex align-items-center gap-2 text-muted py-2">
                  <span className="spinner-border spinner-border-sm" />
                  Chargement des articles...
                </div>
              ) : (
                <div className="row g-3 align-items-start">
                  <div className="col-md-5">
                    <select
                      className="form-select form-select-lg"
                      value={selectedArticleId}
                      onChange={handleArticleChange}
                    >
                      <option value="">-- Choisir un article --</option>
                      {articles.map(article => (
                        <option key={article.id} value={article.id}>
                          #{article.id} — {article.titre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* selected article preview */}
                  {selectedArticle && (
                    <div className="col-md-7">
                      <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                        {selectedArticle.image && (
                          <img
                            src={`${import.meta.env.VITE_BACKEND_URL_IMAGES}${selectedArticle.image}`}
                            alt={selectedArticle.titre}
                            style={{ width: 56, height: 56, objectFit: 'cover',
                              borderRadius: 8, flexShrink: 0 }}
                            onError={e => e.target.style.display = 'none'}
                          />
                        )}
                        <div>
                          <div className="fw-semibold">{selectedArticle.titre}</div>
                          <div className="text-muted small">
                            {selectedArticle.categorie || 'Sans catégorie'}
                            &nbsp;·&nbsp;ID #{selectedArticle.id}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)} />
            </div>
          )}

          {/* ── Loading galeries ── */}
          {loadingGaleries && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" style={{ width: 48, height: 48 }} />
              <p className="text-muted">Chargement des galeries...</p>
            </div>
          )}

          {/* ── Empty state: no article selected ── */}
          {!selectedArticleId && !loadingArticles && !loadingGaleries && (
            <div className="text-center py-6">
              <div style={{ fontSize: 64, marginBottom: 16 }}>🖼️</div>
              <h5 className="text-muted fw-normal">Aucun article sélectionné</h5>
              <p className="text-muted small">
                Choisissez un article ci-dessus pour voir ses galeries.
              </p>
            </div>
          )}

          {/* ── Empty state: article selected but no galeries ── */}
          {selectedArticleId && !loadingGaleries && galeries.length === 0 && !error && (
            <div className="text-center py-6">
              <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
              <h5 className="text-muted fw-normal">Aucune galerie trouvée</h5>
              <p className="text-muted small">
                Cet article ne possède pas encore de galerie photos.
              </p>
              <a
                href={`/admin/galeries/add?article_id=${selectedArticleId}`}
                className="btn btn-primary mt-2"
              >
                ＋ Créer une galerie
              </a>
            </div>
          )}

          {/* ── Galeries list ── */}
          {!loadingGaleries && galeries.length > 0 && (
            <>
              <div className="mb-3 text-muted small">
                {galeries.length} galerie{galeries.length > 1 ? 's' : ''} trouvée{galeries.length > 1 ? 's' : ''}
                {selectedArticle && <> pour <strong>{selectedArticle.titre}</strong></>}
              </div>
              {galeries.map(galerie => (
                <GalerieCard
                  key={galerie.id}
                  galerie={galerie}
                  onImageClick={(images, index) => setLightbox({ images, index })}
                />
              ))}
            </>
          )}

        </div>
      </div>
    </AdminLayout>
  )
}

export default Galerie