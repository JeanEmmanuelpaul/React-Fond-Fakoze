import React, { useState } from 'react'
import AdminLayout from './common/AdminLayout'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { BsImage, BsPlus, BsArrowLeft } from 'react-icons/bs'

const AddSlide = () => {
  const navigate = useNavigate()

  const [form,      setForm]      = useState({ titre: '', description: '' })
  const [image,     setImage]     = useState(null)
  const [preview,   setPreview]   = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [message,   setMessage]   = useState(null)

  // ── Champs texte ───────────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // ── Sélection image ────────────────────────────────────────────────────
  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  // ── Drag & Drop ────────────────────────────────────────────────────────
  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.titre) {
      setMessage({ type: 'warning', text: 'Le titre est obligatoire.' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('titre',       form.titre)
      formData.append('description', form.description)
      if (image) formData.append('image', image)

      const token = JSON.parse(localStorage.getItem('adminInfo'))?.token

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}sliders`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          }
        }
      )

      setMessage({ type: 'success', text: 'Slider ajouté avec succès !' })
      setTimeout(() => navigate('/Admin/Sliders'), 1200)

    } catch (error) {
      console.error(error)
      const errors = error.response?.data?.errors
      if (errors) {
        const first = Object.values(errors)[0][0]
        setMessage({ type: 'danger', text: first })
      } else {
        setMessage({ type: 'danger', text: 'Erreur serveur.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
        <div className='py-4'> </div>
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
            <h4 className="fw-bold mb-0">Nouveau Slider</h4>
            <small className="text-muted">Ajouter un slide au carousel</small>
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

            {/* ── Colonne gauche — Image ── */}
            <div className="col-lg-5">
              <div
                className="card border-0 shadow-sm rounded-4 overflow-hidden"
                style={{ height: '100%' }}
              >
                <div style={{ height: 4, background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))' }} />
                <div className="card-body p-4">

                  <label className="form-label fw-semibold mb-3">
                    <BsImage className="me-2" />Image du slide
                  </label>

                  {/* Zone Drag & Drop */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => document.getElementById('imageInput').click()}
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
                      <>
                        <img
                          src={preview}
                          alt="preview"
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                        {/* Overlay modifier */}
                        <div
                          className="position-absolute inset-0 d-flex align-items-center justify-content-center"
                          style={{
                            inset: 0,
                            background: 'rgba(0,0,0,0.35)',
                            opacity: 0,
                            transition: '0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = 1}
                          onMouseLeave={e => e.currentTarget.style.opacity = 0}
                        >
                          <span className="text-white fw-semibold small">Changer l'image</span>
                        </div>
                      </>
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

                  {/* Input caché */}
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImage}
                  />

                  {/* Nom du fichier */}
                  {image && (
                    <div className="mt-2 d-flex align-items-center justify-content-between">
                      <small className="text-muted text-truncate" style={{ maxWidth: 180 }}>
                        {image.name}
                      </small>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger rounded-3"
                        style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                        onClick={() => { setImage(null); setPreview(null) }}
                      >
                        Retirer
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* ── Colonne droite — Champs ── */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4">
                <div style={{ height: 4, background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))' }} />
                <div className="card-body p-4">

                  <label className="form-label fw-semibold">Titre <span className="text-danger">*</span></label>
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
                  disabled={loading}
                  style={{
                    background: 'var(--primary-color)',
                    color: '#fff',
                    border: 'none',
                  }}
                >
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2" />Enregistrement...</>
                    : <><BsPlus size={18} className="me-1" />Ajouter le slider</>
                  }
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-3 px-4"
                  onClick={() => navigate('/Admin/Sliders')}
                  disabled={loading}
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

export default AddSlide