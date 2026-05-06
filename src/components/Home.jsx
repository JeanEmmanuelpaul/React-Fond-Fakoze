import React, { useState, useEffect } from 'react'
import image1 from '../assets/images/banner.jpg'
import Layout from './common/Layout'
import useTrackVisite from './common/useTrackVisite'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Contacts from './common/Contacts'

// ── Helpers ────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return { day: '--', mon: '---' }
  const d = new Date(dateStr)
  return {
    day: d.getDate().toString().padStart(2, '0'),
    mon: d.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase(),
  }
}

const truncate = (text, max = 120) =>
  text && text.length > max ? text.slice(0, max) + '…' : text

const Home = () => {
  useTrackVisite('/')
  const navigate = useNavigate()

  const [about,    setAbout]    = useState(null)
  const [articles, setArticles] = useState([])
  const [evenements, setEvenements] = useState([])
  const [contacts, setContacts] = useState([])
   const [impact, setImpact] = useState([])
  const [loading,  setLoading]  = useState(true)
  
  useEffect(() => {
  const fetchAll = async () => {
    try {
      const [aboutRes, articlesRes, evenementsRes, contactsRes,impactRes] = await Promise.allSettled([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}about/1`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}Article`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}evenements`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}Contact`),
         axios.get(`${import.meta.env.VITE_BACKEND_URL}Impact`),
      ])

            // ── About ──
            if (aboutRes.status === 'fulfilled') {
              const d = aboutRes.value.data
              setAbout(d?.about ?? d ?? null)
            }

          if (articlesRes.status === 'fulfilled') {
        const d = articlesRes.value.data
        console.log('Article raw:', d)

        let list = []

        if (Array.isArray(d))               list = d
        else if (Array.isArray(d?.articles)) list = d.articles
        else if (Array.isArray(d?.data))     list = d.data
        else if (typeof d === 'object')      list = Object.values(d).find(v => Array.isArray(v)) || []

        console.log('list extraite:', list)   // ← regarde ici
        setArticles(list.slice(0, 4))
        }

      // ── Événements ──
      if (evenementsRes.status === 'fulfilled') {
        const d = evenementsRes.value.data
        console.log('Evenements raw:', d)                        // debug
        const list = Array.isArray(d) ? d
          : Array.isArray(d?.evenements) ? d.evenements
          : Array.isArray(d?.data)       ? d.data
          : []
        setEvenements(list.slice(0, 4))
      }
 // ── impact ──
      if (impactRes.status === 'fulfilled') {
        const d = impactRes.value.data
        const list = Array.isArray(d) ? d
          : Array.isArray(d?.impact) ? d.impact
          : Array.isArray(d?.data)     ? d.data
          : []
        setImpact(list)
      }
      


      // ── Contacts ──
      if (contactsRes.status === 'fulfilled') {
        const d = contactsRes.value.data
        const list = Array.isArray(d) ? d
          : Array.isArray(d?.contacts) ? d.contacts
          : Array.isArray(d?.data)     ? d.data
          : []
        setContacts(list)
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  fetchAll()
}, [])

  // ── Skeleton ──────────────────────────────────────────────────────────────
  const SkeletonCard = () => (
    <div className="col-12 col-sm-6 col-lg-3">
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
        <div className="placeholder-glow">
          <div className="placeholder w-100" style={{ height: 180 }} />
          <div className="card-body">
            <div className="placeholder col-8 mb-2 rounded" style={{ height: 14 }} />
            <div className="placeholder col-12 mb-1 rounded" style={{ height: 10 }} />
            <div className="placeholder col-10 rounded" style={{ height: 10 }} />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Layout>

    {/* ══ HERO (depuis about.vision) ═══════════════════════════════════ */}
<section
  className="py-5"
  style={{
    background: 'linear-gradient(135deg, var(--primary-color) 0%, #007a40 50%, var(--secondary-color) 100%)',
    minHeight: 480,
    display: 'flex',
    alignItems: 'center',
  }}
>
  <div className="container px-3">
    <div className="row align-items-center g-4">

      {/* Texte */}
      <div className="col-md-7">
        <span
          className="badge fw-semibold mb-3 px-3 py-2 rounded-pill"
          style={{ background: 'var(--white)', color: 'var(--primary-color)' }}
        >
          Accueil
        </span>

        <p
          className="fw-bold text-white mb-3"
          style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', color: 'var(--white)' }}
        >
          {loading
            ? <span className="placeholder-glow"><span className="placeholder col-10 rounded" /></span>
            : truncate(about?.vision || 'Ensemble pour un avenir meilleur', 20)
          }
        </p>

        <p
          className="mb-4"
          style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)' }}
        >
          {loading
            ? <span className="placeholder-glow"><span className="placeholder col-12 rounded" /></span>
            : about?.description
              ? truncate(about.description, 180)
              : 'Notre organisation œuvre pour l\'inclusion, l\'éducation et le développement communautaire.'
          }
        </p>

        <div className="d-flex gap-2 flex-wrap">
          
           <a href="/Don"
            className="btn fw-bold px-4 py-2 rounded-pill"
            style={{ background: 'var(--secondary-color)', color: 'var(--white)', border: 'none' }}
          >
            Nous rejoindre
          </a>
          
         <a href="/Aboute"
            className="btn fw-semibold px-4 py-2 rounded-pill"
            style={{ border: '2px solid var(--white)', color: 'var(--white)', background: 'transparent' }}
          >
            En savoir plus
          </a>
        </div>
      </div>

      {/* Image */}
      <div className="col-md-5">
        <div className="rounded-4 overflow-hidden shadow-lg" style={{ height: 320 }}>
          {about?.imagev ? (
            <img
               src={`${import.meta.env.VITE_BACKEND_URL_IMAGES}${about.imagev}`} 
              alt="Vision"
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
              onError={e => { e.target.src = image1 }}
            />
          ) : (
            <img src={image1} alt="Hero" className="w-100 h-100" style={{ objectFit: 'cover' }} />
          )}
        </div>
      </div>

    </div>
  </div>
</section>
    

     {/* ══ QUI NOUS SOMMES ══════════════════════════════════════════════ */}
<section className="py-5 bg-white">
  <div className="container px-3">
    <div className="row align-items-center g-5">

      <div className="col-md-4">
        <div className="rounded-4 overflow-hidden shadow" style={{ height: 280 }}>
          <img
         
         src={`${import.meta.env.VITE_BACKEND_URL_IMAGES}${about?.imageq || image1}`} 
            alt="Qui sommes-nous"
            className="w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>

      <div className="col-md-8">
        <span
          className="badge fw-semibold mb-3 px-3 py-2 rounded-pill"
          style={{
            background: 'rgba(0, 150, 80, 0.12)',
            color: 'var(--primary-color)',
          }}
        >
          À propos
        </span>

        <h3 className="fw-bold mb-3" style={{ color: 'var(--dark-text)' }}>
          Qui Nous Sommes
        </h3>

        <p style={{ lineHeight: 1.9, fontSize: '0.97rem', color: 'var(--light-text)' }}>
          {loading
            ? <span className="placeholder-glow"><span className="placeholder col-12" /></span>
            : truncate(about?.qui, 400) || 'Contenu non disponible.'
          }
        </p>

        
          <a href="/Aboute"
          className="btn rounded-pill px-4 mt-2 fw-semibold"
          style={{
            background: 'var(--primary-color)',
            color: 'var(--white)',
            border: 'none',
          }}
        >
          À propos &rarr;
        </a>
      </div>

    </div>
  </div>
</section>

      {/* ══ STATS ════════════════════════════════════════════════════════ */}
      <section className="py-5 bg-light">
        <div className="container px-3">
          <span className="badge fw-semibold mb-2 px-3 py-2 rounded-pill" style={{ background: '#E1F5EE', color: '#0F6E56' }}>
            Impact
          </span>
          <h3 className="fw-bold mb-1">Notre impact en chiffres</h3>
          <div style={{ width: 48, height: 3, background: '#3b82f6', borderRadius: 4, marginBottom: 32 }} />
          <div className="row g-3">
            {[
              { num: '5 200+', label: 'Membres actifs',      bg: '#E6F1FB', color: '#185FA5' },
              { num: '120',    label: 'Projets réalisés',    bg: '#E1F5EE', color: '#0F6E56' },
              { num: '14',     label: "Années d'expérience", bg: '#FAEEDA', color: '#854F0B' },
              { num: '38',     label: 'Partenaires',         bg: '#FBEAF0', color: '#993556' },
            ].map((s, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="text-center p-4 rounded-4 shadow-sm h-100" style={{ background: s.bg }}>
                  <div className="fw-bold mb-1" style={{ fontSize: '2rem', color: s.color }}>{s.num}</div>
                  <div className="text-muted small fw-semibold">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MISSIONS (depuis about API) ══════════════════════════════════ */}
      <section className="py-5 bg-white">
        <div className="container px-3">
          <span className="badge fw-semibold mb-2 px-3 py-2 rounded-pill" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
            Missions
          </span>
          <h3 className="fw-bold mb-1">Ce que nous faisons</h3>
          <div style={{ width: 48, height: 3, background: '#8b5cf6', borderRadius: 4, marginBottom: 32 }} />

          <div className="row g-3">
            {loading ? (
              [1,2,3,4].map(i => <SkeletonCard key={i} />)
            ) : (
              [
                { label: 'Mission',      text: truncate(about?.missons,      120), bg: '#E6F1FB', color: '#185FA5' },
                { label: 'Vision',       text: truncate(about?.vision,       120), bg: '#f5f3ff', color: '#8b5cf6' },
                { label: 'Description',  text: truncate(about?.description,  120), bg: '#E1F5EE', color: '#0F6E56' },
                { label: 'Notre équipe', text: truncate(about?.qui,          120), bg: '#FAEEDA', color: '#854F0B' },
              ].map((m, i) => (
                <div className="col-12 col-sm-6 col-lg-3" key={i}>
                  <div className="p-4 rounded-4 shadow-sm h-100" style={{ background: m.bg }}>
                    <h5 className="fw-bold mb-2" style={{ color: m.color }}>{m.label}</h5>
                    <p className="text-secondary small mb-0" style={{ lineHeight: 1.7 }}>
                      {m.text || 'Contenu non disponible.'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-4">
            <a href="/apropos" className="btn btn-outline-primary rounded-pill px-4">
              Voir tout &rarr;
            </a>
          </div>
        </div>
      </section>

     {/* ══ ARTICLES (4 derniers) ════════════════════════════════════════ */}
<section className="py-5 bg-light">
  <div className="container px-3">
    <span className="badge fw-semibold mb-2 px-3 py-2 rounded-pill" style={{ background: '#E1F5EE', color: '#0F6E56' }}>
      Actualités
    </span>
    <div className="d-flex align-items-center justify-content-between mb-1 flex-wrap gap-2">
      <h3 className="fw-bold mb-0">Derniers articles</h3>
      <a href="/actualite" className="btn btn-sm btn-outline-success rounded-pill px-3">
        Voir tout &rarr;
      </a>
    </div>
    <div style={{ width: 48, height: 3, background: '#10b981', borderRadius: 4, marginBottom: 32 }} />

    <div className="row g-3">
      {loading ? (
        [1,2,3,4].map(i => <SkeletonCard key={i} />)
      ) : articles.length > 0 ? (
        articles.map((article) => (
          <div className="col-12 col-sm-6 col-lg-3" key={article.id}>
            <div
              className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden"
              style={{ cursor: 'pointer', transition: '0.3s' }}
              onClick={() => navigate(`/lirearticle/${article.id}`)}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Image */}
              <div style={{ height: 180, overflow: 'hidden', background: '#f1f3f5', position: 'relative' }}>
                {article.image ? (
                  <img
                     src={`${import.meta.env.VITE_BACKEND_URL_IMAGES}${article.image}`}
                    alt={article.titre}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover', transition: '0.3s' }}
                    onError={e => {
                      e.target.style.display = 'none'
                      e.target.parentNode.innerHTML = `<div class="d-flex align-items-center justify-content-center h-100 text-muted small">Aucune image</div>`
                    }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
                    Aucune image
                  </div>
                )}

                {/* Badge catégorie flottant sur l'image */}
                {article.categorie && (
                  <span
                    className="badge position-absolute"
                    style={{
                      top: 10, left: 10,
                      background: '#E1F5EE',
                      color: '#0F6E56',
                      fontSize: '0.7rem',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    {article.categorie}
                  </span>
                )}
              </div>

              <div className="card-body p-3">
                {/* Titre */}
                <h6 className="fw-bold mb-1" style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                  {truncate(article.titre, 60)}
                </h6>

                {/* Résumé */}
                <p className="text-muted mb-2" style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
                  {truncate(article.resume || article.description, 90)}
                </p>

                {/* Auteur */}
                {article.auteur && (
                  <div className="d-flex align-items-center gap-1 mt-auto">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                      style={{ width: 24, height: 24, background: '#10b981', fontSize: '0.65rem' }}
                    >
                      {article.auteur.charAt(0).toUpperCase()}
                    </div>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {article.auteur}
                    </small>
                  </div>
                )}
              </div>

              <div className="card-footer bg-white border-0 px-3 pb-3 pt-0">
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                  {article.created_at
                    ? new Date(article.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })
                    : ''}
                </small>
              </div>

            </div>
          </div>
        ))
      ) : (
        <p className="text-muted">Aucun article disponible.</p>
      )}
    </div>
  </div>
</section>

      {/* ══ ÉVÉNEMENTS (4 derniers) ══════════════════════════════════════ */}
      <section className="py-5 bg-white">
        <div className="container px-3">
          <span
            className="badge fw-semibold mb-2 px-3 py-2 rounded-pill"
            style={{ background: '#FEF3C7', color: '#92400e' }}
          >
            Agenda
          </span>
          <div className="d-flex align-items-center justify-content-between mb-1 flex-wrap gap-2">
            <h3 className="fw-bold mb-0">Prochains événements</h3>
            <a href="/Agenda" className="btn btn-sm btn-outline-warning rounded-pill px-3">
              Voir tout &rarr;
            </a>
          </div>
          <div style={{ width: 48, height: 3, background: '#f59e0b', borderRadius: 4, marginBottom: 32 }} />

          <div className="row g-3">
            {loading ? (
              [1,2,3,4].map(i => <SkeletonCard key={i} />)
            ) : evenements.length > 0 ? (
              evenements.map((evenement) => {
                const { day, mon } = formatDate(evenement.date)
                const isTermine    = evenement.statut === 'terminé'

                return (
                  <div className="col-12 col-sm-6 col-lg-3" key={evenement.id}>
                    <div
                      className="card border-0 shadow-sm rounded-4 h-100 p-3"
                      style={{
                        borderLeft: `4px solid ${isTermine ? '#dc3545' : '#10b981'}`,
                        transition: '0.3s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div className="d-flex gap-3 align-items-start">

                        {/* Date badge */}
                        <div
                          className="text-center rounded-3 p-2 flex-shrink-0"
                          style={{ background: isTermine ? '#fff0f0' : '#E1F5EE', minWidth: 52 }}
                        >
                          <div
                            className="fw-bold"
                            style={{ fontSize: '1.4rem', color: isTermine ? '#dc3545' : '#10b981', lineHeight: 1 }}
                          >
                            {day}
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                            {mon}
                          </div>
                        </div>

                        {/* Infos */}
                        <div className="flex-grow-1 min-w-0">
                          <h6 className="fw-bold mb-1" style={{ fontSize: '0.88rem', lineHeight: 1.4 }}>
                            {truncate(evenement.titre, 50) || 'Sans titre'}
                          </h6>

                          <p className="text-muted mb-1" style={{ fontSize: '0.78rem' }}>
                            {evenement.lieu || 'Lieu inconnu'}
                          </p>

                          {evenement.capacite && (
                            <p className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>
                              Capacité : {evenement.capacite} personnes
                            </p>
                          )}

                        

                          <span
                            className="badge rounded-pill"
                            style={{
                              background: isTermine ? '#fff0f0' : '#E1F5EE',
                              color:      isTermine ? '#dc3545' : '#10b981',
                              fontSize: '0.7rem',
                            }}
                          >
                            {evenement.statut || 'À venir'}
                          </span>
                        </div>

                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-muted">Aucun événement disponible.</p>
            )}
          </div>
        </div>
      </section>
    {/* ══ NEWSLETTER ═══════════════════════════════════════════════════ */}
<section className="py-4" style={{ background: 'linear-gradient(135deg, var(--primary-color), #007a40)' }}>
  <div className="container px-3">
    <div className="row align-items-center g-2">

      <div className="col-md-6">
        <h5 className="text-white fw-bold mb-1" style={{ fontSize: '1rem' }}>
          Restez informé
        </h5>
        <p className="mb-0" style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>
          Abonnez-vous à notre newsletter pour ne rien manquer.
        </p>
      </div>

      <div className="col-md-6">
        <div className="d-flex gap-2">
          <input
            type="email"
            placeholder="Votre adresse email"
            className="form-control form-control-sm rounded-pill px-3"
            style={{
              maxWidth: 240,
              fontSize: '0.82rem',
              border: '1.5px solid rgba(255,255,255,0.4)',
              background: 'rgba(255,255,255,0.15)',
              color: 'var(--white)',
            }}
          />
          <button
            className="btn btn-sm rounded-pill px-3 fw-semibold"
            style={{
              background: 'var(--secondary-color)',
              color: 'var(--white)',
              fontSize: '0.82rem',
              border: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            S'abonner
          </button>
        </div>
      </div>

    </div>
  </div>
</section>
      {/* ══ CONTACT ══════════════════════════════════════════════════════ */}
  <Contacts/>

      

    </Layout>
  )
}

export default Home