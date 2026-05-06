import React, { useState, useRef } from 'react'
import axios from 'axios'
import AdminLayout from './common/AdminLayout'

const Actualitead = () => {
  const [form, setForm] = useState({
    titre: '',
    lieu: '',
    description1: '',
    description2: '',
    description3: '',
    sou_description1: '',
    sou_description2: '',
    resume: '',
    resumearticle: '',
    categorie: '',
    auteur: '',
  })

  const [imageFile, setImageFile]       = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imagePath, setImagePath]       = useState('')      // ← chemin retourné par Laravel ex: Articles/xxx.jpg
  const [uploading, setUploading]       = useState(false)   // ← spinner upload séparé
  const [loading, setLoading]           = useState(false)
  const [message, setMessage]           = useState(null)
  const fileInputRef                    = useRef(null)

  // ── Champs texte ──────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // ── Sélection + upload immédiat de l'image ────────────────────────────────
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validation type
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      setMessage({ type: 'warning', text: 'Format non supporté. Utilisez JPG, PNG, WEBP ou GIF.' })
      return
    }

    // Validation taille (5 Mo max)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'warning', text: "L'image ne doit pas dépasser 5 Mo." })
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setImagePath('')
    setMessage(null)

    // ── Étape 1 : upload de l'image vers Laravel ──────────────────────────
    // Laravel stocke le fichier et retourne le chemin : "Articles/xxx.jpg"
    try {
      setUploading(true)
      const imgData = new FormData()
      imgData.append('image', file)

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}upload-image`,   // ← endpoint dédié Laravel
        imgData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      // Laravel doit retourner { path: "Articles/WpDAw1N8kx4z...jpg" }
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
      // ── Étape 2 : envoyer le formulaire JSON avec le chemin image ─────────
      const payload = {
        ...form,
        image: imagePath,   // ← "Articles/WpDAw1N8kx4z...jpg"
      }

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}Article`, payload)

      setMessage({ type: 'success', text: 'Article publié avec succès !' })

      // Reset formulaire
      setForm({
        titre: '', lieu: '',
        description1: '', description2: '', description3: '',
        sou_description1: '', sou_description2: '',
        resume: '', resumearticle: '', categorie: '', auteur: '',
      })
      handleRemoveImage()

    } catch (error) {
      console.error('Erreur API:', error)
      const msg = error?.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
      setMessage({ type: 'danger', text: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className='container py-5'>
        <div className="container-fluid py-5">
          <h4 className="mb-4 fw-semibold">Nouvel article</h4>

          {message && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage(null)} />
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">

            {/* ── Informations principales ── */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted text-uppercase small fw-semibold mb-3">
                  Informations principales
                </h6>

                <div className="mb-3">
                  <label className="form-label">Titre <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="titre"
                    value={form.titre}
                    onChange={handleChange}
                    placeholder="Titre de l'article"
                    required
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Catégorie</label>
                    <select
                      className="form-select"
                      name="categorie"
                      value={form.categorie}
                      onChange={handleChange}
                    >
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
                      type="text"
                      className="form-control"
                      name="lieu"
                      value={form.lieu}
                      onChange={handleChange}
                      placeholder="Ex: Port-au-Prince"
                    />
                  </div>
                </div>

                <div className="mb-0">
                  <label className="form-label">Auteur</label>
                  <input
                    type="text"
                    className="form-control"
                    name="auteur"
                    value={form.auteur}
                    onChange={handleChange}
                    placeholder="Nom de l'auteur"
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

                {/* Zone de drop / sélection */}
                <div
                  className="border rounded-3 p-3 text-center mb-3"
                  style={{ borderStyle: 'dashed', cursor: 'pointer', background: '#f8fafc' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="img-fluid rounded-3"
                      style={{ maxHeight: 220, objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="py-3 text-muted">
                      <div style={{ fontSize: 40 }}>🖼️</div>
                      <p className="mb-1 fw-semibold">Cliquer pour sélectionner une image</p>
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
                      {/* État upload */}
                      {uploading && (
                        <span className="text-primary small d-flex align-items-center gap-1">
                          <span className="spinner-border spinner-border-sm" /> Upload en cours...
                        </span>
                      )}
                      {/* Chemin retourné par Laravel */}
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
                      Supprimer
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
                  <textarea
                    className="form-control"
                    name="resume"
                    value={form.resume}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Résumé en quelques mots..."
                  />
                </div>

                <div className="mb-0">
                  <label className="form-label">Résumé article</label>
                  <textarea
                    className="form-control"
                    name="resumearticle"
                    value={form.resumearticle}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Résumé complet de l'article..."
                  />
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
                    <textarea
                      className="form-control"
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      rows={4}
                      placeholder={`Contenu de la description ${i + 1}...`}
                    />
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
                      <textarea
                        className="form-control"
                        name={field}
                        value={form[field]}
                        onChange={handleChange}
                        rows={4}
                        placeholder={`Sous-description ${i + 1}...`}
                      />
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
                onClick={() => window.history.back()}
              >
                Annuler
              </button>

              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={loading || uploading || (imageFile && !imagePath)}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Publication...</>
                ) : (
                  "Publier l'article"
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Actualitead