import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from './common/AdminLayout'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE      = 5 * 1024 * 1024

const IMAGE_SLOTS = [
  { key: 'image1',  label: 'Image 1' },
  { key: 'image2',  label: 'Image 2' },
  { key: 'image3',  label: 'Image 3' },
  { key: 'image4',  label: 'Image 4' },
  { key: 'image5',  label: 'Image 5' },
  { key: 'image6',  label: 'Image 6' },
  { key: 'image7',  label: 'Image 7' },
  { key: 'image8',  label: 'Image 8' },
  { key: 'image9',  label: 'Image 9' },
  { key: 'image10', label: 'Image 10' },
]

const emptySlot = () => ({
  file: null, preview: null, path: '', uploading: false, error: null,
})

const AddGalerie = () => {
  const [form, setForm] = useState({
    titre:       '',
    description: '',
    article_id:  '',   // ← ID de l'article sélectionné
  })

  const [articles, setArticles]   = useState([])   // ← liste des articles
  const [loadingArticles, setLoadingArticles] = useState(true)

  const [slots, setSlots] = useState(
    Object.fromEntries(IMAGE_SLOTS.map(s => [s.key, emptySlot()]))
  )
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const fileRefs = useRef(
    Object.fromEntries(IMAGE_SLOTS.map(s => [s.key, React.createRef()]))
  )

  // ── Charger la liste des articles ─────────────────────────────────────────
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}Article`)
        // Laravel retourne { Article: [...] }
        const data = res.data?.Article ?? res.data?.data ?? res.data
        setArticles(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Erreur chargement articles:', err)
      } finally {
        setLoadingArticles(false)
      }
    }
    fetchArticles()
  }, [])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const updateSlot = (key, patch) => {
    setSlots(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }))
  }

  const handleImageChange = async (key, e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      updateSlot(key, { error: 'Format non supporté (JPG, PNG, WEBP, GIF).' })
      return
    }
    if (file.size > MAX_SIZE) {
      updateSlot(key, { error: 'Taille max : 5 Mo.' })
      return
    }

    updateSlot(key, { file, preview: URL.createObjectURL(file), path: '', error: null, uploading: true })

    try {
      const imgData = new FormData()
      imgData.append('image', file)
      const res  = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}upload-image`,
        imgData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      const path = res.data.path || res.data.image || ''
      updateSlot(key, { path, uploading: false })
    } catch {
      updateSlot(key, { uploading: false, error: "Échec de l'upload.", file: null, preview: null })
    }
  }

  const handleRemove = (key) => {
    updateSlot(key, emptySlot())
    if (fileRefs.current[key]?.current) fileRefs.current[key].current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.article_id) {
      setMessage({ type: 'warning', text: 'Veuillez sélectionner un article.' })
      return
    }

    const anyUploading = Object.values(slots).some(s => s.uploading)
    if (anyUploading) {
      setMessage({ type: 'warning', text: 'Veuillez attendre la fin des uploads.' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const payload = {
        ...form,
        article_id: parseInt(form.article_id),
        ...Object.fromEntries(IMAGE_SLOTS.map(s => [s.key, slots[s.key].path || null])),
      }

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}galeries`, payload)
      setMessage({ type: 'success', text: 'Galerie ajoutée avec succès !' })

      setForm({ titre: '', description: '', article_id: '' })
      setSlots(Object.fromEntries(IMAGE_SLOTS.map(s => [s.key, emptySlot()])))

    } catch (error) {
      console.error(error)
      const msg = error?.response?.data?.message || 'Une erreur est survenue.'
      setMessage({ type: 'danger', text: msg })
    } finally {
      setLoading(false)
    }
  }

  const uploadedCount = Object.values(slots).filter(s => s.path).length
  const anyUploading  = Object.values(slots).some(s => s.uploading)

  return (
    <AdminLayout>
      <div className="container py-5 px-4">
        <div className="container-fluid py-4">

          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h4 className="fw-semibold mb-1">Nouvelle galerie</h4>
              <p className="text-muted small mb-0">
                Sélectionnez un article et ajoutez jusqu'à 10 images (toutes optionnelles).
              </p>
            </div>
            {uploadedCount > 0 && (
              <span className="badge bg-success fs-6 px-3 py-2">
                {uploadedCount} / {IMAGE_SLOTS.length} image{uploadedCount > 1 ? 's' : ''} uploadée{uploadedCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {message && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage(null)} />
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ── Informations générales ── */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h6 className="text-muted text-uppercase small fw-semibold mb-3">
                  Informations générales
                </h6>

                {/* Titre */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Titre <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text" className="form-control" name="titre"
                    value={form.titre} onChange={handleChange}
                    placeholder="Titre de la galerie..." required
                  />
                </div>

                {/* Sélection article + Description */}
                <div className="row g-3">
                  <div className="col-md-5">
                    <label className="form-label fw-semibold">
                      Article lié <span className="text-danger">*</span>
                    </label>

                    {loadingArticles ? (
                      <div className="form-control d-flex align-items-center gap-2 text-muted">
                        <span className="spinner-border spinner-border-sm" />
                        Chargement des articles...
                      </div>
                    ) : (
                      <select
                        className="form-select"
                        name="article_id"
                        value={form.article_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- Sélectionner un article --</option>
                        {articles.map(article => (
                          <option key={article.id} value={article.id}>
                            #{article.id} — {article.titre}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Aperçu article sélectionné */}
                    {form.article_id && (() => {
                      const selected = articles.find(a => a.id == form.article_id)
                      return selected ? (
                        <div className="mt-2 p-2 bg-light rounded-3 d-flex align-items-center gap-2">
                          {selected.image && (
                            <img
                              src={`${import.meta.env.VITE_BACKEND_URL_IMAGES}${selected.image}`}
                              alt={selected.titre}
                              style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }}
                              onError={e => e.target.style.display = 'none'}
                            />
                          )}
                          <div>
                            <div className="fw-semibold small">{selected.titre}</div>
                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                              {selected.categorie || 'Sans catégorie'} · ID #{selected.id}
                            </div>
                          </div>
                        </div>
                      ) : null
                    })()}
                  </div>

                  <div className="col-md-7">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control" name="description"
                      value={form.description} onChange={handleChange}
                      rows={3} placeholder="Description de la galerie..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Grille 10 images ── */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="text-muted text-uppercase small fw-semibold mb-0">
                    Images <span className="text-muted fw-normal">(toutes optionnelles)</span>
                  </h6>
                  <span className="badge bg-light text-muted border">
                    JPG · PNG · WEBP · GIF — 5 Mo max
                  </span>
                </div>

                <div className="row g-3">
                  {IMAGE_SLOTS.map(slot => {
                    const s = slots[slot.key]
                    return (
                      <div className="col-6 col-md-4 col-lg-3 col-xl-2" key={slot.key}>
                        <div className="border rounded-3 overflow-hidden" style={{ background: '#f8fafc' }}>

                          <div
                            style={{ height: 120, cursor: 'pointer', position: 'relative' }}
                            onClick={() => !s.uploading && fileRefs.current[slot.key]?.current?.click()}
                          >
                            {s.preview ? (
                              <img src={s.preview} alt={slot.label}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                                <span style={{ fontSize: 28 }}>🖼️</span>
                                <small style={{ fontSize: '0.7rem' }}>{slot.label}</small>
                              </div>
                            )}

                            {s.uploading && (
                              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                                style={{ background: 'rgba(255,255,255,0.75)' }}>
                                <div className="spinner-border text-primary spinner-border-sm" />
                              </div>
                            )}

                            {s.path && !s.uploading && (
                              <span className="position-absolute top-0 end-0 m-1 badge bg-success"
                                style={{ fontSize: '0.65rem' }}>✓</span>
                            )}
                          </div>

                          <div className="px-2 py-1 border-top d-flex align-items-center justify-content-between"
                            style={{ background: '#fff', minHeight: 32 }}>
                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>{slot.label}</small>
                            {s.file && (
                              <button type="button" className="btn btn-link btn-sm text-danger p-0"
                                style={{ fontSize: '0.7rem' }}
                                onClick={() => handleRemove(slot.key)} disabled={s.uploading}>
                                ✕
                              </button>
                            )}
                          </div>

                          {s.error && (
                            <div className="px-2 py-1 bg-danger-subtle">
                              <small className="text-danger" style={{ fontSize: '0.65rem' }}>{s.error}</small>
                            </div>
                          )}

                          <input ref={fileRefs.current[slot.key]} type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif" className="d-none"
                            onChange={(e) => handleImageChange(slot.key, e)} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary"
                onClick={() => window.history.back()}>Annuler</button>
              <button type="submit" className="btn btn-primary px-4"
                disabled={loading || anyUploading}>
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Enregistrement...</>
                ) : anyUploading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Upload en cours...</>
                ) : 'Enregistrer la galerie'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AddGalerie