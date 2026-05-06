import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminLayout from './common/AdminLayout'

const EvenementList = () => {
  const navigate = useNavigate()

  const [evenements, setEvenements] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [deleting,   setDeleting]   = useState(null)
  const [message,    setMessage]    = useState(null)
  const [search,     setSearch]     = useState('')
  const [filterStat, setFilterStat] = useState('')

  // ── Chargement ──
  const fetchEvenements = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}evenements`)
      setEvenements(res.data.data || res.data.evenements || res.data || [])
    } catch (error) {
      console.error('Erreur:', error)
      setMessage({ type: 'danger', text: 'Impossible de charger les événements.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvenements() }, [])

  // ── Suppression ──
  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet événement ?')) return
    setDeleting(id)
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}evenements/${id}`)
      setEvenements(prev => prev.filter(e => e.id !== id))
      setMessage({ type: 'success', text: 'Événement supprimé avec succès.' })
    } catch (error) {
      console.error('Erreur suppression:', error)
      setMessage({ type: 'danger', text: 'Erreur lors de la suppression.' })
    } finally {
      setDeleting(null)
    }
  }

  // ── Badge statut ──
  const statutBadge = (statut) => {
    const map = {
      'planifié':  { bg: '#E6F1FB', color: '#185FA5' },
      'en_cours':  { bg: '#E1F5EE', color: '#0F6E56' },
      'terminé':   { bg: '#F1EFE8', color: '#5F5E5A' },
      'annulé':    { bg: '#FCEBEB', color: '#A32D2D' },
    }
    return map[statut] ?? { bg: '#F1EFE8', color: '#888' }
  }

  // ── Formatage date ──
  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  // ── Filtres ──
  const statuts = [...new Set(evenements.map(e => e.statut).filter(Boolean))]

  const filtered = evenements.filter(e => {
    const matchSearch = e.titre?.toLowerCase().includes(search.toLowerCase()) ||
                        e.lieu?.toLowerCase().includes(search.toLowerCase())
    const matchStat   = filterStat ? e.statut === filterStat : true
    return matchSearch && matchStat
  })

  // ── Loader ──
  if (loading) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" />
            <p className="text-muted">Chargement des événements...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="container py-5">
        <div className="container-fluid py-4 px-3">

          {/* ── Header ── */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-semibold mb-0">Événements</h4>
              <small className="text-muted">{filtered.length} événement(s) trouvé(s)</small>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/Admin/AddEvenement')}
            >
              + Nouvel événement
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
                    placeholder="🔍 Rechercher par titre ou lieu..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterStat}
                    onChange={e => setFilterStat(e.target.value)}
                  >
                    <option value="">Tous les statuts</option>
                    {statuts.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-1">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => { setSearch(''); setFilterStat('') }}
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
              <div style={{ fontSize: 48 }}>📅</div>
              <p className="text-muted fs-5 mt-2">Aucun événement trouvé.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/Admin/AddEvenement')}
              >
                Créer le premier événement
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
                      <th>Statut</th>
                      <th>Lieu</th>
                      <th>Date événement</th>
                      <th>Capacité</th>
                      <th className="text-center" style={{ width: '160px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(ev => {
                      const badge = statutBadge(ev.statut)
                      return (
                        <tr key={ev.id}>

                          {/* ID */}
                          <td className="text-muted small">#{ev.id}</td>

                          {/* Image */}
                          <td>
                            {ev.image ? (
                              <img
                                src={`${import.meta.env.VITE_BACKEND_URL_IMAGES}${ev.image}`}  
                                alt={ev.titre}
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
                              {ev.titre}
                            </p>
                            {ev.description && (
                              <small
                                className="text-muted text-truncate d-block"
                                style={{ maxWidth: '220px' }}
                              >
                                {ev.description}
                              </small>
                            )}
                          </td>

                          {/* Statut */}
                          <td>
                            <span
                              className="badge rounded-pill px-2 py-1"
                              style={{
                                background: badge.bg,
                                color: badge.color,
                                fontSize: 11,
                                fontWeight: 500,
                              }}
                            >
                              {ev.statut ?? '—'}
                            </span>
                          </td>

                          {/* Lieu */}
                          <td className="small text-muted">{ev.lieu || '—'}</td>

                          {/* Date événement */}
                          <td className="small text-muted">
                            {formatDate(ev.date)}
                          </td>

                          {/* Capacité */}
                          <td className="small text-muted">
                            {ev.capacite ? `${ev.capacite} places` : '—'}
                          </td>

                          {/* Actions */}
                          <td className="text-center">
                            <div className="d-flex gap-2 justify-content-center">
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() => navigate(`/Admin/EditEvenement/${ev.id}`)}
                                title="Modifier"
                              >
                                ✏️ Modifier
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(ev.id)}
                                disabled={deleting === ev.id}
                                title="Supprimer"
                              >
                                {deleting === ev.id
                                  ? <span className="spinner-border spinner-border-sm" />
                                  : '🗑️ Supprimer'}
                              </button>
                            </div>
                          </td>

                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  )
}

export default EvenementList