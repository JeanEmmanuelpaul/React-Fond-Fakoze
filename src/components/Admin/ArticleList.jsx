import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminLayout from './common/AdminLayout' 

const ArticleList = () => {
  const navigate = useNavigate()

  const [articles, setArticles]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [deleting, setDeleting]   = useState(null)
  const [message, setMessage]     = useState(null)
  const [search, setSearch]       = useState('')
  const [filterCat, setFilterCat] = useState('')

  // ── Chargement ──
  const fetchArticles = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}Article`)
      setArticles(res.data.Article || res.data || [])
    } catch (error) {
      console.error('Erreur:', error)
      setMessage({ type: 'danger', text: 'Impossible de charger les articles.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchArticles() }, [])

  // ── Suppression ──
  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet article ?')) return
    setDeleting(id)
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}Articles/${id}`)
      setArticles(prev => prev.filter(a => a.id !== id))
      setMessage({ type: 'success', text: 'Article supprimé avec succès.' })
    } catch (error) {
      console.error('Erreur suppression:', error)
      setMessage({ type: 'danger', text: 'Erreur lors de la suppression.' })
    } finally {
      setDeleting(null)
    }
  }
   const url = (path) => path ? `${import.meta.env.VITE_BACKEND_URL_IMAGES}${path}` : null
  // ── Filtres ──
  const categories = [...new Set(articles.map(a => a.categorie).filter(Boolean))]

  const filtered = articles.filter(a => {
    const matchSearch = a.titre?.toLowerCase().includes(search.toLowerCase()) ||
                        a.auteur?.toLowerCase().includes(search.toLowerCase())
    const matchCat    = filterCat ? a.categorie === filterCat : true
    return matchSearch && matchCat
  })

  // ── Loader ──
  if (loading) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" />
            <p className="text-muted">Chargement des articles...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
        <div className='container py-5'>
      <div className="container-fluid py-5 px-3">

        {/* ── Header ── */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-semibold mb-0">Articles</h4>
            <small className="text-muted">{filtered.length} article(s) trouvé(s)</small>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/Admin/Actualitead')}
          >
            + Nouvel article
          </button>
        </div>

        {/* ── Alert ── */}
        {message && (
          <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage(null)} />
          </div>
        )}

        {/* ── Filtres ── */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Rechercher par titre ou auteur..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filterCat}
                  onChange={e => setFilterCat(e.target.value)}
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-1">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => { setSearch(''); setFilterCat('') }}
                  title="Réinitialiser"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted fs-5">Aucun article trouvé.</p>
            <button className="btn btn-primary" onClick={() => navigate('/Admin/Actualitead')}>
              Créer le premier article
            </button>
          </div>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th style={{ width: '80px' }}>Image</th>
                    <th>Titre</th>
                    <th>Catégorie</th>
                    <th>Auteur</th>
                    <th>Lieu</th>
                    <th>Date</th>
                    <th className="text-center" style={{ width: '140px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(article => (
                    <tr key={article.id}>

                      {/* ID */}
                      <td className="text-muted small">#{article.id}</td>

                      {/* Image */}
                      <td>
                        {article.image ?
                         (
                          <img
                            src= {url(article.image)}
                            alt={article.titre}
                            className="rounded"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            onError={e => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                        ) : null}
                       
                      </td>

                      {/* Titre */}
                      <td>
                        <p className="fw-semibold mb-0" style={{ maxWidth: '220px' }}>
                          {article.titre}
                        </p>
                        {article.resume && (
                          <small className="text-muted text-truncate d-block" style={{ maxWidth: '220px' }}>
                            {article.resume}
                          </small>
                        )}
                      </td>

                      {/* Catégorie */}
                      <td>
                        {article.categorie ? (
                          <span className="badge bg-primary bg-opacity-10 text-primary fw-normal px-2 py-1">
                            {article.categorie}
                          </span>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>

                      {/* Auteur */}
                      <td className="small">{article.auteur || '—'}</td>

                      {/* Lieu */}
                      <td className="small text-muted">{article.lieu || '—'}</td>

                      {/* Date */}
                      <td className="small text-muted">
                        {article.created_at
                          ? new Date(article.created_at).toLocaleDateString('fr-FR', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })
                          : '—'}
                      </td>

                      {/* Actions */}
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => navigate(`/Admin/EditArticle/${article.id}`)}
                            title="Modifier"
                          >
                            Modifier
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(article.id)}
                            disabled={deleting === article.id}
                            title="Supprimer"
                          >
                            {deleting === article.id
                              ? <span className="spinner-border spinner-border-sm" />
                              : 'Suprimer'}
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div> </div>
    </AdminLayout>
  )
}

export default ArticleList