import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Layout from './common/Layout'

const ABOUT_ID = 1

const Aboute = () => {
  const [data,     setData]     = useState(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}about/${ABOUT_ID}`)
        setData(res.data.about || res.data)
      } catch (error) {
        console.error(error)
      } finally {
        setFetching(false)
      }
    }
    fetchAbout()
  }, [])

  // ── Sections config ───────────────────────────────────────────────────────
  // ✅ Correction — helper url() appliqué partout
const url = (path) => path ? `${import.meta.env.VITE_BACKEND_URL_IMAGES}${path}` : null

const sections = data ? [
  {
    label:    'Notre Mission',
    text:     data?.missons,
    imageUrl: url(data?.imagem),
    accent:   '#3b82f6',
    bg:       '#eff6ff',
    reverse:  false,
  },
  {
    label:    'Notre Vision',
    text:     data?.vision,
    imageUrl: url(data?.imagev),
    accent:   '#8b5cf6',
    bg:       '#f5f3ff',
    reverse:  true,
  },
  {
    label:    'Description',
    text:     data?.description,
    imageUrl: url(data?.imaged),
    accent:   '#10b981',
    bg:       '#ecfdf5',
    reverse:  false,
  },
  {
    label:    'Qui sommes-nous ?',
    text:     data?.qui,
    imageUrl: url(data?.imageq),
    accent:   '#f59e0b',
    bg:       '#fffbeb',
    reverse:  true,
  },
] : []


  return (
    <Layout>

     

      {/* ── Loader ──────────────────────────────────────────────────────── */}
      {fetching && (
        <section className="py-5">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" style={{ width: 48, height: 48 }} role="status" />
              <p className="text-muted">Chargement du contenu...</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Contenu principal ───────────────────────────────────────────── */}
      {!fetching && data && sections.map((section, index) => (
        <section
          key={index}
          style={{ background: index % 2 === 0 ? '#ffffff' : '#f8fafc', padding: '80px 0' }}
        >
          <div className="container">
            <div className={`row align-items-center g-5 ${section.reverse ? 'flex-row-reverse' : ''}`}>

              {/* Texte */}
              <div className="col-lg-6">

                {/* Badge label */}
                <div
                  className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4"
                  style={{ background: section.bg, border: `1.5px solid ${section.accent}30` }}
                >
                  <span style={{ color: section.accent }}>{section.icon}</span>
                  <span className="fw-bold" style={{ color: section.accent, fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                    {section.label}
                  </span>
                </div>

                {/* Trait coloré + titre */}
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div style={{ width: 4, height: 36, borderRadius: 4, background: section.accent }} />
                  <h2 className="fw-bold mb-0" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
                    {section.label}
                  </h2>
                </div>

                {/* Texte */}
                {section.text ? (
                  <p
                    className="text-secondary"
                    style={{ fontSize: '1rem', lineHeight: 1.9, textAlign: 'justify' }}
                  >
                    {section.text}
                  </p>
                ) : (
                  <p className="text-muted fst-italic">Contenu non disponible.</p>
                )}

                {/* Trait décoratif bas */}
                <div
                  style={{
                    width: 60, height: 3, borderRadius: 4,
                    background: `linear-gradient(90deg, ${section.accent}, transparent)`,
                    marginTop: 24
                  }}
                />
              </div>

              {/* Image */}
              <div className="col-lg-6">
                <div
                  className="rounded-4 overflow-hidden shadow-lg position-relative"
                  style={{ height: 380 }}
                >
                  {/* Barre colorée top */}
                  <div style={{ height: 5, background: section.accent, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }} />

                  {section.imageUrl ? (
                    <img
                      src={section.imageUrl}
                      alt={section.label}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      onError={e => {
                        e.target.style.display = 'none'
                        e.target.parentNode.innerHTML += `
                          <div class="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                            <span style="font-size:3rem">🖼️</span>
                            <small>Image non disponible</small>
                          </div>`
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex flex-column align-items-center justify-content-center h-100"
                      style={{ background: section.bg }}
                    >
                      <span style={{ fontSize: 64, opacity: 0.3 }}>{section.icon}</span>
                      <small className="text-muted mt-2">Aucune image</small>
                    </div>
                  )}

                  {/* Badge flottant */}
                  <div
                    className="position-absolute bottom-0 start-0 m-3 px-3 py-2 rounded-3"
                    style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                  >
                    <span style={{ color: section.accent, fontWeight: 700, fontSize: '0.8rem' }}>
                      {section.label}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      ))}

      {/* ── Pas de données ──────────────────────────────────────────────── */}
      {!fetching && !data && (
        <section className="py-5">
          <div className="text-center py-5">
            <div style={{ fontSize: 64 }}>📭</div>
            <h4 className="mt-3 text-muted">Contenu non disponible</h4>
            <p className="text-muted small">La page À propos n'a pas encore été configurée.</p>
          </div>
        </section>
      )}

    

    </Layout>
  )
}

export default Aboute