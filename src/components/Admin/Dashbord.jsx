import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminLayout from './common/AdminLayout'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const PIE_COLORS = ['#185FA5', '#0F6E56', '#534AB7', '#854F0B', '#993C1D']

const styles = `
  .dash-grid-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }
  @media (min-width: 768px) {
    .dash-grid-stats { grid-template-columns: repeat(4, 1fr); }
  }
  .dash-grid-charts-1 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  @media (min-width: 992px) {
    .dash-grid-charts-1 { grid-template-columns: 2fr 1fr; }
  }
  .dash-grid-charts-2 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  @media (min-width: 992px) {
    .dash-grid-charts-2 { grid-template-columns: 1fr 1fr; }
  }
  .dash-card {
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 1px 6px rgba(0,0,0,.07);
    padding: 16px;
  }
  .col-hide-sm { display: none; }
  @media (min-width: 576px) { .col-hide-sm { display: table-cell; } }
  .user-cell { display: flex; align-items: center; gap: 8px; }
  .user-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 600; flex-shrink: 0;
  }
  .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .table-scroll table { min-width: 480px; width: 100%; }
`

// ── Couleurs par rôle (insensible à la casse) ────────────────────────────────
const ROLE_STYLE = {
  admin:    { color: '#EEEDFE', text: '#534AB7' },   // violet
  membre:   { color: '#E6F1FB', text: '#185FA5' },   // bleu
  bénévole: { color: '#E1F5EE', text: '#0F6E56' },   // vert
  benevole: { color: '#E1F5EE', text: '#0F6E56' },   // vert (sans accent)
  donateur: { color: '#FBEAF0', text: '#993556' },   // rose
}

const getRoleStyle = (role) =>
  ROLE_STYLE[role?.toLowerCase()] ?? { color: '#F1EFE8', text: '#888' }

const getInitials = (firstname = '', lastname = '') =>
  ((firstname?.[0] ?? '') + (lastname?.[0] ?? '')).toUpperCase() || '?'

const getFullName = (u) =>
  [u.firstname, u.lastname].filter(Boolean).join(' ') || '—'

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

// ── Skeleton loader ──────────────────────────────────────────────────────────
const Skeleton = ({ h = 20, w = '100%', radius = 6 }) => (
  <div style={{
    height: h, width: w, borderRadius: radius,
    background: 'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite',
  }}/>
)

const skeletonStyle = `
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`

// ────────────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate()

  const [profile,    setProfile]    = useState(null)
  const [stats,      setStats]      = useState(null)
  const [articles,   setArticles]   = useState([])
  const [users,      setUsers]      = useState([])
  const [visitsData, setVisitsData] = useState([])
  const [donsData,   setDonsData]   = useState([])
  const [categories, setCategories] = useState([])
  const [events,     setEvents]     = useState([])
  const [loading,    setLoading]    = useState(true)

  const getToken = () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo'))
      return adminInfo?.token ?? localStorage.getItem('admin_token') ?? null
    } catch { return localStorage.getItem('admin_token') ?? null }
  }

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` }
  })

  useEffect(() => {
    const load = async () => {
      try {
        const BASE = import.meta.env.VITE_BACKEND_URL

        const [
          profileRes, statsRes, articlesRes, usersRes,
          visitsRes,  donsRes,  catsRes,     eventsRes,
        ] = await Promise.allSettled([
          axios.get(`${BASE}user`,                 authHeader()),
          axios.get(`${BASE}dashboard/stats`,      authHeader()),
          axios.get(`${BASE}Article`),
          axios.get(`${BASE}users`,                authHeader()),
          axios.get(`${BASE}dashboard/visits`,     authHeader()),
          axios.get(`${BASE}dons`,       authHeader()),
          axios.get(`${BASE}dashboard/categories`, authHeader()),
          axios.get(`${BASE}dashboard/events`,     authHeader()),
        ])

        if (profileRes.status === 'fulfilled')
          setProfile(profileRes.value.data?.user ?? profileRes.value.data)

        if (statsRes.status === 'fulfilled')
          setStats(statsRes.value.data)

        if (articlesRes.status === 'fulfilled')
          setArticles(articlesRes.value.data?.Article ?? articlesRes.value.data ?? [])

        if (usersRes.status === 'fulfilled')
          setUsers(usersRes.value.data?.users ?? usersRes.value.data ?? [])

        if (visitsRes.status === 'fulfilled')
          setVisitsData(visitsRes.value.data?.data ?? visitsRes.value.data ?? [])

        if (donsRes.status === 'fulfilled')
          setDonsData(donsRes.value.data?.data ?? donsRes.value.data ?? [])

        if (catsRes.status === 'fulfilled')
          setCategories(catsRes.value.data?.data ?? catsRes.value.data ?? [])

        if (eventsRes.status === 'fulfilled')
          setEvents(eventsRes.value.data?.data ?? eventsRes.value.data ?? [])

      } catch (err) {
        console.error('Erreur dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const chartVisits  = visitsData.length > 0 ? visitsData : []
  const chartDons    = donsData.length   > 0 ? donsData   : []
  const chartCats    = categories.length > 0 ? categories : []

  // ── Limité à 10 utilisateurs ──
  const recentUsers  = users.slice(0, 10)
  const upcomingEvts = events.slice(0, 5)

  const articleCats = (() => {
    if (chartCats.length > 0) return chartCats
    const counts = {}
    articles.forEach(a => {
      if (a.categorie) counts[a.categorie] = (counts[a.categorie] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  })()

  const statsCards = [
    {
      label: 'Utilisateurs',
      value: stats?.total_users    ?? users.length ?? '—',
      trend: stats?.trend_users    ?? '',
      color: '#185FA5', bg: '#E6F1FB',
      icon: <><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></>,
    },
    {
      label: 'Visiteurs',
      value: stats?.total_visites  ?? '—',
      trend: stats?.trend_visites  ?? '',
      color: '#0F6E56', bg: '#E1F5EE',
      icon: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    },
    {
      label: 'Articles',
      value: stats?.total_articles ?? articles.length ?? '—',
      trend: stats?.trend_articles ?? '',
      color: '#534AB7', bg: '#EEEDFE',
      icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/></>,
    },
    {
      label: 'Donateurs',
      value: stats?.total_donateurs ?? '—',
      trend: stats?.trend_donateurs ?? '',
      color: '#993556', bg: '#FBEAF0',
      icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
    },
  ]

  return (
    <AdminLayout>
      <style>{styles}{skeletonStyle}</style>
      <div className="py-5" />

      <div className="container-fluid py-4 px-3 px-md-4">

        {/* ── Titre + profil ── */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h4 className="fw-bold mb-1">Tableau de bord</h4>
            <p className="text-muted small mb-0">
              Bienvenue{profile?.firstname ? `, ${profile.firstname}` : ''} —{' '}
              {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          {profile && (
            <div className="d-flex align-items-center gap-2">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={getFullName(profile)}
                  style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
                  onError={e => (e.target.style.display = 'none')}
                />
              ) : (
                <div className="user-avatar"
                  style={{
                    background: getRoleStyle(profile.role).color,
                    color:      getRoleStyle(profile.role).text,
                    width: 38, height: 38, fontSize: 13,
                  }}>
                  {getInitials(profile.firstname, profile.lastname)}
                </div>
              )}
              <div className="d-none d-sm-block">
                <p className="mb-0 fw-semibold" style={{ fontSize: 13 }}>{getFullName(profile)}</p>
                <p className="mb-0 text-muted"  style={{ fontSize: 11 }}>{profile.role ?? 'Admin'}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Cartes stats ── */}
        <div className="dash-grid-stats">
          {statsCards.map((card, i) => (
            <div className="dash-card d-flex align-items-center gap-3" key={i}>
              <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 48, height: 48, background: card.bg }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke={card.color} strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round">
                  {card.icon}
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <p className="mb-0 text-muted text-truncate" style={{ fontSize: 11 }}>{card.label}</p>
                {loading
                  ? <Skeleton h={24} w={60} />
                  : <p className="mb-0 fw-bold" style={{ fontSize: 20 }}>{card.value}</p>
                }
                {card.trend && (
                  <span style={{ fontSize: 11, color: '#3B6D11', fontWeight: 600 }}>
                    {card.trend} ce mois
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Graphiques ligne 1 ── */}
        <div className="dash-grid-charts-1">
          <div className="dash-card">
            <p className="fw-semibold mb-0" style={{ fontSize: 14 }}>Visites & Nouveaux membres</p>
            <p className="text-muted mb-3"  style={{ fontSize: 11 }}>Évolution sur 12 mois</p>
            {loading ? <Skeleton h={220} /> : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartVisits}>
                  <defs>
                    <linearGradient id="gVisites" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#185FA5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#185FA5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gMembres" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#0F6E56" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0F6E56" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                  <XAxis dataKey="mois" tick={{ fontSize: 10 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={40}/>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #eee' }}/>
                  <Legend wrapperStyle={{ fontSize: 12 }}/>
                  <Area type="monotone" dataKey="visites" name="Visites"
                    stroke="#185FA5" strokeWidth={2} fill="url(#gVisites)"/>
                  <Area type="monotone" dataKey="membres" name="Membres"
                    stroke="#0F6E56" strokeWidth={2} fill="url(#gMembres)"/>
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="dash-card">
            <p className="fw-semibold mb-0" style={{ fontSize: 14 }}>Articles par catégorie</p>
            <p className="text-muted mb-2"  style={{ fontSize: 11 }}>Répartition</p>
            {loading ? <Skeleton h={180} /> : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={articleCats} cx="50%" cy="50%"
                      innerRadius={50} outerRadius={75}
                      dataKey="value" paddingAngle={3}>
                      {articleCats.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {articleCats.map((cat, i) => (
                    <div key={i} className="d-flex align-items-center gap-1">
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i], flexShrink: 0 }}/>
                      <span style={{ fontSize: 11, color: '#555' }}>{cat.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Graphiques ligne 2 ── */}
        <div className="dash-grid-charts-2">
          <div className="dash-card">
            <p className="fw-semibold mb-0" style={{ fontSize: 14 }}>Dons mensuels (HTG)</p>
            <p className="text-muted mb-3"  style={{ fontSize: 11 }}>Total collecté par mois</p>
            {loading ? <Skeleton h={200} /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartDons} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
                  <XAxis dataKey="mois" tick={{ fontSize: 10 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={45}/>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #eee' }}
                    formatter={(v) => `${v.toLocaleString()} HTG`}/>
                  <Bar dataKey="dons" name="Dons" fill="#993556" radius={[6, 6, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="dash-card">
            <p className="fw-semibold mb-3" style={{ fontSize: 14 }}>Prochains événements</p>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="d-flex gap-3 mb-3 align-items-center">
                    <Skeleton h={38} w={38} radius={50} />
                    <div style={{ flex: 1 }}>
                      <Skeleton h={13} w="70%" />
                      <div style={{ marginTop: 4 }}><Skeleton h={10} w="50%" /></div>
                    </div>
                  </div>
                ))
              : upcomingEvts.length === 0
                ? <p className="text-muted small">Aucun événement à venir.</p>
                : upcomingEvts.map((ev, i) => {
                    const bg     = ['#E6F1FB','#FBEAF0','#E1F5EE','#EEEDFE','#FAEEDA'][i % 5]
                    const stroke = ['#185FA5','#993556','#0F6E56','#534AB7','#854F0B'][i % 5]
                    return (
                      <div key={ev.id ?? i} className="d-flex align-items-center gap-3 mb-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: 38, height: 38, background: bg }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8"  y1="2" x2="8"  y2="6"/>
                            <line x1="3"  y1="10" x2="21" y2="10"/>
                          </svg>
                        </div>
                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                          <p className="mb-0 fw-semibold text-truncate" style={{ fontSize: 13 }}>
                            {ev.titre ?? ev.title ?? ev.nom}
                          </p>
                          <p className="mb-0 text-muted text-truncate" style={{ fontSize: 11 }}>
                            {ev.lieu ?? ev.location ?? ''}
                          </p>
                        </div>
                        <span className="badge rounded-pill flex-shrink-0"
                          style={{ fontSize: 10, background: bg, color: stroke, whiteSpace: 'nowrap' }}>
                          {ev.date
                            ? new Date(ev.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                            : ev.date_evenement ?? ''}
                        </span>
                      </div>
                    )
                  })
            }
          </div>
        </div>

        {/* ── Tableau membres — limité à 10 ── */}
        <div className="dash-card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <p className="fw-semibold mb-0" style={{ fontSize: 14 }}>Derniers membres inscrits</p>
              <p className="text-muted mb-0"  style={{ fontSize: 11 }}>
                {recentUsers.length} dernière(s) inscription(s) · 10 max affichés
              </p>
            </div>
            <button
              className="btn btn-sm btn-outline-primary"
              style={{ fontSize: 12, borderRadius: 8 }}
              onClick={() => navigate('/Admin/Users')}
            >
              Voir tous
            </button>
          </div>

          <div className="table-scroll">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th className="text-muted fw-semibold col-hide-sm" style={{ fontSize: 11 }}>#</th>
                  <th className="text-muted fw-semibold"             style={{ fontSize: 11 }}>Membre</th>
                  <th className="text-muted fw-semibold col-hide-sm" style={{ fontSize: 11 }}>Email</th>
                  <th className="text-muted fw-semibold"             style={{ fontSize: 11 }}>Rôle</th>
                  <th className="text-muted fw-semibold col-hide-sm" style={{ fontSize: 11 }}>Date</th>
                  <th className="text-muted fw-semibold"             style={{ fontSize: 11 }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i}>
                        <td className="col-hide-sm"><Skeleton h={14} w={20}/></td>
                        <td>
                          <div className="user-cell">
                            <Skeleton h={34} w={34} radius={50}/>
                            <Skeleton h={14} w={100}/>
                          </div>
                        </td>
                        <td className="col-hide-sm"><Skeleton h={14} w={130}/></td>
                        <td><Skeleton h={22} w={70} radius={20}/></td>
                        <td className="col-hide-sm"><Skeleton h={14} w={60}/></td>
                        <td><Skeleton h={22} w={60} radius={20}/></td>
                      </tr>
                    ))
                  : recentUsers.map((u, idx) => {
                      // ── Couleur basée sur le rôle réel de l'utilisateur ──
                      const style = getRoleStyle(u.role)
                      return (
                        <tr key={u.id ?? idx} style={{ borderBottom: '1px solid #f8f8f8' }}>

                          {/* # */}
                          <td className="text-muted col-hide-sm">{idx + 1}</td>

                          {/* Membre */}
                          <td>
                            <div className="user-cell">
                              {u.avatar ? (
                                <img
                                  src={u.avatar}
                                  alt={getFullName(u)}
                                  style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                                  onError={e => {
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'flex'
                                  }}
                                />
                              ) : null}
                              <div
                                className="user-avatar"
                                style={{
                                  background: style.color,
                                  color:      style.text,
                                  display:    u.avatar ? 'none' : 'flex',
                                }}
                              >
                                {getInitials(u.firstname, u.lastname)}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <span className="fw-semibold d-block text-truncate" style={{ maxWidth: 150 }}>
                                  {getFullName(u)}
                                </span>
                                {u.numero && (
                                  <span className="text-muted" style={{ fontSize: 11 }}>{u.numero}</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="text-muted col-hide-sm" style={{ fontSize: 12 }}>
                            {u.email ?? '—'}
                          </td>

                          {/* Rôle — couleur dynamique selon le rôle */}
                          <td>
                            <span
                              className="badge rounded-pill"
                              style={{
                                background: style.color,
                                color:      style.text,
                                fontSize: 11, fontWeight: 500,
                              }}
                            >
                              {u.role ?? 'membre'}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="text-muted col-hide-sm">
                            {formatDate(u.created_at)}
                          </td>

                          {/* Statut */}
                          <td>
                            <span className="badge rounded-pill" style={{
                              fontSize: 11, fontWeight: 500,
                              background: u.status === 'actif' ? '#EAF3DE' : '#F1EFE8',
                              color:      u.status === 'actif' ? '#3B6D11' : '#888',
                            }}>
                              {u.status === 'actif' ? '● Actif' : '○ Inactif'}
                            </span>
                          </td>

                        </tr>
                      )
                    })
                }
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}

export default Dashboard