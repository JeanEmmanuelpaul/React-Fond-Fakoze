import React, { useState } from 'react';
import Layout from './common/Layout';
import axios from 'axios';

// ─── Instance axios configurée ────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,  // ex: http://localhost:8000/
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
    'X-Requested-With': 'XMLHttpRequest',     // ✅ requis par Laravel pour les API
  },
  withCredentials: false,                     // mettre true si vous utilisez Sanctum cookie
});

// ─── Hook de soumission ───────────────────────────────────────────────────────
function useContact() {
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});
  const [success, setSuccess] = useState(false);

  const submit = async (formData) => {
    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
   
      await api.post('contactenous', formData);

      setSuccess(true);
      return true;

    } catch (error) {

      if (error.response) {
        const { status, data } = error.response;

        if (status === 422 && data.errors) {
          // Aplatir les erreurs Laravel : { email: ["msg1"] } → { email: "msg1" }
          const flat = Object.fromEntries(
            Object.entries(data.errors).map(([k, v]) => [k, v[0]])
          );
          setErrors(flat);
        } else {
          setErrors({ general: data.message ?? 'Une erreur est survenue.' });
        }
      } else {
        setErrors({ general: 'Impossible de joindre le serveur. Vérifiez votre connexion.' });
      }
      return false;

    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, errors, success };
}

// ─── Champ générique ─────────────────────────────────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <div className="ct-field">
      <label className="ct-label">
        {label} {required && <span className="ct-required">*</span>}
      </label>
      {children}
      {error && <span className="ct-error-msg">{error}</span>}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
const Contact = () => {
  const { submit, loading, errors, success } = useContact();

  const [form, setForm] = useState({
    prenom:       '',
    nom:          '',
    email:        '',
    telephone:    '',
    sujet:        '',
    message:      '',
    consentement: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await submit({
      ...form,
      consentement: form.consentement ? '1' : '0',
    });
    if (ok) {
      setForm({ prenom: '', nom: '', email: '', telephone: '', sujet: '', message: '', consentement: false });
    }
  };

  return (
    <Layout>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="ct-hero">
        <div className="container">
          <span className="ct-badge">Contact</span>
          <h1 className="ct-hero-title">Parlons ensemble</h1>
          <p className="ct-hero-sub">
            Une question, une idée ou envie de rejoindre notre cause ?
            Notre équipe vous répond sous 48 h.
          </p>
        </div>
      </section>

      {/* ── Formulaire ───────────────────────────────────────────────────── */}
      <section className="ct-main py-5">
        <div className="container">
          <div className="row g-4 align-items-start">
            <div className="col-12 col-lg-8">
              <div className="ct-form-card">

                <div className="ct-form-header">
                  <span className="ct-badge-green">Message</span>
                  <h3 className="ct-form-title">Envoyez-nous un message</h3>
                  <p className="ct-form-sub">
                    Tous les champs marqués d'un <span className="ct-required">*</span> sont obligatoires.
                  </p>
                </div>

                {success && (
                  <div className="ct-alert ct-alert-success">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span>Votre message a bien été envoyé. Nous vous répondrons sous 48 h.</span>
                  </div>
                )}

                {errors.general && (
                  <div className="ct-alert ct-alert-error">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>{errors.general}</span>
                  </div>
                )}

                <form className="ct-form" onSubmit={handleSubmit} noValidate>

                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <Field label="Prénom" required error={errors.prenom}>
                        <input type="text" name="prenom" id="ct-prenom"
                          className={`ct-input ${errors.prenom ? 'ct-input-error' : ''}`}
                          placeholder="Jean" value={form.prenom} onChange={handleChange} required />
                      </Field>
                    </div>
                    <div className="col-12 col-sm-6">
                      <Field label="Nom" required error={errors.nom}>
                        <input type="text" name="nom" id="ct-nom"
                          className={`ct-input ${errors.nom ? 'ct-input-error' : ''}`}
                          placeholder="Baptiste" value={form.nom} onChange={handleChange} required />
                      </Field>
                    </div>
                  </div>

                  <div className="row g-3 mt-1">
                    <div className="col-12 col-sm-6">
                      <Field label="Email" required error={errors.email}>
                        <input type="email" name="email" id="ct-email"
                          className={`ct-input ${errors.email ? 'ct-input-error' : ''}`}
                          placeholder="jean@exemple.ht" value={form.email} onChange={handleChange} required />
                      </Field>
                    </div>
                    <div className="col-12 col-sm-6">
                      <Field label="Téléphone" error={errors.telephone}>
                        <input type="tel" name="telephone" id="ct-tel"
                          className={`ct-input ${errors.telephone ? 'ct-input-error' : ''}`}
                          placeholder="+509 3700-0000" value={form.telephone} onChange={handleChange} />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Field label="Sujet" required error={errors.sujet}>
                      <select name="sujet" id="ct-sujet"
                        className={`ct-input ct-select ${errors.sujet ? 'ct-input-error' : ''}`}
                        value={form.sujet} onChange={handleChange} required>
                        <option value="" disabled>Choisir un sujet…</option>
                        <option value="info">Demande d'information</option>
                        <option value="partenariat">Partenariat</option>
                        <option value="don">Don / soutien financier</option>
                        <option value="benevolat">Bénévolat</option>
                        <option value="presse">Presse / média</option>
                        <option value="autre">Autre</option>
                      </select>
                    </Field>
                  </div>

                  <div className="mt-3">
                    <Field label="Message" required error={errors.message}>
                      <textarea name="message" id="ct-msg"
                        className={`ct-input ct-textarea ${errors.message ? 'ct-input-error' : ''}`}
                        rows="5" placeholder="Écrivez votre message ici…"
                        value={form.message} onChange={handleChange} required />
                    </Field>
                  </div>

                  <div className="mt-3 d-flex align-items-center gap-2">
                    <input type="checkbox" name="consentement" id="ct-consent"
                      className="ct-check" checked={form.consentement} onChange={handleChange} />
                    <label htmlFor="ct-consent" className="ct-check-label">
                      J'accepte que mes données soient utilisées pour traiter ma demande.
                    </label>
                  </div>
                  {errors.consentement && <span className="ct-error-msg">{errors.consentement}</span>}

                  <div className="mt-4">
                    <button type="submit" className="ct-btn-submit" disabled={loading}>
                      {loading ? (
                        <><span className="ct-spinner" />Envoi en cours…</>
                      ) : (
                        <>
                          Envoyer le message
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"/>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                          </svg>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Carte / Localisation ─────────────────────────────────────────── */}
      <section className="ct-map-section py-5">
        <div className="container">
          <span className="ct-section-label">Localisation</span>
          <h3 className="ct-section-title">Où nous trouver</h3>
          <div className="ct-divider" />
          <div className="ct-map-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
              stroke="#009650" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <p>12 Rue Capois, Port-au-Prince, Haïti</p>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="ct-map-link">
              Voir sur Google Maps →
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .ct-alert { display:flex; align-items:center; gap:.75rem; padding:1rem 1.25rem; border-radius:.75rem; margin-bottom:1.5rem; font-size:.95rem; font-weight:500; }
        .ct-alert-success { background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; }
        .ct-alert-error   { background:#fef2f2; color:#991b1b; border:1px solid #fecaca; }
        .ct-input-error   { border-color:#ef4444 !important; box-shadow:0 0 0 3px rgba(239,68,68,.12) !important; }
        .ct-error-msg     { display:block; margin-top:.35rem; font-size:.82rem; color:#ef4444; font-weight:500; }
        .ct-field         { display:flex; flex-direction:column; }
        .ct-btn-submit    { display:flex; align-items:center; gap:.5rem; }
        .ct-btn-submit:disabled { opacity:.7; cursor:not-allowed; }
        .ct-spinner { width:16px; height:16px; border-radius:50%; border:2px solid rgba(255,255,255,.4); border-top-color:#fff; animation:spin .7s linear infinite; display:inline-block; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </Layout>
  );
};

export default Contact;