import React, { useState, useEffect } from 'react'
import AdminLayout from './common/AdminLayout'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { BsPencilFill, BsTrashFill, BsPlus } from 'react-icons/bs'

const Sliders = () => {
  const navigate = useNavigate()

  const [sliders, setSliders] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [message, setMessage] = useState(null)

  // ── Fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchSliders()
  }, [])

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
      setMessage({ type: 'danger', text: 'Impossible de charger les sliders.' })
    } finally {
      setLoading(false)
    }
  }

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce slider ?')) return
    setDeleting(id)
    try {
      const token = JSON.parse(localStorage.getItem('adminInfo'))?.token
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}sliders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSliders(prev => prev.filter(s => s.id !== id))
      setMessage({ type: 'success', text: 'Slider supprimé avec succès.' })
    } catch {
      setMessage({ type: 'danger', text: 'Erreur lors de la suppression.' })
    } finally {
      setDeleting(null)
    }
  }

  // ── Skeleton ─────────────────────────────────────────────────────────────
  const SkeletonCard = () => (
    <div className="col-12 col-sm-6 col-lg-4">
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden placeholder-glow">
        <div className="placeholder w-100" style={{ height: 200 }} />
        <div className="card-body p-3">
          <div className="placeholder col-8 rounded mb-2" style={{ height: 14 }} />
          <div className="placeholder col-5 rounded"     style={{ height: 10 }} />
        </div>
      </div>
    </div>
  )

  return (
    <AdminLayout>
        <div className='py-3'></div>
      <div className="container-fluid py-5 px-4">

        {/* ── Header ── */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: 48, height: 48,
                background: 'linear-gradient(135deg, var(--primary-color), #007a40)',
              }}
            >
              <span className="text-white fw-bold" style={{ fontSize: '1.2rem' }}>S</span>
            </div>
            <div>
              <h4 className="fw-bold mb-0">Sliders</h4>
              <small className="text-muted">{sliders.length} slide(s) au total</small>
            </div>
          </div>

          <button
            className="btn fw-semibold rounded-3 px-4"
            style={{ background: 'var(--primary-color)', color: '#fff', border: 'none' }}
            onClick={() => navigate('/Admin/AddSlide')}
          >
            <BsPlus size={18} className="me-1" />
            Nouveau slider
          </button>
        </div>

        {/* ── Alert ── */}
        {message && (
          <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage(null)} />
          </div>
        )}

        {/* ── Grille ── */}
        <div className="row g-4">

          {loading ? (
            [1,2,3].map(i => <SkeletonCard key={i} />)

          ) : sliders.length === 0 ? (
            <div className="col-12">
              <div className="text-center py-5">
                <div style={{ fontSize: 52, opacity: 0.3 }}>🖼️</div>
                <h5 className="mt-3 text-muted">Aucun slider</h5>
                <p className="text-muted small mb-4">Ajoutez votre premier slide au carousel.</p>
                <button
                  className="btn rounded-3 px-4 fw-semibold"
                  style={{ background: 'var(--primary-color)', color: '#fff', border: 'none' }}
                  onClick={() => navigate('/Admin/AddSlide')}
                >
                  <BsPlus size={18} className="me-1" />
                  Ajouter un slider
                </button>
              </div>
            </div>

          ) : (
            sliders.map((slide, index) => (
              <div className="col-12 col-sm-6 col-lg-4" key={slide.id}>
                <div
                  className="card border-0 shadow-sm rounded-4 overflow-hidden h-100"
                  style={{ transition: '0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* Barre top */}
                  <div style={{ height: 4, background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))' }} />

                  {/* Image */}
                  <div style={{ height: 200, overflow: 'hidden', background: '#f1f3f5', position: 'relative' }}>
                    {slide.image ? (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL_IMAGE}${slide.image}`}
                        alt={slide.titre}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                        onError={e => {
                          e.target.style.display = 'none'
                          e.target.parentNode.innerHTML += `<div class="d-flex align-items-center justify-content-center h-100 text-muted" style="font-size:0.8rem">Image introuvable</div>`
                        }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
                        Aucune image
                      </div>
                    )}

                    {/* Badge numéro */}
                    <div
                      className="position-absolute top-0 start-0 m-2"
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: 20,
                      }}
                    >
                      #{index + 1}
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="card-body p-3">
                    <h6 className="fw-bold mb-1" style={{ fontSize: '0.95rem' }}>
                      {slide.titre || '—'}
                    </h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                      {slide.description
                        ? slide.description.length > 80
                          ? slide.description.slice(0, 80) + '…'
                          : slide.description
                        : <span className="fst-italic">Aucune description</span>
                      }
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="card-footer bg-white border-0 px-3 pb-3 pt-0 d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-warning rounded-3 flex-fill"
                      onClick={() => navigate(`/Admin/EditSlide/${slide.id}`)}
                    >
                      <BsPencilFill size={12} className="me-1" />
                      Modifier
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger rounded-3 flex-fill"
                      onClick={() => handleDelete(slide.id)}
                      disabled={deleting === slide.id}
                    >
                      {deleting === slide.id
                        ? <span className="spinner-border spinner-border-sm" />
                        : <><BsTrashFill size={12} className="me-1" />Supprimer</>
                      }
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </AdminLayout>
  )
}

export default Sliders