import React, { useState, useEffect } from 'react'
import image1 from '../../assets/images/banner.jpg'
import Carousel from 'react-bootstrap/Carousel'
import axios from 'axios'

const Hero = () => {
  const [sliders,    setSliders]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res  = await axios.get(`${import.meta.env.VITE_BACKEND_URL}sliders`)
        const d    = res.data
        const list = Array.isArray(d)          ? d
                   : Array.isArray(d?.sliders) ? d.sliders
                   : Array.isArray(d?.data)    ? d.data
                   : []
        setSliders(list)
      } catch (err) {
        console.error('Sliders error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSliders()
  }, [])

  return (
    <>
      <div className='py-2' ></div>
    <section className="section-1" style={{ position: 'relative' }}>

      {/* ── Skeleton ── */}
      {loading && (
        <div className="w-100 placeholder-glow" style={{ height: 400, background: '#e9ecef' }}>
          <div className="placeholder w-100 h-100" />
        </div>
      )}

      {/* ── Aucun slider en BDD ── */}
      {!loading && sliders.length === 0 && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: 400, background: '#f8f9fa' }}
        >
          <p className="text-muted">Aucun slider disponible.</p>
        </div>
      )}

      {/* ── Carousel ── */}
      {!loading && sliders.length > 0 && (
        <>
          <Carousel
            fade
            activeIndex={activeIndex}
            onSelect={(i) => setActiveIndex(i)}
          >
            {sliders.map((slide, index) => (
              <Carousel.Item key={slide.id || index}>

                <img
                    src={slide.image
                      ? `${import.meta.env.VITE_BACKEND_URL_IMAGE}${slide.image}`
                      : image1
                    }
                    className="d-block w-100"
                    style={{ height: 400, objectFit: 'cover' }}
                    alt={slide.titre || `slide-${index + 1}`}
                    // onError={e => { e.target.src = image1 }}
                  />

                {/* Overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)'
                }} />

                <Carousel.Caption style={{ paddingBottom: 48 }}>
                  <h3
                    className="fw-bold"
                    style={{
                      fontSize: 'clamp(1.2rem, 3vw, 2rem)',
                      textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    }}
                  >
                    {slide.titre || ''}
                  </h3>
                  <p style={{ fontSize: '0.95rem', opacity: 0.9, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                    {slide.description || ''}
                  </p>
                </Carousel.Caption>

              </Carousel.Item>
            ))}
          </Carousel>

          {/* ── Compteur  ex: 2 / 5 ── */}
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              right: 20,
              zIndex: 10,
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(6px)',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: 20,
              letterSpacing: '0.05em',
            }}
          >
            {activeIndex + 1} / {sliders.length}
          </div>

          {/* ── Dots personnalisés ── */}
          <div
            className="d-flex gap-2 justify-content-center"
            style={{ position: 'absolute', bottom: 16, left: 0, right: 0, zIndex: 10 }}
          >
            {sliders.map((_, i) => (
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
        </>
      )}

    </section>
    </>
  )
}

export default Hero