import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminLayout from './common/AdminLayout'

const IMPACT_ID = 1

const EditImpact = () => {
  const navigate = useNavigate()

  const [loading,  setLoading]  = useState(false)
  const [fetching, setFetching] = useState(true)
  const [message,  setMessage]  = useState(null)

  const [form, setForm] = useState({
    membres:      '',
    projets:      '',
    experiences:  '',
    partenaires:  '',
  })

  // ── Charger les données impact id=1 ──
  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const res  = await axios.get(`${import.meta.env.VITE_BACKEND_URL}Impact`)
        const data = res.data[0] || res.data

        setForm({
          membres:     data.membres     ?? '',
          projets:     data.projets     ?? '',
          experiences: data.experiences ?? '',
          partenaires: data.partenaires ?? '',
        })
      } catch (error) {
        console.error('Erreur chargement impact :', error)
        setMessage({ type: 'danger', text: "Impossible de charger les données." })
      } finally {
        setFetching(false)
      }
    }
    fetchImpact()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}Impact/${IMPACT_ID}`, form)
      setMessage({ type: 'success', text: 'Impact mis à jour avec succès !' })
      setTimeout(() => navigate('/Admin/dashbord'), 1500)
    } catch (error) {
      console.error('Erreur update :', error)
      const errors = error.response?.data?.errors
      if (errors) {
        const firstError = Object.values(errors)[0][0]
        setMessage({ type: 'danger', text: firstError })
      } else {
        setMessage({ type: 'danger', text: 'Une erreur est survenue.' })
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Loader ──
  if (fetching) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" />
            <p className="text-muted">Chargement des données...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  // ── Config des champs ──
  const fields = [
    { name: 'membres',     label: 'Membres',      icon: '👥', color: '#3b82f6', placeholder: 'Ex : 1200' },
    { name: 'projets',     label: 'Projets',       icon: '📁', color: '#10b981', placeholder: 'Ex : 85'   },
    { name: 'experiences', label: 'Expériences',   icon: '⭐', color: '#f59e0b', placeholder: 'Ex : 10'   },
    { name: 'partenaires', label: 'Partenaires',   icon: '🤝', color: '#8b5cf6', placeholder: 'Ex : 40'   },
  ]

  return (
    <AdminLayout>
      <div className="container py-5 px-4">
        <div className="container-fluid py-4">

          {/* ── Header ── */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigate(-1)}
            >
              ← Retour
            </button>
            <div>
              <h4 className="mb-0 fw-semibold">Impact – Modifier les chiffres</h4>
              <small className="text-muted">Chiffres clés affichés sur la page publique</small>
            </div>
          </div>

          {/* ── Alert ── */}
          {message && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage(null)} />
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ── Aperçu visuel des chiffres ── */}
            <div className="row g-3 mb-4">
              {fields.map(f => (
                <div className="col-6 col-md-3" key={f.name}>
                  <div
                    className="card border-0 text-center py-3 px-2 shadow-sm"
                    style={{ borderRadius: '14px', borderTop: `4px solid ${f.color}` }}
                  >
                    <div style={{ fontSize: 28 }}>{f.icon}</div>
                    <div
                      className="fw-bold mt-1"
                      style={{ fontSize: '1.6rem', color: f.color }}
                    >
                      {form[f.name] || '—'}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {f.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Champs de saisie ── */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h6 className="text-muted text-uppercase small fw-semibold mb-4">
                  Modifier les valeurs
                </h6>

                <div className="row g-3">
                  {fields.map(f => (
                    <div className="col-md-6" key={f.name}>
                      <label className="form-label d-flex align-items-center gap-2">
                        <span>{f.icon}</span>
                        <span className="fw-semibold">{f.label}</span>
                      </label>
                      <div className="input-group">
                        <span
                          className="input-group-text border-0"
                          style={{ background: f.color + '15', color: f.color, fontWeight: 600 }}
                        >
                          #
                        </span>
                        <input
                          type="number"
                          className="form-control"
                          name={f.name}
                          value={form[f.name]}
                          onChange={handleChange}
                          placeholder={f.placeholder}
                          min="0"
                          style={{ borderLeft: `2px solid ${f.color}30` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-warning px-4 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Mise à jour...
                  </>
                ) : (
                  '💾 Mettre à jour'
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default EditImpact