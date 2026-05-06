import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminLayout from './common/AdminLayout'

const CreateAbout = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}about`, form)
      setMessage({ type: 'success', text: 'Page "À propos" créée avec succès !' })
      setTimeout(() => navigate('/Admin/Aboute'), 1500)
    } catch (error) {
      console.error('Erreur création :', error)
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
              <h4 className="mb-0 fw-semibold">À propos – Créer le contenu</h4>
              <small className="text-muted">Remplir la page À propos</small>
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
            <ImageField label="Mission"        textName="missons"     imageName="imagem" />

            {/* ── Vision ── */}
            <ImageField label="Vision"         textName="vision"      imageName="imagev" />

            {/* ── Description ── */}
            <ImageField label="Description"    textName="description" imageName="imaged" />

            {/* ── Qui sommes-nous ── */}
            <ImageField label="Qui sommes-nous" textName="qui"        imageName="imageq" />

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
                className="btn btn-success px-4 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Enregistrement...
                  </>
                ) : (
                  '✅ Enregistrer'
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default CreateAbout