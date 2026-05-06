import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BsPeopleFill, BsEyeFill, BsNewspaper, BsCalendarEventFill, BsHeartFill, BsHandIndex } from "react-icons/bs";
import AdminLayout from './common/AdminLayout'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'

// ── Palette ─────────────────────────────────────────────────────────────────
const COLORS = {
  blue:   '#185FA5',
  green:  '#0F6E56',
  purple: '#534AB7',
  pink:   '#993556',
  amber:  '#B45309',
}
const PIE_COLORS  = Object.values(COLORS)
const ROLE_COLORS = {
  admin:    { bg: '#EEEDFE', text: '#534AB7' },
  membre:   { bg: '#E6F1FB', text: '#185FA5' },
  bénévole: { bg: '#E1F5EE', text: '#0F6E56' },
  donateur: { bg: '#FBEAF0', text: '#993556' },
}
const getRoleStyle = (r) => ROLE_COLORS[r?.toLowerCase()] ?? { bg: '#F1F3F5', text: '#888' }

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt    = (n) => (n ?? 0).toLocaleString('fr-FR')
const pct    = (a, b) => b ? Math.round((a / b) * 100) : 0
const getToken = () => {
  try { return JSON.parse(localStorage.getItem('adminInfo'))?.token ?? localStorage.getItem('admin_token') }
  catch { return localStorage.getItem('admin_token') }
}
const authH = () => ({ headers: { Authorization: `Bearer ${getToken()}` } })

// ── Skeleton ─────────────────────────────────────────────────────────────────
const Sk = ({ h = 20, w = '100%', r = 8 }) => (
  <div style={{
    height: h, width: w, borderRadius: r,
    background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)',
    backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
  }}/>
)

// ── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, sub, color, bg, icon, loading }) => (
  <div style={{
    background: '#fff', borderRadius: 16,
    boxShadow: '0 1px 8px rgba(0,0,0,.07)',
    padding: '20px 20px 16px',
    borderTop: `4px solid ${color}`,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>
          {label}
        </p>
        {loading
          ? <Sk h={32} w={80} />
          : <p style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>{fmt(value)}</p>
        }
        {sub && !loading && (
          <p style={{ fontSize: 11, color: '#3B6D11', fontWeight: 600, marginTop: 4, marginBottom: 0 }}>{sub}</p>
        )}
      </div>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
        {icon}
      </div>
    </div>
  </div>
)

// ── Chart wrapper ─────────────────────────────────────────────────────────────
const Card = ({ title, sub, children, style = {} }) => (
  <div style={{
    background: '#fff', borderRadius: 16,
    boxShadow: '0 1px 8px rgba(0,0,0,.07)',
    padding: 20, ...style,
  }}>
    {title && (
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{title}</p>
        {sub && <p style={{ fontSize: 11, color: '#999', margin: 0 }}>{sub}</p>}
      </div>
    )}
    {children}
  </div>
)

// ── Main ─────────────────────────────────────────────────────────────────────
const Statistiques = () => {
  const navigate = useNavigate()
  const BASE = import.meta.env.VITE_BACKEND_URL

  const [loading,    setLoading]    = useState(true)
  const [stats,      setStats]      = useState(null)
  const [users,      setUsers]      = useState([])
  const [articles,   setArticles]   = useState([])
  const [events,     setEvents]     = useState([])
  const [visitsData, setVisitsData] = useState([])
  const [donsData,   setDonsData]   = useState([])
  const [categories, setCategories] = useState([])
  const [period,     setPeriod]     = useState('12m') // filtre période

  useEffect(() => {
    const load = async () => {
      const [statsR, usersR, artsR, evtsR, visR, donsR, catsR] = await Promise.allSettled([
        axios.get(`${BASE}dashboard/stats`,      authH()),
        axios.get(`${BASE}users`,                authH()),
        axios.get(`${BASE}Article`),
        axios.get(`${BASE}evenements`),
        axios.get(`${BASE}dashboard/visits`,     authH()),
        axios.get(`${BASE}dons`,       authH()),
        axios.get(`${BASE}dashboard/categories`, authH()),
      ])
      if (statsR.status === 'fulfilled') setStats(statsR.value.data)
      if (usersR.status === 'fulfilled') setUsers(usersR.value.data?.users ?? usersR.value.data ?? [])
      if (artsR.status  === 'fulfilled') setArticles(artsR.value.data?.Article ?? artsR.value.data ?? [])
      if (evtsR.status  === 'fulfilled') setEvents(evtsR.value.data?.data ?? evtsR.value.data ?? [])
      if (visR.status   === 'fulfilled') setVisitsData(visR.value.data?.data ?? visR.value.data ?? [])
      if (donsR.status  === 'fulfilled') setDonsData(donsR.value.data?.data ?? donsR.value.data ?? [])
      if (catsR.status  === 'fulfilled') setCategories(catsR.value.data?.data ?? catsR.value.data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  // ── Données dérivées ──────────────────────────────────────────────────────
  const totalUsers    = stats?.total_users    ?? users.length
  const totalVisites  = stats?.total_visites  ?? 0
  const totalArticles = stats?.total_articles ?? articles.length
  const totalEvents   = stats?.total_events   ?? events.length
  const totalDons     = stats?.total_dons     ?? 0
  const totalDonateurs= stats?.total_donateurs ?? 0

  // Répartition rôles
  const roleCount = users.reduce((acc, u) => {
    const r = u.role ?? 'membre'
    acc[r] = (acc[r] || 0) + 1
    return acc
  }, {})
  const rolePie = Object.entries(roleCount).map(([name, value]) => ({ name, value }))

  // Statut utilisateurs
  const actifs   = users.filter(u => u.status === 'actif').length
  const inactifs = users.length - actifs
  const statutPie = [
    { name: 'Actifs',   value: actifs },
    { name: 'Inactifs', value: inactifs },
  ]

  // Catégories articles
  const artCats = categories.length > 0 ? categories : (() => {
    const c = {}
    articles.forEach(a => { if (a.categorie) c[a.categorie] = (c[a.categorie] || 0) + 1 })
    return Object.entries(c).map(([name, value]) => ({ name, value }))
  })()

  // Statuts événements
  const evtStatuts = events.reduce((acc, e) => {
    const s = e.statut ?? 'planifié'
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {})
  const evtPie = Object.entries(evtStatuts).map(([name, value]) => ({ name, value }))

  // Inscriptions par mois (depuis users.created_at)
  const inscByMonth = (() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date()
      d.setMonth(d.getMonth() - (5 - i))
      return { mois: d.toLocaleDateString('fr-FR', { month: 'short' }), inscrits: 0 }
    })
    users.forEach(u => {
      if (!u.created_at) return
      const d = new Date(u.created_at)
      const label = d.toLocaleDateString('fr-FR', { month: 'short' })
      const found = months.find(m => m.mois === label)
      if (found) found.inscrits++
    })
    return months
  })()

  // Données radar activité
  const radarData = [
    { subject: 'Utilisateurs', A: pct(totalUsers, Math.max(totalUsers, 1) * 1.2) },
    { subject: 'Articles',     A: pct(totalArticles, Math.max(totalArticles, 1) * 1.2) },
    { subject: 'Événements',   A: pct(totalEvents, Math.max(totalEvents, 1) * 1.2) },
    { subject: 'Visites',      A: Math.min(100, pct(totalVisites, 10000)) },
    { subject: 'Dons',         A: Math.min(100, pct(totalDons, 500000)) },
  ]

  const chartVisits = visitsData.length > 0 ? visitsData : []
  const chartDons   = donsData.length   > 0 ? donsData   : []

  const tooltipStyle = { borderRadius: 10, fontSize: 12, border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,.08)' }

  return (
    <AdminLayout>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .stat-grid { display:grid; gap:14px; grid-template-columns:repeat(2,1fr); }
        @media(min-width:768px){ .stat-grid{grid-template-columns:repeat(3,1fr);} }
        @media(min-width:1200px){ .stat-grid{grid-template-columns:repeat(6,1fr);} }
        .charts-2{ display:grid; gap:16px; grid-template-columns:1fr; margin-bottom:16px; }
        @media(min-width:900px){ .charts-2{grid-template-columns:1fr 1fr;} }
        .charts-3{ display:grid; gap:16px; grid-template-columns:1fr; margin-bottom:16px; }
        @media(min-width:900px){ .charts-3{grid-template-columns:2fr 1fr;} }
        .period-btn { border:1.5px solid #e0e0e0; background:#fff; border-radius:8px; padding:5px 14px; font-size:12px; font-weight:600; cursor:pointer; transition:all .15s; }
        .period-btn.active { background:#185FA5; color:#fff; border-color:#185FA5; }
        .progress-bar-wrap { background:#f3f4f6; border-radius:99px; overflow:hidden; height:8px; }
        .progress-bar-fill { height:8px; border-radius:99px; transition:width .6s cubic-bezier(.4,0,.2,1); }
      `}</style>

      <div className="py-5" />

      <div style={{ padding: '24px 20px', maxWidth: 1400, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h4 style={{ fontWeight: 800, fontSize: 22, margin: 0 }}>📊 Statistiques</h4>
            <p style={{ color: '#999', fontSize: 13, margin: 0 }}>
              Vue d'ensemble · mis à jour en temps réel
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 10, fontSize: 12 }}
              onClick={() => navigate(-1)}>← Retour</button>
            {['3m','6m','12m'].map(p => (
              <button key={p} className={`period-btn ${period === p ? 'active' : ''}`}
                onClick={() => setPeriod(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ── KPI row ── */}
       
        <div className="stat-grid" style={{ marginBottom: 20 }}>
        <KpiCard label="Utilisateurs"  value={totalUsers}     icon={<BsPeopleFill size={22} />}        color={COLORS.blue}   bg="#E6F1FB" loading={loading} sub={stats?.trend_users} />
        <KpiCard label="Visites"       value={totalVisites}   icon={<BsEyeFill size={22} />}            color={COLORS.green}  bg="#E1F5EE" loading={loading} sub={stats?.trend_visites} />
        <KpiCard label="Articles"      value={totalArticles}  icon={<BsNewspaper size={22} />}          color={COLORS.purple} bg="#EEEDFE" loading={loading} sub={stats?.trend_articles} />
        <KpiCard label="Événements"    value={totalEvents}    icon={<BsCalendarEventFill size={22} />}  color={COLORS.amber}  bg="#FEF3C7" loading={loading} />
        <KpiCard label="Dons (HTG)"    value={totalDons}      icon={<BsHeartFill size={22} />}          color={COLORS.pink}   bg="#FBEAF0" loading={loading} sub={stats?.trend_dons} />
        <KpiCard label="Donateurs"     value={totalDonateurs} icon={<BsHandIndex size={22} />}          color="#854F0B"        bg="#FAEEDA" loading={loading} />
        </div>
        {/* ── Visites + Inscriptions ── */}
        <div className="charts-3">
          <Card title="Évolution des visites" sub="Trafic et nouveaux membres par mois">
            {loading ? <Sk h={220}/> : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartVisits}>
                  <defs>
                    <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={COLORS.blue}  stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={COLORS.blue}  stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gM" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={COLORS.green} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={COLORS.green} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5"/>
                  <XAxis dataKey="mois" tick={{ fontSize: 10 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={36}/>
                  <Tooltip contentStyle={tooltipStyle}/>
                  <Legend wrapperStyle={{ fontSize: 12 }}/>
                  <Area type="monotone" dataKey="visites" name="Visites"
                    stroke={COLORS.blue}  strokeWidth={2} fill="url(#gV)"/>
                  <Area type="monotone" dataKey="membres" name="Membres"
                    stroke={COLORS.green} strokeWidth={2} fill="url(#gM)"/>
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card title="Inscriptions / 6 mois" sub="Nouveaux comptes par mois">
            {loading ? <Sk h={220}/> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={inscByMonth} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false}/>
                  <XAxis dataKey="mois" tick={{ fontSize: 10 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={28}/>
                  <Tooltip contentStyle={tooltipStyle}/>
                  <Bar dataKey="inscrits" name="Inscrits" fill={COLORS.blue} radius={[6,6,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* ── Dons + Rôles Pie ── */}
        <div className="charts-2">
          <Card title="Dons mensuels (HTG)" sub="Total collecté par mois">
            {loading ? <Sk h={200}/> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartDons} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false}/>
                  <XAxis dataKey="mois" tick={{ fontSize: 10 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={48}/>
                  <Tooltip contentStyle={tooltipStyle} formatter={v => `${fmt(v)} HTG`}/>
                  <Bar dataKey="dons" name="Dons" fill={COLORS.pink} radius={[6,6,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card title="Répartition des rôles" sub="Distribution des utilisateurs">
            {loading ? <Sk h={200}/> : rolePie.length === 0
              ? <p style={{ color: '#bbb', textAlign: 'center', paddingTop: 60 }}>Aucune donnée</p>
              : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={rolePie} cx="50%" cy="50%"
                      innerRadius={45} outerRadius={70}
                      dataKey="value" paddingAngle={3}>
                      {rolePie.map((entry, i) => (
                        <Cell key={i} fill={getRoleStyle(entry.name).text}/>
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${v} utilisateur(s)`, n]}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 8 }}>
                  {rolePie.map((r, i) => {
                    const s = getRoleStyle(r.name)
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.text }}/>
                        <span style={{ fontSize: 12, color: '#555' }}>{r.name} ({r.value})</span>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </Card>
        </div>

        {/* ── Articles + Événements + Radar ── */}
        <div className="charts-3">
          <div className="charts-2" style={{ margin: 0 }}>

            {/* Articles par catégorie */}
            <Card title="Articles par catégorie" sub="Répartition du contenu">
              {loading ? <Sk h={190}/> : artCats.length === 0
                ? <p style={{ color: '#bbb', textAlign: 'center', paddingTop: 60 }}>Aucune donnée</p>
                : (
                <>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={artCats} cx="50%" cy="50%"
                        outerRadius={65} dataKey="value" paddingAngle={2}>
                        {artCats.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
                    {artCats.map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length] }}/>
                        <span style={{ fontSize: 11, color: '#666' }}>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>

            {/* Statut événements */}
            <Card title="Statut des événements" sub="État actuel">
              {loading ? <Sk h={190}/> : evtPie.length === 0
                ? <p style={{ color: '#bbb', textAlign: 'center', paddingTop: 60 }}>Aucune donnée</p>
                : (
                <div style={{ paddingTop: 8 }}>
                  {evtPie.map((e, i) => {
                    const pctVal = pct(e.value, totalEvents || 1)
                    const clr = PIE_COLORS[i % PIE_COLORS.length]
                    return (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#444', textTransform: 'capitalize' }}>{e.name}</span>
                          <span style={{ fontSize: 12, color: '#999' }}>{e.value} · {pctVal}%</span>
                        </div>
                        <div className="progress-bar-wrap">
                          <div className="progress-bar-fill" style={{ width: `${pctVal}%`, background: clr }}/>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>

          </div>

          {/* Radar activité globale */}
          <Card title="Activité globale" sub="Vue radar multi-indicateurs">
            {loading ? <Sk h={260}/> : (
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#eee"/>
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }}/>
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} tickCount={4}/>
                  <Radar name="Score" dataKey="A" stroke={COLORS.blue}
                    fill={COLORS.blue} fillOpacity={0.15} strokeWidth={2}/>
                  <Tooltip contentStyle={tooltipStyle} formatter={v => `${v}%`}/>
                </RadarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* ── Statut utilisateurs + barre rôles ── */}
        <div className="charts-2">
          <Card title="Statut des comptes" sub="Actifs vs inactifs">
            {loading ? <Sk h={180}/> : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <ResponsiveContainer width="50%" height={160}>
                  <PieChart>
                    <Pie data={statutPie} cx="50%" cy="50%"
                      innerRadius={40} outerRadius={65}
                      dataKey="value" paddingAngle={4}>
                      <Cell fill="#EAF3DE" stroke="#3B6D11" strokeWidth={2}/>
                      <Cell fill="#F1EFE8" stroke="#aaa"    strokeWidth={2}/>
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {[
                    { label: 'Actifs',   val: actifs,   clr: '#3B6D11', bg: '#EAF3DE' },
                    { label: 'Inactifs', val: inactifs, clr: '#888',    bg: '#F1EFE8' },
                  ].map((s, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: s.clr }}>{s.label}</span>
                        <span style={{ fontSize: 13, color: '#666' }}>{s.val} · {pct(s.val, users.length)}%</span>
                      </div>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar-fill"
                          style={{ width: `${pct(s.val, users.length)}%`, background: s.clr }}/>
                      </div>
                    </div>
                  ))}
                  <p style={{ fontSize: 11, color: '#bbb', marginTop: 8 }}>
                    Total : {users.length} compte(s)
                  </p>
                </div>
              </div>
            )}
          </Card>

          <Card title="Répartition par rôle (détail)" sub="Nombre et pourcentage">
            {loading ? <Sk h={180}/> : (
              <div style={{ paddingTop: 4 }}>
                {rolePie.map((r, i) => {
                  const s = getRoleStyle(r.name)
                  const p = pct(r.value, users.length)
                  return (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <span className="badge rounded-pill"
                            style={{ background: s.bg, color: s.text, fontSize: 11, fontWeight: 600 }}>
                            {r.name}
                          </span>
                        </span>
                        <span style={{ fontSize: 12, color: '#888' }}>{r.value} · {p}%</span>
                      </div>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar-fill" style={{ width: `${p}%`, background: s.text }}/>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>

      </div>
    </AdminLayout>
  )
}

export default Statistiques