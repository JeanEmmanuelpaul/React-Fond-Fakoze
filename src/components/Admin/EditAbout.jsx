import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminLayout from './common/AdminLayout'

const ABOUT_ID = 1

const EditAbout = () => {
  const navigate = useNavigate()

  const [loading,  setLoading]  = useState(false)
  const [fetching, setFetching] = useState(true)
  const [message,  setMessage]  = useState(null)

  const [form, setForm] = useState({
    missons:     '',
    imagem:      '',
    vision:      '',
    imagev:      '',
    description: '',
    imaged:      '',
    qui:         '',
    imageq:      '',
  })

  // ── Charger l'enregistrement about id=1 ──
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res  = await axios.get(`${import.meta.env.VITE_BACKEND_URL}about/${ABOUT_ID}`)
        const data = res.data.about || res.data

        setForm({
          missons:     data.missons     || '',
          imagem:      data.imagem      || '',
          vision:      data.vision      || '',
          imagev:      data.imagev      || '',
          description: data.description || '',
          imaged:      data.imaged      || '',
          qui:         data.qui         || '',
          imageq:      data.imageq      || '',
        })
      } catch (error) {
        console.error('Erreur chargement about :', error)
        setMessage({ type: 'danger', text: "Impossible de charger les données." })
      } finally {
        setFetching(false)
      }
    }

    fetchAbout()
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
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}about/${ABOUT_ID}`, form)
      setMessage({ type: 'success', text: 'Informations mises à jour avec succès !' })
      setTimeout(() => navigate('/Admin/Dashboard'), 1500)
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

  // ── Composant réutilisable : champ texte + aperçu image ──
  const ImageField = ({ label, textName, imageName }) => (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <h6 className="text-muted text-uppercase small fw-semibold mb-3">
          {label}
        </h6>

        {/* Texte */}
        <div className="mb-3">
          <label className="form-label">Contenu</label>
          <textarea
            className="form-control"
            name={textName}
            value={form[textName]}
            onChange={handleChange}
            rows={4}
            placeholder={`Décrivez ${label.toLowerCase()}...`}
          />
        </div>

        {/* URL Image */}
        <div className="mb-2">
          <label className="form-label">Image (URL)</label>
          <input
            type="text"
            className="form-control"
            name={imageName}
            value={form[imageName]}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        {/* Aperçu */}
        {form[imageName] && (
          <div className="mt-2">
            <label className="form-label text-muted small">Aperçu</label>
            <img
              src={form[imageName]}
              alt={`aperçu ${label}`}
              className="d-block rounded"
              style={{ maxHeight: '160px', objectFit: 'cover' }}
              onError={e => (e.target.style.display = 'none')}
            />
          </div>
        )}
      </div>
    </div>
  )

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

  return (
    <AdminLayout>
      <div className="container py-5 px-4">
        <div className="container-fluid py-4">

          {/* Header */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigate(-1)}
            >
              ← Retour
            </button>
            <div>
              <h4 className="mb-0 fw-semibold">À propos – Modifier le contenu</h4>
              <small className="text-muted">Mise à jour de la page À propos</small>
            </div>
          </div>

          {/* Alert */}
          {message && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage(null)} />
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ── Mission ── */}
            <ImageField
              label="Mission"
              textName="missons"
              imageName="imagem"
            />

            {/* ── Vision ── */}
            <ImageField
              label="Vision"
              textName="vision"
              imageName="imagev"
            />

            {/* ── Description ── */}
            <ImageField
              label="Description"
              textName="description"
              imageName="imaged"
            />

            {/* ── Qui sommes-nous ── */}
            <ImageField
              label="Qui sommes-nous"
              textName="qui"
              imageName="imageq"
            />

            {/* ── Actions ── */}
            <div className="d-flex justify-content-end gap-2 mt-2">
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

export default EditAbout