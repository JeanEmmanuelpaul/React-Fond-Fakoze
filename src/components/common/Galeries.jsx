import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import image1 from '../../assets/images/banner.jpg'
import Carousel from 'react-bootstrap/Carousel'
import axios from 'axios'

// ── Toutes les clés images de la table galeries ──────────────────────────────
const IMAGE_KEYS = ['image1','image2','image3','image4','image5',
                    'image6','image7','image8','image9','image10']

const galeriesToSlides = (galeries) => {
  const slides = []
  galeries.forEach((galerie) => {
    IMAGE_KEYS.forEach((key) => {
      if (galerie[key]) {
        slides.push({
          id:          `${galerie.id}-${key}`,
          src:         galerie[key],
          titre:       galerie.titre       || '',
          description: galerie.description || '',
        })
      }
    })
  })
  return slides
}

// ── Icônes SVG inline ────────────────────────────────────────────────────────
const IconExpand = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"/>
    <polyline points="9 21 3 21 3 15"/>
    <line x1="21" y1="3" x2="14" y2="10"/>
    <line x1="3" y1="21" x2="10" y2="14"/>
  </svg>
)

const IconCollapse = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20"/>
    <polyline points="20 10 14 10 14 4"/>
    <line x1="10" y1="14" x2="3" y2="21"/>
    <line x1="21" y1="3" x2="14" y2="10"/>
  </svg>
)

// ─────────────────────────────────────────────────────────────────────────────
const Galeries = () => {
  const params         = useParams()
  const [searchParams] = useSearchParams()

  const articleId =
    params.id_article              ??
    params.id                      ??
    params.articleId               ??
    searchParams.get('id_article') ??
    searchParams.get('id')         ??
    null

  const [slides,      setSlides]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [notFound,    setNotFound]    = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [fullscreen,  setFullscreen]  = useState(false)

  // ── Plein écran ───────────────────────────────────────────────────────────
  const openFullscreen = useCallback(() => {
    setFullscreen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeFullscreen = useCallback(() => {
    setFullscreen(false)
    document.body.style.overflow = ''
  }, [])

  // Fermer avec Échap
  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e) => { if (e.key === 'Escape') closeFullscreen() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fullscreen, closeFullscreen])

  // Nettoyage si démontage en mode FS
  useEffect(() => { return () => { document.body.style.overflow = '' } }, [])

  // ── Fetch galeries par article_id ─────────────────────────────────────────
  useEffect(() => {
    if (!articleId) { setLoading(false); setNotFound(true); return }

    const fetchGaleries = async () => {
      setLoading(true); setNotFound(false); setActiveIndex(0)
      try {
        const res  = await axios.get(`${import.meta.env.VITE_BACKEND_URL}galerie/${articleId}`, {
          params: { article_id: articleId },
        })
        const d    = res.data
        const list = Array.isArray(d)           ? d
                   : Array.isArray(d?.galeries) ? d.galeries
                   : Array.isArray(d?.data)     ? d.data
                   : []
        if (list.length === 0) { setNotFound(true); setSlides([]) }
        else {
          const built = galeriesToSlides(list)
          setSlides(built)
          if (built.length === 0) setNotFound(true)
        }
      } catch (err) {
        console.error('Galeries error:', err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchGaleries()
  }, [articleId])

  if (!loading && (notFound || slides.length === 0)) return null

  // ── Carousel réutilisé normal & plein écran ───────────────────────────────
  const CarouselInner = ({ height, onDoubleClick }) => (
    <Carousel fade activeIndex={activeIndex} onSelect={(i) => setActiveIndex(i)}>
      {slides.map((slide) => (
        <Carousel.Item key={slide.id}>
          <img
            src={`${import.meta.env.VITE_BACKEND_URL_IMAGES}${slide.src}`}
            className="d-block w-100"
            style={{
              height,
              objectFit:  fullscreen ? 'contain' : 'cover',
              cursor:     fullscreen ? 'zoom-out' : 'zoom-in',
              background: '#000',
            }}
            alt={slide.titre || slide.id}
            onDoubleClick={onDoubleClick}
            onError={e => { e.currentTarget.src = image1 }}
          />

          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

          {(slide.titre || slide.description) && (
            <Carousel.Caption style={{ paddingBottom: 48 }}>
              {slide.titre && (
                <h3 className="fw-bold" style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                  {slide.titre}
                </h3>
              )}
              {slide.description && (
                <p style={{ fontSize: '0.95rem', opacity: 0.9, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                  {slide.description}
                </p>
              )}
            </Carousel.Caption>
          )}
        </Carousel.Item>
      ))}
    </Carousel>
  )

  // ── Contrôles (bouton FS + compteur + dots + hint) ────────────────────────
  const Controls = ({ onToggleFS }) => (
    <>
      {/* Bouton plein écran */}
      <button
        onClick={onToggleFS}
        title={fullscreen ? 'Réduire (Échap)' : 'Plein écran (double-clic)'}
        style={{
          position: 'absolute', top: 12, right: 12, zIndex: 20,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
          border: 'none', borderRadius: 8, color: '#fff',
          width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,145,0,0.85)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
      >
        {fullscreen ? <IconCollapse /> : <IconExpand />}
      </button>

      {/* Compteur */}
      <div style={{
        position: 'absolute', bottom: 16, right: 20, zIndex: 10,
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)',
        color: '#fff', fontSize: '0.78rem', fontWeight: 600,
        padding: '4px 12px', borderRadius: 20, letterSpacing: '0.05em',
      }}>
        {activeIndex + 1} / {slides.length}
      </div>

      {/* Dots */}
      <div className="d-flex gap-2 justify-content-center"
        style={{ position: 'absolute', bottom: 16, left: 0, right: 0, zIndex: 10 }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            style={{
              width:        i === activeIndex ? 24 : 8,
              height:       8,
              borderRadius: 4,
              border:       'none',
              background:   i === activeIndex
                              ? 'var(--secondary-color, #FF9100)'
                              : 'rgba(255,255,255,0.5)',
              transition:   'all 0.3s ease',
              padding:      0,
              cursor:       'pointer',
            }}
          />
        ))}
      </div>

      {/* Hint — mode normal uniquement */}
      {!fullscreen && (
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 10,
          background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)',
          color: 'rgba(255,255,255,0.75)', fontSize: '0.7rem',
          padding: '3px 10px', borderRadius: 20,
          pointerEvents: 'none', userSelect: 'none',
        }}>
          🔍 Double-clic pour agrandir
        </div>
      )}

      {/* Hint — mode plein écran */}
      {fullscreen && (
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 10,
          background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)',
          color: 'rgba(255,255,255,0.75)', fontSize: '0.7rem',
          padding: '3px 10px', borderRadius: 20,
          pointerEvents: 'none', userSelect: 'none',
        }}>
          ✕ Échap ou double-clic pour fermer
        </div>
      )}
    </>
  )

  return (
    <>
      <div className="py-2" />

      {/* ── MODE NORMAL ── */}
      <section className="section-1" style={{ position: 'relative' }}>
        {loading && (
          <div className="w-100 placeholder-glow" style={{ height: 400, background: '#e9ecef' }}>
            <div className="placeholder w-100 h-100" />
          </div>
        )}

        {!loading && slides.length > 0 && (
          <>
            <CarouselInner height={400} onDoubleClick={openFullscreen} />
            <Controls onToggleFS={openFullscreen} />
          </>
        )}
      </section>

      {/* ── MODE PLEIN ÉCRAN (overlay) ── */}
      {fullscreen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) closeFullscreen() }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.96)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fsIn 0.25s ease',
          }}
        >
          <style>{`
            @keyframes fsIn {
              from { opacity: 0; transform: scale(0.97); }
              to   { opacity: 1; transform: scale(1); }
            }
          `}</style>

          <div style={{ position: 'relative', width: '100%' }}>
            <CarouselInner height="90vh" onDoubleClick={closeFullscreen} />
            <Controls onToggleFS={closeFullscreen} />
          </div>
        </div>
      )}
    </>
  )
}

export default Galeries