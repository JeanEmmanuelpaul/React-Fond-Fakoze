import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminLayout from './common/AdminLayout'

const EditUser = () => {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [loading,  setLoading]  = useState(false)
  const [fetching, setFetching] = useState(true)
  const [message,  setMessage]  = useState(null)

  const [form, setForm] = useState({
    firstname: '',
    lastname:  '',
    email:     '',
    numero:    '',
    adresse:   '',
    avatar:    '',
    role:      'membre',
    status:    'actif',
    password:  '',
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}users/${id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } }
        )
        const u = res.data.user || res.data
        setForm({
          firstname: u.firstname ?? '',
          lastname:  u.lastname  ?? '',
          email:     u.email     ?? '',
          numero:    u.numero    ?? '',
          adresse:   u.adresse   ?? '',
          avatar:    u.avatar    ?? '',
          role:      u.role      ?? 'membre',
          status:    u.status    ?? 'actif',
          password:  '',
        })
      } catch {
        setMessage({ type: 'danger', text: "Impossible de charger l'utilisateur." })
      } finally {
        setFetching(false)
      }
    }
    fetchUser()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const payload = { ...form }
    if (!payload.password) delete payload.password
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}users/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } }
      )
      setMessage({ type: 'success', text: 'Utilisateur mis à jour avec succès !' })
      setTimeout(() => navigate('/Admin/User'), 1500)
    } catch (error) {
      const errors = error.response?.data?.errors
      setMessage({ type: 'danger', text: errors ? Object.values(errors)[0][0] : 'Une erreur est survenue.' })
    } finally {
      setLoading(false)
    }
  }

  const initiales = `${form.firstname?.[0] ?? ''}${form.lastname?.[0] ?? ''}`.toUpperCase() || '?'
  const roleStyle = {
    admin:    { bg: '#EEEDFE', text: '#534AB7' },
    membre:   { bg: '#E6F1FB', text: '#185FA5' },
    bénévole: { bg: '#E1F5EE', text: '#0F6E56' },
    donateur: { bg: '#FBEAF0', text: '#993556' },
  }
  const rs = roleStyle[form.role] ?? { bg: '#F1F3F5', text: '#555' }

  // ── Badge "optionnel" ──
  const OptBadge = () => (
    <span className="badge ms-2" style={{
      background: '#F1F3F5', color: '#999', fontSize: 10,
      fontWeight: 500, borderRadius: 6, verticalAlign: 'middle'
    }}>
      optionnel
    </span>
  )

  if (fetching) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" />
            <p className="text-muted">Chargement de l'utilisateur...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="container py-5 px-4">
        <div className="container-fluid py-4">

          {/* ── Header ── */}
          <div className="d-flex align-items-center gap-3 mb-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
              ← Retour
            </button>
            <div>
              <h4 className="mb-0 fw-bold">Modifier l'utilisateur #{id}</h4>
              <small className="text-muted">
                <span className="text-danger fw-bold">*</span> champ obligatoire &nbsp;·&nbsp;
                <span className="badge" style={{ background: '#F1F3F5', color: '#999', fontSize: 10, borderRadius: 6 }}>optionnel</span> peut être laissé vide
              </small>
            </div>
          </div>

          <hr className="mb-4" />

          {message && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage(null)} />
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ── Aperçu + Avatar ── */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
              <div className="card-body p-4">
                <h6 className="text-muted text-uppercase small fw-semibold mb-3">Aperçu du profil</h6>

                <div className="d-flex align-items-center gap-4 flex-wrap mb-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0 overflow-hidden"
                    style={{ width: 72, height: 72, background: rs.bg, color: rs.text, fontSize: 22 }}
                  >
                    {form.avatar
                      ? <img src={form.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.target.style.display = 'none')} />
                      : initiales}
                  </div>
                  <div>
                    <p className="fw-bold mb-1" style={{ fontSize: 18 }}>{form.firstname || '—'} {form.lastname}</p>
                    <p className="text-muted mb-2" style={{ fontSize: 13 }}>{form.email || '—'}</p>
                    <span className="badge rounded-pill me-2" style={{ background: rs.bg, color: rs.text, fontSize: 11 }}>{form.role}</span>
                    <span className="badge rounded-pill" style={{
                      fontSize: 11,
                      background: form.status === 'actif' ? '#EAF3DE' : '#F1EFE8',
                      color:      form.status === 'actif' ? '#3B6D11' : '#888',
                    }}>
                      {form.status === 'actif' ? '● Actif' : '○ Inactif'}
                    </span>
                  </div>
                </div>

                {/* Avatar URL — optionnel */}
                <label className="form-label">
                  URL Avatar <OptBadge />
                </label>
                <input
                  type="text" className="form-control"
                  name="avatar" value={form.avatar}
                  onChange={handleChange}
                  placeholder="https://... — laisser vide pour afficher les initiales"
                />
              </div>
            </div>

            {/* ── Infos personnelles ── */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
              <div className="card-body p-4">
                <h6 className="text-muted text-uppercase small fw-semibold mb-3">Informations personnelles</h6>
                <div className="row g-3">

                  {/* Prénom — OBLIGATOIRE */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Prénom <span className="text-danger fw-bold">*</span>
                    </label>
                    <input type="text" className="form-control" name="firstname"
                      value={form.firstname} onChange={handleChange} required placeholder="Prénom" />
                  </div>

                  {/* Nom — OBLIGATOIRE */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Nom <span className="text-danger fw-bold">*</span>
                    </label>
                    <input type="text" className="form-control" name="lastname"
                      value={form.lastname} onChange={handleChange} required placeholder="Nom de famille" />
                  </div>

                  {/* Email — OBLIGATOIRE */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Email <span className="text-danger fw-bold">*</span>
                    </label>
                    <input type="email" className="form-control" name="email"
                      value={form.email} onChange={handleChange} required placeholder="email@exemple.com" />
                  </div>

                  {/* Téléphone — optionnel */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Téléphone <OptBadge />
                    </label>
                    <input type="text" className="form-control" name="numero"
                      value={form.numero} onChange={handleChange} placeholder="+509 ..." />
                  </div>

                  {/* Adresse — optionnel */}
                  <div className="col-12">
                    <label className="form-label">
                      Adresse <OptBadge />
                    </label>
                    <input type="text" className="form-control" name="adresse"
                      value={form.adresse} onChange={handleChange} placeholder="Ex : Port-au-Prince, Haïti" />
                  </div>

                </div>
              </div>
            </div>

            {/* ── Rôle & Statut — optionnel ── */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
              <div className="card-body p-4">
                <h6 className="text-muted text-uppercase small fw-semibold mb-1">
                  Rôle & Statut <OptBadge />
                </h6>
                <p className="text-muted small mb-3">Les valeurs actuelles sont pré-remplies.</p>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Rôle</label>
                    <select className="form-select" name="role" value={form.role} onChange={handleChange}>
                      <option value="membre">Membre</option>
                      <option value="admin">Admin</option>
                      <option value="bénévole">Bénévole</option>
                      <option value="donateur">Donateur</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Statut</label>
                    <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Mot de passe — optionnel ── */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
              <div className="card-body p-4">
                <h6 className="text-muted text-uppercase small fw-semibold mb-1">
                  Mot de passe <OptBadge />
                </h6>
                <p className="text-muted small mb-3">
                  Laisser vide pour conserver le mot de passe actuel.
                </p>
                <input
                  type="password" className="form-control"
                  name="password" value={form.password}
                  onChange={handleChange}
                  placeholder="Nouveau mot de passe (min. 8 caractères)"
                  minLength={form.password ? 8 : undefined}
                />
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                Annuler
              </button>
              <button type="submit" className="btn btn-warning px-4 fw-semibold" disabled={loading}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Mise à jour...</>
                  : '💾 Mettre à jour'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default EditUser