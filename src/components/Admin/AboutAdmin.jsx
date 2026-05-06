import React, { useState, useEffect } from 'react'
import AdminLayout from './common/AdminLayout'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { BsImage, BsSave, BsArrowLeft } from 'react-icons/bs'

const ABOUT_ID = 1

// ── ImageUpload EN DEHORS du composant ────────────────────────────────────
const ImageUpload = ({ label, fieldKey, accent, previews, images, onImage, onRemove }) => (
  <div>
    <label className="form-label fw-semibold small" style={{ color: accent }}>
      <BsImage className="me-1" />{label}
    </label>

    <div
      onClick={() => document.getElementById(`img_${fieldKey}`).click()}
      onDrop={e => { e.preventDefault(); onImage(fieldKey, e.dataTransfer.files[0]) }}
      onDragOver={e => e.preventDefault()}
      style={{
        height: 160,
        border: `2px dashed ${accent}50`,
        borderRadius: 12,
        cursor: 'pointer',
        overflow: 'hidden',
        background: `${accent}08`,
        transition: '0.2s',
        position: 'relative',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = accent}
      onMouseLeave={e => e.currentTarget.style.borderColor = `${accent}50`}
    >
      {previews[fieldKey] ? (
        <img
          src={previews[fieldKey]}
          alt={label}
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
          <BsImage size={28} style={{ opacity: 0.35, color: accent }} />
          <small className="mt-1 fw-semibold" style={{ fontSize: '0.75rem' }}>Cliquez ou glissez</small>
          <small style={{ fontSize: '0.7rem', opacity: 0.6 }}>JPG, PNG, WEBP</small>
        </div>
      )}
    </div>

    <input
      id={`img_${fieldKey}`}
      type="file"
      accept="image/*"
      style={{ display: 'none' }}
      onChange={e => onImage(fieldKey, e.target.files[0])}
    />

    {images[fieldKey] && (
      <div className="d-flex align-items-center justify-content-between mt-1">
        <small className="text-muted text-truncate" style={{ maxWidth: 160, fontSize: '0.72rem' }}>
          {images[fieldKey].name}
        </small>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger rounded-3"
          style={{ fontSize: '0.7rem', padding: '1px 8px' }}
          onClick={() => onRemove(fieldKey)}
        >
          Retirer
        </button>
      </div>
    )}
  </div>
)

// ── Composant principal ───────────────────────────────────────────────────
const EditAbout = () => {
  const navigate = useNavigate()

  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [message,  setMessage]  = useState(null)

  const [form, setForm] = useState({
    missons: '', vision: '', description: '', qui: '',
  })

  const [images,   setImages]   = useState({ imagem: null, imagev: null, imaged: null, imageq: null })
  const [previews, setPreviews] = useState({ imagem: null, imagev: null, imaged: null, imageq: null })

  // ── Fetch ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAbout = async () => {                          // ✅ renommé
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}about/${ABOUT_ID}`)
        const d   = res.data?.about || res.data

        setForm({
          missons:     d?.missons     || '',
          vision:      d?.vision      || '',
          description: d?.description || '',
          qui:         d?.qui         || '',
        })

        const url = (path) => path
          ? `${import.meta.env.VITE_BACKEND_URL_IMAGES}${path}`
          : null

        setPreviews({
          imagem: url(d?.imagem),
          imagev: url(d?.imagev),
          imaged: url(d?.imaged),
          imageq: url(d?.imageq),
        })

      } catch {
        setMessage({ type: 'danger', text: 'Impossible de charger les données.' })
      } finally {
        setLoading(false)
      }
    }
    fetchAbout()
  }, [])

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImage = (key, file) => {
    if (!file) return
    setImages(prev   => ({ ...prev, [key]: file }))
    setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }))
  }

  const removeImage = (key) => {
    setImages(prev   => ({ ...prev, [key]: null }))
    setPreviews(prev => ({ ...prev, [key]: null }))
  }

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('missons',     form.missons)
      formData.append('vision',      form.vision)
      formData.append('description', form.description)
      formData.append('qui',         form.qui)
      formData.append('_method',     'PUT')

      if (images.imagem) formData.append('imagem', images.imagem)
      if (images.imagev) formData.append('imagev', images.imagev)
      if (images.imaged) formData.append('imaged', images.imaged)
      if (images.imageq) formData.append('imageq', images.imageq)

      const token = JSON.parse(localStorage.getItem('adminInfo'))?.token

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}about/${ABOUT_ID}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }
      )

      setMessage({ type: 'success', text: 'Contenu mis à jour avec succès !' })
      setTimeout(() => navigate('/Admin/AboutAdmin'), 1200)

    } catch (error) {
      const errors = error.response?.data?.errors
      if (errors) {
        setMessage({ type: 'danger', text: Object.values(errors)[0][0] })
      } else {
        setMessage({ type: 'danger', text: 'Erreur serveur.' })
      }
    } finally {
      setSaving(false)
    }
  }

  // ── Loader ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" />
            <p className="text-muted">Chargement...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const sections = [
    { key: 'missons',     label: 'Mission',         imageKey: 'imagem', accent: '#3b82f6', rows: 4 },
    { key: 'vision',      label: 'Vision',          imageKey: 'imagev', accent: '#8b5cf6', rows: 4 },
    { key: 'description', label: 'Description',     imageKey: 'imaged', accent: '#10b981', rows: 4 },
    { key: 'qui',         label: 'Qui sommes-nous', imageKey: 'imageq', accent: '#f59e0b', rows: 4 },
  ]

  return (
    <AdminLayout>
      <div className="container-fluid py-4 px-4">

        {/* Header */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <button className="btn btn-sm btn-outline-secondary rounded-3" onClick={() => navigate('/Admin/AboutAdmin')}>
            <BsArrowLeft />
          </button>
          <div>
            <h4 className="fw-bold mb-0">Modifier À propos</h4>
            <small className="text-muted">Textes et images de la page publique</small>
          </div>
        </div>

        {/* Alert */}
        {message && (
          <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-4">
            {sections.map((s) => (
              <div className="col-12 col-lg-6" key={s.key}>
                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                  <div style={{ height: 4, background: s.accent }} />
                  <div className="card-body p-4">

                    <div
                      className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                      style={{ background: s.accent + '15', color: s.accent, fontSize: '0.78rem', fontWeight: 700 }}
                    >
                      {s.label.toUpperCase()}
                    </div>

                    <textarea
                      name={s.key}
                      className="form-control rounded-3 mb-3"
                      placeholder={`Contenu — ${s.label}`}
                      rows={s.rows}
                      value={form[s.key]}
                      onChange={handleChange}
                      style={{ fontSize: '0.88rem', resize: 'vertical' }}
                    />

                    {/* ✅ props passées explicitement */}
                    <ImageUpload
                      label={`Image — ${s.label}`}
                      fieldKey={s.imageKey}
                      accent={s.accent}
                      previews={previews}
                      images={images}
                      onImage={handleImage}
                      onRemove={removeImage}
                    />

                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex gap-2 mt-4">
            <button
              type="submit"
              className="btn fw-semibold rounded-3 px-4"
              disabled={saving}
              style={{ background: 'var(--primary-color)', color: '#fff', border: 'none' }}
            >
              {saving
                ? <><span className="spinner-border spinner-border-sm me-2" />Enregistrement...</>
                : <><BsSave size={15} className="me-2" />Enregistrer</>
              }
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary rounded-3 px-4"
              onClick={() => navigate('/Admin/AboutAdmin')}
              disabled={saving}
            >
              Annuler
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  )
}

export default EditAbout