import React, { useState } from 'react';
import Layout from './common/Layout';
import Agenda from './Agenda';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: false,
});

// ─── Taux de conversion (1 USD = 110 HTG) ────────────────────────────────────
const HTG_TO_USD = 110;
const toUSD = (htg) => (htg / HTG_TO_USD).toFixed(2);

// ─── Montants prédéfinis ─────────────────────────────────────────────────────
const MONTANTS = [500, 1000, 2500, 5000, 10000];

const IMPACTS = {
  500:   '500 HTG = repas chaud pour 5 enfants',
  1000:  '1 000 HTG = fournitures scolaires pour 2 élèves',
  2500:  '2 500 HTG = kit médical pour une famille',
  5000:  '5 000 HTG = formation professionnelle d\'un jeune',
  10000: '10 000 HTG = financement partiel d\'un micro-projet',
};

const CARD_STYLE = {
  style: {
    base: {
      fontSize: '15px', color: '#1e293b', fontFamily: "'Sora', sans-serif",
      '::placeholder': { color: '#94a3b8' },
    },
    invalid: { color: '#ef4444' },
  },
};

// ─── Formulaire de paiement Stripe ───────────────────────────────────────────
function StripeForm({ montant, frequence, message, onSuccess, onCancel }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [errPay, setErrPay] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    setErrPay('');

    try {
      const { data } = await api.post('dons/create-intent/', {
        montant, frequence, message,
      });

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.client_secret,
        { payment_method: { card: elements.getElement(CardElement) } }
      );

      if (error) {
        setErrPay(error.message);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        await api.post(`dons/${data.don_id}/confirm`);
        onSuccess(montant);
      }
    } catch {
      setErrPay('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480,
        boxShadow: '0 24px 64px rgba(0,0,0,.2)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: '#009650', padding: '20px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 12, margin: 0 }}>Paiement sécurisé</p>
            <h3 style={{ color: '#fff', margin: 0, fontSize: 20, fontWeight: 800 }}>
              Don de {Number(montant).toLocaleString('fr')} HTG
            </h3>
            {/* ── Équivalent USD ── */}
            <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 13, margin: '2px 0 0', fontWeight: 600 }}>
              ≈ ${toUSD(montant)} USD
            </p>
          </div>
          <button onClick={onCancel} style={{
            background: 'rgba(255,255,255,.2)', border: 'none', borderRadius: 8,
            width: 34, height: 34, cursor: 'pointer', color: '#fff', fontSize: 20,
          }}>×</button>
        </div>

        {/* Body */}
        <form onSubmit={handlePay} style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              fontSize: 12, fontWeight: 700, color: '#64748b',
              textTransform: 'uppercase', letterSpacing: '.5px',
              display: 'block', marginBottom: 8,
            }}>
              Informations de carte
            </label>
            <div style={{ border: '2px solid #e2e8f0', borderRadius: 10, padding: '14px 16px' }}>
              <CardElement options={CARD_STYLE} />
            </div>
          </div>

          {/* Récap */}
          <div style={{
            background: '#f0fdf4', borderRadius: 10, padding: '12px 16px',
            marginBottom: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#166534', fontSize: 13, fontWeight: 600 }}>
                {frequence === 'mensuel' ? '🔄 Don mensuel' : '💚 Don unique'}
              </span>
              <span style={{ color: '#166534', fontSize: 18, fontWeight: 800 }}>
                {Number(montant).toLocaleString('fr')} HTG
              </span>
            </div>
            {/* Ligne USD */}
            <div style={{ textAlign: 'right', marginTop: 2 }}>
              <span style={{ color: '#4ade80', fontSize: 12, fontWeight: 600 }}>
                ≈ ${toUSD(montant)} USD
              </span>
            </div>
          </div>

          {errPay && (
            <div style={{
              background: '#fef2f2', color: '#991b1b',
              border: '1px solid #fecaca', borderRadius: 10,
              padding: '10px 14px', marginBottom: 16, fontSize: 13,
            }}>
              ⚠️ {errPay}
            </div>
          )}

          <button
            type="submit"
            disabled={paying || !stripe}
            style={{
              width: '100%', padding: '14px', borderRadius: 12, border: 'none',
              background: paying ? '#94a3b8' : '#009650', color: '#fff',
              fontWeight: 800, fontSize: 16, cursor: paying ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'background .2s',
            }}>
            {paying ? (
              <>
                <span style={{
                  width: 18, height: 18, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff',
                  animation: 'spin .7s linear infinite', display: 'inline-block',
                }} />
                Traitement…
              </>
            ) : (
              <>🔒 Payer {Number(montant).toLocaleString('fr')} HTG (≈ ${toUSD(montant)} USD)</>
            )}
          </button>

          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 12, marginBottom: 0 }}>
            Paiement sécurisé par Stripe • Reçu fiscal par email
          </p>
        </form>
      </div>
    </div>
  );
}

// ─── Composant principal Fairdon ──────────────────────────────────────────────
const Fairdon = () => {
  const [montant,    setMontant]    = useState(1000);
  const [inputValue, setInputValue] = useState('1000');
  const [activeBtn,  setActiveBtn]  = useState(1000);
  const [frequence,  setFrequence]  = useState('unique');
  const [message,    setMessage]    = useState('');
  const [showPay,    setShowPay]    = useState(false);
  const [success,    setSuccess]    = useState(false);

  const handlePreset = (m) => {
    setMontant(m);
    setActiveBtn(m);
    setInputValue(String(m));
  };

  const handleInput = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setInputValue(val);
    setActiveBtn(null);
    setMontant(val ? Number(val) : 0);
  };

  const montantFinal = montant;
  const isValid      = montantFinal >= 100;

  const handleSuccess = () => {
    setShowPay(false);
    setSuccess(true);
  };

  return (
    <Layout>
      <section className="dn-hero">
        <div className="container">
          <div className="row align-items-center g-5">

            {/* Colonne gauche */}
            <div className="col-12 col-lg-6">
              <span className="dn-badge">Faire un don</span>
              <h1 className="dn-hero-title">Votre générosité change des vies</h1>
              <p className="dn-hero-sub">
                Chaque contribution, petite ou grande, permet à notre organisation
                de poursuivre ses missions d'éducation, de solidarité et de
                développement communautaire en Haïti.
              </p>
              <div className="dn-impact-row">
                <div className="dn-impact-item">
                  <span className="dn-impact-num">5 200+</span>
                  <span className="dn-impact-label">Bénéficiaires</span>
                </div>
                <div className="dn-impact-sep" />
                <div className="dn-impact-item">
                  <span className="dn-impact-num">120</span>
                  <span className="dn-impact-label">Projets financés</span>
                </div>
                <div className="dn-impact-sep" />
                <div className="dn-impact-item">
                  <span className="dn-impact-num">14 ans</span>
                  <span className="dn-impact-label">D'engagement</span>
                </div>
              </div>
            </div>

            {/* ── Carte de don ─────────────────────────────────────────────── */}
            <div className="col-12 col-lg-6">
              <div className="dn-card">

                {success ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <p style={{ fontSize: 52, margin: '0 0 12px' }}>🎉</p>
                    <h3 style={{ color: '#009650', fontWeight: 800, fontSize: 22, margin: '0 0 8px' }}>
                      Merci pour votre don !
                    </h3>
                    <p style={{ color: '#475569', fontSize: 15 }}>
                      Votre générosité de{' '}
                      <strong>{montantFinal.toLocaleString('fr')} HTG</strong>{' '}
                      <span style={{ color: '#009650' }}>(≈ ${toUSD(montantFinal)} USD)</span>{' '}
                      va changer des vies. Un reçu vous sera envoyé par email.
                    </p>
                    <button
                      onClick={() => {
                        setSuccess(false);
                        setInputValue('1000');
                        setMontant(1000);
                        setActiveBtn(1000);
                      }}
                      style={{
                        marginTop: 16, padding: '10px 24px', borderRadius: 10,
                        border: '2px solid #009650', background: '#fff',
                        color: '#009650', fontWeight: 700, cursor: 'pointer',
                      }}>
                      Faire un autre don
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="dn-card-header">
                      <h3 className="dn-card-title">Choisissez votre montant</h3>
                      <p className="dn-card-sub">
                        Sélectionnez un montant ou saisissez le vôtre (HTG)
                      </p>
                    </div>

                    {/* Montants prédéfinis */}
                    <div className="dn-amounts">
                      {MONTANTS.map(m => (
                        <button
                          key={m}
                          className={`dn-amount-btn ${activeBtn === m ? 'dn-amount-active' : ''}`}
                          onClick={() => handlePreset(m)}>
                          <span>{m.toLocaleString('fr')} HTG</span>
                          {/* ── Sous-label USD ── */}
                          <span style={{ fontSize: 10, opacity: .65, display: 'block', marginTop: 1 }}>
                            ≈ ${toUSD(m)}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Champ de saisie manuelle */}
                    <div style={{ marginTop: 14 }}>
                      <label className="dn-label" htmlFor="dn-montant-libre">
                        Ou saisissez votre montant (HTG)
                      </label>
                      <div style={{ position: 'relative', marginTop: 6 }}>
                        <input
                          id="dn-montant-libre"
                          type="text"
                          inputMode="numeric"
                          className="dn-input"
                          placeholder="Ex : 3 000"
                          value={inputValue === '0' ? '' : inputValue}
                          onChange={handleInput}
                          style={{ paddingRight: 56 }}
                        />
                        <span style={{
                          position: 'absolute', right: 14, top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#94a3b8', fontSize: 13, fontWeight: 600,
                          pointerEvents: 'none',
                        }}>
                          HTG
                        </span>
                      </div>
                      {/* Affichage USD sous le champ libre */}
                      {montantFinal >= 100 && (
                        <p style={{ color: '#009650', fontSize: 12, marginTop: 4, marginBottom: 0, fontWeight: 600 }}>
                          ≈ ${toUSD(montantFinal)} USD
                        </p>
                      )}
                      {inputValue && Number(inputValue) > 0 && Number(inputValue) < 100 && (
                        <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4, marginBottom: 0 }}>
                          Le montant minimum est de 100 HTG.
                        </p>
                      )}
                    </div>

                    {/* Fréquence */}
                    <div className="dn-freq-row" style={{ marginTop: 16 }}>
                      {['unique', 'mensuel'].map(f => (
                        <button
                          key={f}
                          className={`dn-freq-btn ${frequence === f ? 'dn-freq-active' : ''}`}
                          onClick={() => setFrequence(f)}>
                          {f === 'unique' ? 'Don unique' : 'Don mensuel'}
                        </button>
                      ))}
                    </div>

                    {/* Message optionnel */}
                    <div style={{ marginTop: 12 }}>
                      <label className="dn-label" htmlFor="dn-message">
                        Message (optionnel)
                      </label>
                      <textarea
                        id="dn-message"
                        rows={2}
                        className="dn-input"
                        placeholder="Laisser un message d'encouragement…"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        style={{ resize: 'none', marginTop: 6 }}
                      />
                    </div>

                    {/* Impact preview */}
                    <div className="dn-impact-preview">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="#009650" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      <span>
                        {IMPACTS[activeBtn] ?? (
                          isValid
                            ? `${montantFinal.toLocaleString('fr')} HTG = contribution précieuse`
                            : 'Entrez un montant pour voir son impact'
                        )}
                      </span>
                    </div>

                    {/* Bouton principal */}
                    <button
                      className="dn-btn-don"
                      disabled={!isValid}
                      onClick={() => setShowPay(true)}>
                      Faire un don de{' '}
                      <strong>
                        {isValid
                          ? `${montantFinal.toLocaleString('fr')} HTG (≈ $${toUSD(montantFinal)} USD)`
                          : '—'}
                      </strong>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </button>

                    <p className="dn-secure">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      Paiement 100 % sécurisé par Stripe — Reçu fiscal par email
                    </p>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <Agenda />

      {showPay && (
        <Elements stripe={stripePromise}>
          <StripeForm
            montant={montantFinal}
            frequence={frequence}
            message={message}
            onSuccess={handleSuccess}
            onCancel={() => setShowPay(false)}
          />
        </Elements>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Layout>
  );
};

export default Fairdon;