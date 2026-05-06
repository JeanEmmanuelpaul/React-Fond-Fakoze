import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BsPencilFill, BsTrashFill } from "react-icons/bs";
import axios from 'axios'
import AdminLayout from './common/AdminLayout'

const User = () => {
  const navigate = useNavigate()

  const [users,    setUsers]    = useState([])
  const [fetching, setFetching] = useState(true)
  const [message,  setMessage]  = useState(null)
  const [search,   setSearch]   = useState('')
  const [deleting, setDeleting] = useState(null)   // id en cours de suppression

  // ── Charger les utilisateurs ──
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      })
      setUsers(res.data.users || res.data)
    } catch (error) {
      setMessage({ type: 'danger', text: "Impossible de charger les utilisateurs." })
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  // ── Supprimer un utilisateur ──
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer l'utilisateur "${name}" ? Cette action est irréversible.`)) return
    setDeleting(id)
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      })
      setUsers(prev => prev.filter(u => u.id !== id))
      setMessage({ type: 'success', text: `Utilisateur "${name}" supprimé.` })
    } catch {
      setMessage({ type: 'danger', text: "Erreur lors de la suppression." })
    } finally {
      setDeleting(null)
    }
  }

  // ── Couleurs par rôle ──
  const roleStyle = (role) => {
    const map = {
      admin:    { bg: '#EEEDFE', text: '#534AB7' },
      membre:   { bg: '#E6F1FB', text: '#185FA5' },
      bénévole: { bg: '#E1F5EE', text: '#0F6E56' },
      donateur: { bg: '#FBEAF0', text: '#993556' },
    }
    return map[role?.toLowerCase()] ?? { bg: '#F1F3F5', text: '#555' }
  }

  // ── Initiales avatar ──
  const initiales = (u) => {
    const f = u.firstname?.[0] ?? ''
    const l = u.lastname?.[0]  ?? ''
    return (f + l).toUpperCase() || '?'
  }

  // ── Filtrage search ──
  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return (
      u.firstname?.toLowerCase().includes(q) ||
      u.lastname?.toLowerCase().includes(q)  ||
      u.email?.toLowerCase().includes(q)     ||
      u.role?.toLowerCase().includes(q)
    )
  })

  return (
    <AdminLayout>
      <div className='py-3'></div>
      <div className="container py-5">

        {/* ── Header ── */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <h4 className="fw-bold mb-0">Utilisateurs</h4>
            <small className="text-muted">{users.length} compte{users.length > 1 ? 's' : ''} enregistré{users.length > 1 ? 's' : ''}</small>
          </div>
          <button
            className="btn btn-primary fw-semibold px-4"
            style={{ borderRadius: 10 }}
            onClick={() => navigate('/Admin/AddUser')}
          >
            + Ajouter
          </button>
        </div>

        {/* ── Alert ── */}
        {message && (
          <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage(null)} />
          </div>
        )}

        <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="card-body p-4">

            {/* ── Barre recherche ── */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div>
                <p className="fw-semibold mb-0" style={{ fontSize: 14 }}>Liste des membres</p>
                <p className="text-muted mb-0" style={{ fontSize: 11 }}>Données en temps réel</p>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ maxWidth: 220, borderRadius: 10, fontSize: 13 }}
              />
            </div>

            {/* ── Loader ── */}
            {fetching ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-2" role="status" />
                <p className="text-muted small">Chargement...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <div style={{ fontSize: 40 }}>👤</div>
                <p className="mt-2">Aucun utilisateur trouvé.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                      <th className="text-muted fw-semibold" style={{ fontSize: 11 }}>#</th>
                      <th className="text-muted fw-semibold" style={{ fontSize: 11 }}>Membre</th>
                      <th className="text-muted fw-semibold" style={{ fontSize: 11 }}>Email</th>
                      <th className="text-muted fw-semibold" style={{ fontSize: 11 }}>Rôle</th>
                      <th className="text-muted fw-semibold" style={{ fontSize: 11 }}>Téléphone</th>
                      <th className="text-muted fw-semibold" style={{ fontSize: 11 }}>Statut</th>
                      <th className="text-muted fw-semibold" style={{ fontSize: 11 }}>Inscrit le</th>
                      <th className="text-muted fw-semibold text-center" style={{ fontSize: 11 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u) => {
                      const rs = roleStyle(u.role)
                      return (
                        <tr key={u.id} style={{ borderBottom: '1px solid #f8f8f8' }}>

                          {/* ID */}
                          <td className="text-muted">{u.id}</td>

                          {/* Membre */}
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {u.avatar ? (
                                <img
                                  src={u.avatar}
                                  alt={initiales(u)}
                                  className="rounded-circle"
                                  style={{ width: 34, height: 34, objectFit: 'cover' }}
                                  onError={e => {
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'flex'
                                  }}
                                />
                              ) : null}
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                style={{
                                  width: 34, height: 34, fontSize: 12,
                                  background: rs.bg, color: rs.text,
                                  display: u.avatar ? 'none' : 'flex',
                                  flexShrink: 0,
                                }}
                              >
                                {initiales(u)}
                              </div>
                              <div>
                                <div className="fw-semibold" style={{ lineHeight: 1.2 }}>
                                  {u.firstname} {u.lastname}
                                </div>
                                {u.adresse && (
                                  <div className="text-muted" style={{ fontSize: 11 }}>{u.adresse}</div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="text-muted" style={{ maxWidth: 180 }}>
                            <span className="text-truncate d-block">{u.email}</span>
                          </td>

                          {/* Rôle */}
                          <td>
                            <span
                              className="badge rounded-pill"
                              style={{ background: rs.bg, color: rs.text, fontSize: 11, fontWeight: 500 }}
                            >
                              {u.role ?? 'membre'}
                            </span>
                          </td>

                          {/* Téléphone */}
                          <td className="text-muted">{u.numero ?? '—'}</td>

                          {/* Statut */}
                          <td>
                            <span
                              className="badge rounded-pill"
                              style={{
                                fontSize: 11, fontWeight: 500,
                                background: u.status === 'actif' ? '#EAF3DE' : '#F1EFE8',
                                color:      u.status === 'actif' ? '#3B6D11' : '#888',
                              }}
                            >
                              {u.status === 'actif' ? '● Actif' : '○ Inactif'}
                            </span>
                          </td>

                          {/* Date inscription */}
                          <td className="text-muted">
                            {u.created_at
                              ? new Date(u.created_at).toLocaleDateString('fr-FR')
                              : '—'}
                          </td>

                          {/* Actions */}
                      <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-sm btn-outline-warning"
                          style={{ borderRadius: 8, fontSize: 12 }}
                          onClick={() => navigate(`/Admin/EditUser/${u.id}`)}
                          title="Modifier"
                        >
                          <BsPencilFill size={13} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          style={{ borderRadius: 8, fontSize: 12 }}
                          onClick={() => handleDelete(u.id, `${u.firstname} ${u.lastname}`)}
                          disabled={deleting === u.id}
                          title="Supprimer"
                        >
                          {deleting === u.id
                            ? <span className="spinner-border spinner-border-sm" />
                            : <BsTrashFill size={13} />}
                        </button>
                      </div>
                    </td>

                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default User