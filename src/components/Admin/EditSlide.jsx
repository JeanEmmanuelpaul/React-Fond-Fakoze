import React, { useState, useEffect } from 'react'
import AdminLayout from './common/AdminLayout'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { BsImage, BsSave, BsArrowLeft } from 'react-icons/bs'

// ── ImageUpload en dehors du composant ────────────────────────────────────
const ImageUpload = ({ preview, onImage, onRemove, imageFile }) => (
  <div>
    <label className="form-label fw-semibold small text-muted">
      <BsImage className="me-1" />Image du slide
    </label>

    <div
      onClick={() => document.getElementById('imageInput').click()}
      onDrop={e => { e.preventDefault(); onImage(e.dataTransfer.files[0]) }}
      onDragOver={e => e.preventDefault()}
      style={{
        height: 220,
        border: '2px dashed #dee2e6',
        borderRadius: 12,
        cursor: 'pointer',
        overflow: 'hidden',
        background: '#f8f9fa',
        transition: '0.2s',
        position: 'relative',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-color)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#dee2e6'}
    >
      {preview ? (
        <img
          src={preview}
          alt="preview"
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
          <BsImage size={36} className="mb-2" style={{ opacity: 0.4 }} />
          <small className="fw-semibold">Glissez une image ici</small>
          <small style={{ fontSize: '0.75rem' }}>ou cliquez pour sélectionner</small>
          <small className="mt-2" style={{ fontSize: '0.7rem', opacity: 0.6 }}>
            JPG, PNG, WEBP — max 2 Mo
          </small>
        </div>
      )}
    </div>

    <input
      id="imageInput"
      type="file"
      accept="image/*"
      style={{ display: 'none' }}
      onChange={e => onImage(e.target.files[0])}
    />

    {imageFile && (
      <div className="d-flex align-items-center justify-content-between mt-2">
        <small className="text-muted text-truncate" style={{ maxWidth: 180, fontSize: '0.72rem' }}>
          {imageFile.name}
        </small>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger rounded-3"
          style={{ fontSize: '0.7rem', padding: '2px 8px' }}
          onClick={onRemove}
        >
          Retirer
        </button>
      </div>
    )}
  </div>
)

// ── Composant principal ───────────────────────────────────────────────────
const EditSlide = () => {
  const navigate    = useNavigate()
  const { id }      = useParams()

  const [form,     setForm]     = useState({ titre: '', description: '' })
  const [image,    setImage]    = useState(null)
  const [preview,  setPreview]  = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [message,  setMessage]  = useState(null)

  // ── Fetch slide existant ──────────────────────────────────────────────
  useEffect(() => {
    const fetchSlide = async () => {
      try {
        const res  = await axios.get(`${import.meta.env.VITE_BACKEND_URL}sliders/${id}`)
        const d    = res.data?.slider || res.data

        setForm({
          titre:       d?.titre       || '',
          description: d?.description || '',
        })

        if (d?.image) {
          setPreview(`${import.meta.env.VITE_BACKEND_URL_IMAGES}${d.image}`)
        }

      } catch {
        setMessage({ type: 'danger', text: 'Impossible de charger le slider.' })
      } finally {
        setLoading(false)
      }
    }
    fetchSlide()
  }, [id])

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImage = (file) => {
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImage(null)
    setPreview(null)
  }

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.titre) {
      setMessage({ type: 'warning', text: 'Le titre est obligatoire.' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('titre',       form.titre)
      formData.append('description', form.description)
      formData.append('_method',     'PUT')
      if (image) formData.append('image', image)

      const token = JSON.parse(localStorage.getItem('adminInfo'))?.token

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}sliders/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          }
        }
      )

      setMessage({ type: 'success', text: 'Slider modifié avec succès !' })
      setTimeout(() => navigate('/Admin/Sliders'), 1200)

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
            <p className="text-muted">Chargement du slider...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
        <div className='py-5'></div>
      <div className="container-fluid py-4 px-4" style={{ maxWidth: 780 }}>

        {/* ── Header ── */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <button
            className="btn btn-sm btn-outline-secondary rounded-3"
            onClick={() => navigate('/Admin/Sliders')}
          >
            <BsArrowLeft />
          </button>
          <div>
            <h4 className="fw-bold mb-0">Modifier le Slider</h4>
            <small className="text-muted">ID #{id}</small>
          </div>
        </div>

        {/* ── Alert ── */}
        {message && (
          <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-4">

            {/* ── Image ── */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <div style={{ height: 4, background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))' }} />
                <div className="card-body p-4">
                  <ImageUpload
                    preview={preview}
                    onImage={handleImage}
                    onRemove={removeImage}
                    imageFile={image}
                  />
                </div>
              </div>
            </div>

            {/* ── Champs texte ── */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4">
                <div style={{ height: 4, background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))' }} />
                <div className="card-body p-4">

                  <label className="form-label fw-semibold">
                    Titre <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="titre"
                    className="form-control rounded-3 mb-3"
                    placeholder="Ex: FAKOZE, Nos Actions..."
                    value={form.titre}
                    onChange={handleChange}
                    required
                  />

                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    name="description"
                    className="form-control rounded-3"
                    placeholder="Courte description affichée sous le titre..."
                    rows={5}
                    value={form.description}
                    onChange={handleChange}
                  />

                  <small className="text-muted d-block mt-1" style={{ fontSize: '0.75rem' }}>
                    Ce texte apparaîtra en bas du slide dans le carousel.
                  </small>

                </div>
              </div>

              {/* ── Boutons ── */}
              <div className="d-flex gap-2 mt-3">
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
                  onClick={() => navigate('/Admin/Sliders')}
                  disabled={saving}
                >
                  Annuler
                </button>
              </div>

            </div>
          </div>
        </form>

      </div>
    </AdminLayout>
  )
}

export default EditSlide