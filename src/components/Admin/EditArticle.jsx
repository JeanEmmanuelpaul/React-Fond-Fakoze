import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminLayout from './common/AdminLayout'

const EditArticle = () => {
  const { id }     = useParams()
  const navigate   = useNavigate()

  const [form, setForm] = useState({
    titre:            '',
    lieu:             '',
    description1:     '',
    description2:     '',
    description3:     '',
    sou_description1: '',
    sou_description2: '',
    resume:           '',
    resumearticle:    '',
    categorie:        '',
    auteur:           '',
  })

  const [imageFile, setImageFile]       = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imagePath, setImagePath]       = useState('')     // chemin actuel (existant ou nouveau)
  const [uploading, setUploading]       = useState(false)
  const [loading, setLoading]           = useState(false)
  const [fetching, setFetching]         = useState(true)
  const [message, setMessage]           = useState(null)
  const fileInputRef                    = useRef(null)

  // ── Charger l'article existant ────────────────────────────────────────────
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res  = await axios.get(`${import.meta.env.VITE_BACKEND_URL}Article/${id}`)
        const data = res.data.Article || res.data
        setForm({
          titre:            data.titre            || '',
          lieu:             data.lieu             || '',
          description1:     data.description1     || '',
          description2:     data.description2     || '',
          description3:     data.description3     || '',
          sou_description1: data.sou_description1 || '',
          sou_description2: data.sou_description2 || '',
          resume:           data.resume           || '',
          resumearticle:    data.resumearticle    || '',
          categorie:        data.categorie        || '',
          auteur:           data.auteur           || '',
        })
        // ← Pré-remplir le chemin image existant
        setImagePath(data.image || '')
      } catch (error) {
        console.error('Erreur chargement article:', error)
        setMessage({ type: 'danger', text: "Impossible de charger l'article." })
      } finally {
        setFetching(false)
      }
    }
    fetchArticle()
  }, [id])

  // ── Champs texte ──────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
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

      const res   = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}upload-image`,
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

  // ── Suppression image sélectionnée (revient à l'image originale) ──────────
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
        image: imagePath,   // ← chemin existant ou nouveau "Articles/xxx.jpg"
      }

      await axios.put(`${import.meta.env.VITE_BACKEND_URL}Article/${id}`, payload)
      setMessage({ type: 'success', text: 'Article mis à jour avec succès !' })
      setTimeout(() => navigate('/Admin/ArticleList'), 1500)
    } catch (error) {
      console.error('Erreur update:', error)
      const errors = error.response?.data?.errors
      if (errors) {
        const first = Object.values(errors)[0][0]
        setMessage({ type: 'danger', text: first })
      } else {
        setMessage({ type: 'danger', text: 'Une erreur est survenue.' })
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Loader pendant le fetch ───────────────────────────────────────────────
  if (fetching) return (
    <AdminLayout>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" />
          <p className="text-muted">Chargement de l'article...</p>
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
            <h4 className="mb-0 fw-semibold">Modifier l'article #{id}</h4>
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
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted text-uppercase small fw-semibold mb-3">
                  Informations principales
                </h6>

                <div className="mb-3">
                  <label className="form-label">Titre <span className="text-danger">*</span></label>
                  <input
                    type="text" className="form-control" name="titre"
                    value={form.titre} onChange={handleChange}
                    placeholder="Titre de l'article" required
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Catégorie</label>
                    <select className="form-select" name="categorie" value={form.categorie} onChange={handleChange}>
                      <option value="">-- Sélectionner --</option>
                      <option value="politique">Politique</option>
                      <option value="economie">Économie</option>
                      <option value="culture">Culture</option>
                      <option value="sport">Sport</option>
                      <option value="societe">Société</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Lieu</label>
                    <input
                      type="text" className="form-control" name="lieu"
                      value={form.lieu} onChange={handleChange}
                      placeholder="Ex: Port-au-Prince"
                    />
                  </div>
                </div>

                <div className="mb-0">
                  <label className="form-label">Auteur <span className="text-danger">*</span></label>
                  <input
                    type="text" className="form-control" name="auteur"
                    value={form.auteur} onChange={handleChange}
                    placeholder="Nom de l'auteur" required
                  />
                </div>
              </div>
            </div>

            {/* ── Image (upload fichier) ── */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted text-uppercase small fw-semibold mb-3">
                  Image de l'article
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

                {/* Zone de sélection nouvelle image */}
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
                        {imagePath ? 'Cliquer pour changer l\'image' : 'Cliquer pour sélectionner une image'}
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

                {/* Infos + suppression */}
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

            {/* ── Résumés ── */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted text-uppercase small fw-semibold mb-3">Résumés</h6>
                <div className="mb-3">
                  <label className="form-label">Résumé court</label>
                  <textarea className="form-control" name="resume" value={form.resume}
                    onChange={handleChange} rows={3} placeholder="Résumé en quelques mots..." />
                </div>
                <div className="mb-0">
                  <label className="form-label">Résumé article</label>
                  <textarea className="form-control" name="resumearticle" value={form.resumearticle}
                    onChange={handleChange} rows={4} placeholder="Résumé complet de l'article..." />
                </div>
              </div>
            </div>

            {/* ── Descriptions ── */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted text-uppercase small fw-semibold mb-3">Descriptions</h6>
                {['description1', 'description2', 'description3'].map((field, i) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label">Description {i + 1}</label>
                    <textarea className="form-control" name={field} value={form[field]}
                      onChange={handleChange} rows={4}
                      placeholder={`Contenu de la description ${i + 1}...`} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Sous-descriptions ── */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted text-uppercase small fw-semibold mb-3">Sous-descriptions</h6>
                <div className="row g-3">
                  {['sou_description1', 'sou_description2'].map((field, i) => (
                    <div className="col-md-6" key={field}>
                      <label className="form-label">Sous-description {i + 1}</label>
                      <textarea className="form-control" name={field} value={form[field]}
                        onChange={handleChange} rows={4}
                        placeholder={`Sous-description ${i + 1}...`} />
                    </div>
                  ))}
                </div>
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
                  'Mettre à jour'
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default EditArticle