import React, { useState, useEffect } from 'react';
import AdminLayout from './common/AdminLayout';
import axios from 'axios';

// ─── Instance axios ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
  withCredentials: true,
});

const SUJETS = {
  info: "Demande d'information", partenariat: 'Partenariat',
  don: 'Don / soutien', benevolat: 'Bénévolat',
  presse: 'Presse / média', autre: 'Autre',
};
const STATUTS = {
  nouveau: { label: 'Nouveau', color: '#2563eb', bg: '#eff6ff' },
  lu:      { label: 'Lu',      color: '#7c3aed', bg: '#f5f3ff' },
  traite:  { label: 'Traité',  color: '#059669', bg: '#ecfdf5' },
  archive: { label: 'Archivé', color: '#6b7280', bg: '#f3f4f6' },
};

// ─── Badge statut ─────────────────────────────────────────────────────────────
function StatutBadge({ statut }) {
  const s = STATUTS[statut] ?? STATUTS.nouveau;
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.color}33`,
      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
      letterSpacing: '.4px', whiteSpace: 'nowrap',
    }}>{s.label}</span>
  );
}

// ─── Modal Envoyer un Mail ────────────────────────────────────────────────────
function ModalMail({ msg, onClose }) {
  const [sujet,   setSujet]   = useState(`Réponse à votre message : ${SUJETS[msg.sujet] ?? msg.sujet}`);
  const [corps,   setCorps]   = useState(`Bonjour ${msg.prenom},\n\n`);
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [errMail, setErrMail] = useState('');

  const send = async () => {
    if (!corps.trim()) { setErrMail('Le message ne peut pas être vide.'); return; }
    setSending(true); setErrMail('');
    try {
      await api.post(`contactenou/${msg.id}/mail`, { sujet, corps });
      setSent(true);
      setTimeout(onClose, 1800);
    } catch {
      setErrMail('Erreur lors de l\'envoi. Vérifiez votre configuration mail Laravel.');
    } finally { setSending(false); }
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560,
        boxShadow: '0 24px 64px rgba(0,0,0,.2)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ background: '#1d4ed8', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 12, margin: 0 }}>Répondre à</p>
            <h3 style={{ color: '#fff', margin: 0, fontSize: 17, fontWeight: 700 }}>
              {msg.prenom} {msg.nom} — <span style={{ fontWeight: 400, fontSize: 14 }}>{msg.email}</span>
            </h3>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,.2)', border: 'none', borderRadius: 8,
            width: 34, height: 34, cursor: 'pointer', color: '#fff', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{ fontSize: 40, margin: '0 0 8px' }}>✅</p>
              <p style={{ fontWeight: 700, color: '#059669', fontSize: 16, margin: 0 }}>Mail envoyé avec succès !</p>
            </div>
          ) : (
            <>
              {/* Sujet */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 6 }}>
                  Sujet
                </label>
                <input value={sujet} onChange={e => setSujet(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>

              {/* Corps */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 6 }}>
                  Message
                </label>
                <textarea value={corps} onChange={e => setCorps(e.target.value)} rows={7}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>

              {errMail && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>⚠️ {errMail}</p>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button onClick={onClose}
                  style={{ padding: '10px 20px', borderRadius: 10, border: '2px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                  Annuler
                </button>
                <button onClick={send} disabled={sending}
                  style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: '#1d4ed8', color: '#fff', fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer', fontSize: 14, opacity: sending ? .7 : 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {sending ? '⏳ Envoi…' : '✉️ Envoyer'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Modal Détail message ─────────────────────────────────────────────────────
function ModalDetail({ msg, onClose, onStatutChange, onMail }) {
  const [statut, setStatut] = useState(msg.statut);
  const [saving, setSaving] = useState(false);

  const save = async (val) => {
    setSaving(true);
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}contactenou/${msg.id}`, { statut: val });
      setStatut(val);
      onStatutChange(msg.id, val);
    } finally { setSaving(false); }
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 580,
        boxShadow: '0 24px 64px rgba(0,0,0,.18)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ background: '#009650', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 12, margin: 0 }}>Message de</p>
            <h3 style={{ color: '#fff', margin: 0, fontSize: 18, fontWeight: 700 }}>{msg.prenom} {msg.nom}</h3>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {/* ✅ Bouton Envoyer Mail depuis modal */}
            <button onClick={() => { onClose(); onMail(msg); }}
              style={{ background: '#1d4ed8', border: 'none', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              ✉️ Répondre
            </button>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,.2)', border: 'none', borderRadius: 8,
              width: 34, height: 34, cursor: 'pointer', color: '#fff', fontSize: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>×</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              { icon: '✉️', label: 'Email',     val: msg.email },
              { icon: '📞', label: 'Téléphone', val: msg.telephone || '—' },
              { icon: '🏷️', label: 'Sujet',     val: SUJETS[msg.sujet] ?? msg.sujet },
              { icon: '📅', label: 'Reçu le',   val: new Date(msg.created_at).toLocaleDateString('fr-HT', { day: '2-digit', month: 'long', year: 'numeric' }) },
            ].map(({ icon, label, val }) => (
              <div key={label} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
                <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>{icon} {label}</p>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#1e293b', fontWeight: 500 }}>{val}</p>
              </div>
            ))}
          </div>

          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>💬 Message</p>
            <p style={{ margin: 0, fontSize: 15,overflowY:'scroll', color: '#334155', lineHeight: 1.65, height:200, }}>{msg.message}</p>
          </div>

          {/* Changer statut */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>Changer statut :</span>
            {Object.entries(STATUTS).map(([key, s]) => (
              <button key={key} disabled={saving || statut === key} onClick={() => save(key)}
                style={{
                  padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  cursor: statut === key ? 'default' : 'pointer',
                  background: statut === key ? s.bg : '#f1f5f9',
                  color: statut === key ? s.color : '#64748b',
                  border: `2px solid ${statut === key ? s.color : 'transparent'}`,
                  transition: 'all .2s',
                }}>{s.label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [selected, setSelected] = useState(null);   // modal détail
  const [mailMsg,  setMailMsg]  = useState(null);   // modal mail
  const [filtre,   setFiltre]   = useState('');
  const [search,   setSearch]   = useState('');
  const [page,     setPage]     = useState(1);
  const [meta,     setMeta]     = useState(null);

  const fetchMessages = async (p = 1, statut = '') => {
    setLoading(true); setError(null);
    try {
      const params = { page: p };
      if (statut) params.statut = statut;
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}contactenou`, { params });
      if (Array.isArray(data)) {
        setMessages(data);
        setMeta({ total: data.length, last_page: 1, current_page: 1 });
      } else {
        setMessages(data.data ?? []);
        setMeta({ total: data.total, last_page: data.last_page, current_page: data.current_page });
      }
    } catch {
      setError('Impossible de charger les messages.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(page, filtre); }, [page, filtre]);

  const handleStatutChange = (id, newStatut) =>
    setMessages(prev => prev.map(m => m.id === id ? { ...m, statut: newStatut } : m));

  // ✅ Archiver en un clic
  const handleArchive = async (msg) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}contactenou/${msg.id}`, { statut: 'archive' });
      handleStatutChange(msg.id, 'archive');
    } catch { alert('Erreur lors de l\'archivage.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce message définitivement ?')) return;
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}contactenou/${id}`);
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = messages.filter(m =>
    !search || `${m.prenom} ${m.nom} ${m.email} ${m.message}`.toLowerCase().includes(search.toLowerCase())
  );

  const stats = Object.entries(STATUTS).map(([key, s]) => ({
    key, ...s, count: messages.filter(m => m.statut === key).length,
  }));

  // ─── Bouton action ──────────────────────────────────────────────────────────
  const Btn = ({ onClick, title, bg, children }) => (
    <button onClick={onClick} title={title} style={{
      background: bg, border: 'none', borderRadius: 7,
      width: 30, height: 30, cursor: 'pointer', fontSize: 14,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity .15s',
    }}>{children}</button>
  );

  return (
    <AdminLayout>
      <div style={{ fontFamily: "'Sora','Segoe UI',sans-serif", minHeight: '100vh', background: '#f0f4f8', padding: '28px 24px' }}>

        {/* En-tête */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a' }}>📬 Messages reçus</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Gérez les messages du formulaire de contact.</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))', gap: 12, marginBottom: 24 }}>
          {stats.map(s => (
            <div key={s.key} onClick={() => { setFiltre(filtre === s.key ? '' : s.key); setPage(1); }}
              style={{
                background: filtre === s.key ? s.bg : '#fff',
                border: `2px solid ${filtre === s.key ? s.color : '#e2e8f0'}`,
                borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                transition: 'all .2s', boxShadow: '0 1px 4px rgba(0,0,0,.06)',
              }}>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: s.color }}>{s.count}</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
          <div style={{ background: '#fff', border: '2px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{meta?.total ?? '—'}</p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b', fontWeight: 600 }}>Total</p>
          </div>
        </div>

        {/* Recherche + filtre */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher nom, email, message…"
              style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }} />
          </div>
          <select value={filtre} onChange={e => { setFiltre(e.target.value); setPage(1); }}
            style={{ padding: '10px 14px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14, background: '#fff', cursor: 'pointer' }}>
            <option value="">Tous les statuts</option>
            {Object.entries(STATUTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
          </select>
        </div>

        {/* Tableau */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,.07)', overflow: 'hidden' }}>

          {/* Header tableau */}
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1.3fr 1fr 130px',
            padding: '12px 20px', background: '#f8fafc', borderBottom: '2px solid #e2e8f0',
            fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.6px',
          }}>
            <span>Contact</span><span>Email</span><span>Sujet</span>
            <span>Date</span><span>Statut</span><span>Actions</span>
          </div>

          {/* Lignes */}
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#009650', animation: 'spin .7s linear infinite', margin: '0 auto 12px' }} />
              Chargement…
            </div>
          ) : error ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#ef4444' }}>⚠️ {error}</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>
              <p style={{ fontSize: 32, margin: '0 0 8px' }}>📭</p>
              <p style={{ margin: 0, fontWeight: 600 }}>Aucun message trouvé</p>
            </div>
          ) : filtered.map((msg, i) => (
            <div key={msg.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1.3fr 1fr 130px',
              padding: '13px 20px', alignItems: 'center',
              borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none',
              background: msg.statut === 'nouveau' ? '#fffbeb' : '#fff',
              transition: 'background .15s',
            }}>

              {/* Avatar + nom */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: '#009650',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13, flexShrink: 0,
                }}>
                  {msg.prenom?.[0]?.toUpperCase()}{msg.nom?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{msg.prenom} {msg.nom}</p>
                  {msg.telephone && <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>{msg.telephone}</p>}
                </div>
              </div>

              <p style={{ margin: 0, fontSize: 13, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.email}</p>
              <p style={{ margin: 0, fontSize: 13, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{SUJETS[msg.sujet] ?? msg.sujet}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>
                {new Date(msg.created_at).toLocaleDateString('fr-HT', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
              <StatutBadge statut={msg.statut} />

              {/* ✅ 4 boutons : Voir | Mail | Archiver | Supprimer */}
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <Btn onClick={() => setSelected(msg)}       title="Voir le message"   bg="#f0fdf4">👁</Btn>
                <Btn onClick={() => setMailMsg(msg)}        title="Envoyer un mail"   bg="#eff6ff">✉️</Btn>
                <Btn onClick={() => handleArchive(msg)}     title="Archiver"          bg="#f3f4f6" disabled={msg.statut === 'archive'}>🗂</Btn>
                <Btn onClick={() => handleDelete(msg.id)}   title="Supprimer"         bg="#fef2f2">🗑</Btn>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                style={{
                  width: 36, height: 36, borderRadius: 8, border: '2px solid', cursor: 'pointer',
                  fontWeight: 700, fontSize: 13,
                  borderColor: page === p ? '#009650' : '#e2e8f0',
                  background: page === p ? '#009650' : '#fff',
                  color: page === p ? '#fff' : '#475569', transition: 'all .2s',
                }}>{p}</button>
            ))}
          </div>
        )}

        {/* Modal Détail */}
        {selected && (
          <ModalDetail
            msg={selected}
            onClose={() => setSelected(null)}
            onStatutChange={handleStatutChange}
            onMail={(m) => setMailMsg(m)}
          />
        )}

        {/* Modal Mail */}
        {mailMsg && (
          <ModalMail msg={mailMsg} onClose={() => setMailMsg(null)} />
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; }`}</style>
      </div>
    </AdminLayout>
  );
};

export default Messages;