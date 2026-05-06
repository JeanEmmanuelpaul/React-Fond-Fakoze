import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminLayout from './common/AdminLayout'

const EditEvenement = () => {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    titre:       '',
    lieu:        '',
    date:        '',
    description: '',
    statut:      'planifié',
    capacite:    '',
  })

  const [imageFile, setImageFile]       = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imagePath, setImagePath]       = useState('')
  const [uploading, setUploading]       = useState(false)
  const [loading, setLoading]           = useState(false)
  const [fetching, setFetching]         = useState(true)
  const [message, setMessage]           = useState(null)
  const fileInputRef                    = useRef(null)

  // ── Charger l'événement existant ──────────────────────────────────────────
  useEffect(() => {
    const fetchEvenement = async () => {
      try {
        const res  = await axios.get(`${import.meta.env.VITE_BACKEND_URL}evenements/${id}`)
        const data = res.data.event || res.data.evenement || res.data

        const formatDateLocal = (dateStr) => {
          if (!dateStr) return ''
          return new Date(dateStr).toISOString().slice(0, 16)
        }

        setForm({
          titre:       data.titre       || '',
          lieu:        data.lieu        || '',
          date:        formatDateLocal(data.date),
          description: data.description || '',
          statut:      data.statut      || 'planifié',
          capacite:    data.capacite    || '',
        })
        // ← Pré-remplir le chemin image existant
        setImagePath(data.image || '')
      } catch (error) {
        console.error('Erreur chargement événement :', error)
        setMessage({ type: 'danger', text: "Impossible de charger l'événement." })
      } finally {
        setFetching(false)
      }
    }
    fetchEvenement()
  }, [id])

  // ── Champs texte ──────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // ── Sélection + upload immédiat de l'image ────────────────────────────────
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      setMessage({ type: 'warning', text: 'Format non supporté. Utilisez JPG, PNG, WEBP ou GIF.' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'warning', text: "L'image ne doit pas dépasser 5 Mo." })
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setImagePath('')
    setMessage(null)

    try {
      setUploading(true)
      const imgData = new FormData()
      imgData.append('image', file)

      const res  = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}upload-image-event`,
        imgData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      const path = res.data.path || res.data.image || ''
      setImagePath(path)
      setMessage({ type: 'success', text: `Image uploadée : ${path}` })
    } catch (err) {
      console.error('Erreur upload image:', err)
      setMessage({ type: 'danger', text: "Échec de l'upload de l'image." })
      setImageFile(null)
      setImagePreview(null)
    } finally {
      setUploading(false)
    }
  }

  // ── Suppression image sélectionnée ────────────────────────────────────────
  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImagePath('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Soumission ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const payload = {
        ...form,
        image: imagePath,   // chemin existant ou nouveau "Evenements/xxx.jpg"
      }

      await axios.put(`${import.meta.env.VITE_BACKEND_URL}evenements/${id}`, payload)
      setMessage({ type: 'success', text: 'Événement mis à jour avec succès !' })
      setTimeout(() => navigate('/Admin/EventList'), 1500)

    } catch (error) {
      console.error('Erreur update :', error)
      const errors = error.response?.data?.errors
      if (errors) {
        setMessage({ type: 'danger', text: Object.values(errors)[0][0] })
      } else {
        setMessage({ type: 'danger', text: 'Une erreur est survenue.' })
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Loader ────────────────────────────────────────────────────────────────
  if (fetching) return (
    <AdminLayout>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" />
          <p className="text-muted">Chargement de l'événement...</p>
        </div>
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div className="container py-5 px-4">
        <div className="container-fluid py-5">

          {/* Header */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
              ← Retour
            </button>
            <h4 className="mb-0 fw-semibold">Modifier l'événement #{id}</h4>
          </div>

          {/* Alert */}
          {message && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage(null)} />
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ── Informations principales ── */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h6 className="text-muted text-uppercase small fw-semibold mb-3">
                  Informations principales
                </h6>

                <div className="mb-3">
                  <label className="form-label">Titre <span className="text-danger">*</span></label>
                  <input
                    type="text" className="form-control" name="titre"
                    value={form.titre} onChange={handleChange}
                    placeholder="Titre de l'événement" required
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Statut</label>
                    <select className="form-select" name="statut" value={form.statut} onChange={handleChange}>
                      <option value="planifié">Planifié</option>
                      <option value="en_cours">En cours</option>
                      <option value="terminé">Terminé</option>
                      <option value="annulé">Annulé</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Lieu</label>
                    <input
                      type="text" className="form-control" name="lieu"
                      value={form.lieu} onChange={handleChange}
                      placeholder="Ex : Port-au-Prince"
                    />
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Date <span className="text-danger">*</span></label>
                    <input
                      type="datetime-local" className="form-control" name="date"
                      value={form.date} onChange={handleChange} required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Capacité (places)</label>
                    <input
                      type="number" className="form-control" name="capacite"
                      value={form.capacite} onChange={handleChange}
                      placeholder="Ex : 200" min="1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Description ── */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h6 className="text-muted text-uppercase small fw-semibold mb-3">Description</h6>
                <textarea
                  className="form-control" name="description"
                  value={form.description} onChange={handleChange}
                  rows={5} placeholder="Décrivez l'événement en détail..."
                />
              </div>
            </div>

            {/* ── Image (upload fichier) ── */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h6 className="text-muted text-uppercase small fw-semibold mb-3">
                  Image de l'événement
                </h6>

                {/* Image actuelle si pas de nouveau fichier choisi */}
                {!imageFile && imagePath && (
                  <div className="mb-3">
                    <label className="form-label text-muted small">Image actuelle</label>
                    <div className="position-relative d-inline-block w-100">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL_IMAGES}${imagePath}`}
                        alt="Image actuelle"
                        className="img-fluid rounded-3 w-100"
                        style={{ maxHeight: 220, objectFit: 'cover' }}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <span className="badge bg-secondary position-absolute top-0 start-0 m-2">
                        Image actuelle
                      </span>
                    </div>
                  </div>
                )}

                {/* Zone cliquable */}
                <div
                  className="border rounded-3 p-3 text-center mb-3"
                  style={{ borderStyle: 'dashed', cursor: 'pointer', background: '#f8fafc' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview} alt="Aperçu"
                      className="img-fluid rounded-3"
                      style={{ maxHeight: 220, objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="py-3 text-muted">
                      <div style={{ fontSize: 40 }}>🖼️</div>
                      <p className="mb-1 fw-semibold">
                        {imagePath ? "Cliquer pour changer l'image" : "Cliquer pour sélectionner une image"}
                      </p>
                      <small>JPG, PNG, WEBP ou GIF — 5 Mo max</small>
                    </div>
                  )}
                </div>

                {/* Input caché */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="d-none"
                  onChange={handleImageChange}
                />

                {/* Infos + état upload */}
                {imageFile && (
                  <div className="d-flex align-items-center justify-content-between bg-light rounded-3 px-3 py-2">
                    <div className="d-flex flex-column gap-1">
                      <div>
                        <span className="fw-semibold small">{imageFile.name}</span>
                        <span className="text-muted small ms-2">
                          ({(imageFile.size / 1024).toFixed(0)} Ko)
                        </span>
                      </div>
                      {uploading && (
                        <span className="text-primary small d-flex align-items-center gap-1">
                          <span className="spinner-border spinner-border-sm" /> Upload en cours...
                        </span>
                      )}
                      {!uploading && imagePath && (
                        <span className="text-success small">
                          ✅ <code>{imagePath}</code>
                        </span>
                      )}
                      {!uploading && !imagePath && (
                        <span className="text-danger small">❌ Échec upload image</span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={handleRemoveImage}
                      disabled={uploading}
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-warning px-4 fw-semibold"
                disabled={loading || uploading || (imageFile && !imagePath)}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Mise à jour...</>
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

export default EditEvenement