import React, { useState } from 'react'
import Layout from './common/Layout'
import imagelogo from '../assets/images/logo.jpg'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import {
  BsPerson, BsPersonBadge, BsEnvelope, BsTelephone,
  BsLock, BsShieldLock, BsPersonPlus, BsGeoAlt,
  BsEye, BsEyeSlash                               // ← ajouter
} from 'react-icons/bs'

const Register = () => {

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm()

  const navigate  = useNavigate()
  const password  = watch('password')

  const [showPassword,        setShowPassword]        = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [checkingEmail,       setCheckingEmail]       = useState(false)
  const [submitting,          setSubmitting]          = useState(false)

  // ── Vérification email en temps réel (onBlur) ──────────────────────────────
  const checkEmailExists = async (email) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    try {
      setCheckingEmail(true)
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}check-email`,
        { email }
      )
      if (data.exists) {
        setError('email', {
          type: 'manual',
          message: 'Cet e-mail est déjà utilisé'
        })
      }
    } catch {
      // silencieux
    } finally {
      setCheckingEmail(false)
    }
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}register`,
        data
      )
      const result = response.data

      if (result.status === true) {
        toast.success('Compte créé avec succès ! Connectez-vous.')
        navigate('/Login')                          // ← redirige vers Login
      } else {
        toast.error(result.message || 'Erreur lors de l\'inscription')
      }

    } catch (error) {
      if (error.response?.data?.errors) {
        const allErrors = error.response.data.errors
        if (allErrors.email) {
          setError('email', { type: 'manual', message: 'Cet e-mail est déjà utilisé' })
          toast.error('Cet e-mail est déjà utilisé')
        } else {
          Object.keys(allErrors).forEach((key) => toast.error(allErrors[key][0]))
        }
      } else {
        toast.error('Erreur serveur')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-9 col-lg-6">
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-body p-4 p-md-5">

                  {/* Header */}
                  <div className="text-center mb-4">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
                      style={{ width: 85, height: 85 }}
                    >
                      <img src={imagelogo} width={60} className="rounded-circle" alt="Logo" />
                    </div>
                    <h2 className="fw-bold mb-1">Créer un compte</h2>
                    <p className="text-muted small">Rejoignez la plateforme dès maintenant.</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>

                    {/* Prénom + Nom */}
                    <div className="row">

                      {/* Prénom */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Prénom</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white border-end-0">
                            <BsPerson className="text-muted" />
                          </span>
                          <input
                            type="text"
                            className={`form-control border-start-0 ps-0 ${errors.firstname ? 'is-invalid' : ''}`}
                            placeholder="Jean"
                            {...register('firstname', { required: 'Le prénom est obligatoire' })}
                          />
                          {errors.firstname && (
                            <div className="invalid-feedback">{errors.firstname.message}</div>
                          )}
                        </div>
                      </div>

                      {/* Nom */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Nom</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white border-end-0">
                            <BsPersonBadge className="text-muted" />
                          </span>
                          <input
                            type="text"
                            className={`form-control border-start-0 ps-0 ${errors.lastname ? 'is-invalid' : ''}`}
                            placeholder="Paul"
                            {...register('lastname', { required: 'Le nom est obligatoire' })}
                          />
                          {errors.lastname && (
                            <div className="invalid-feedback">{errors.lastname.message}</div>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Adresse e-mail</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          {checkingEmail
                            ? <span className="spinner-border spinner-border-sm text-muted" />
                            : <BsEnvelope className="text-muted" />
                          }
                        </span>
                        <input
                          type="email"
                          className={`form-control border-start-0 ps-0 ${errors.email ? 'is-invalid' : ''}`}
                          placeholder="exemple@gmail.com"
                          {...register('email', {
                            required: 'Email obligatoire',
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'Email invalide'
                            }
                          })}
                          onBlur={(e) => checkEmailExists(e.target.value)}  // ← vérification onBlur
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email.message}</div>
                        )}
                      </div>
                    </div>

                    {/* Téléphone */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Numéro de téléphone</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <BsTelephone className="text-muted" />
                        </span>
                        <input
                          type="number"
                          className={`form-control border-start-0 ps-0 ${errors.numero ? 'is-invalid' : ''}`}
                          placeholder="+509XXXXXXXX"
                          {...register('numero', { required: 'Le numéro est obligatoire' })}
                        />
                        {errors.numero && (
                          <div className="invalid-feedback">{errors.numero.message}</div>
                        )}
                      </div>
                    </div>

                    {/* ── Adresse ── (nouveau champ) */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Adresse</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <BsGeoAlt className="text-muted" />
                        </span>
                        <input
                          type="text"
                          className={`form-control border-start-0 ps-0 ${errors.adresse ? 'is-invalid' : ''}`}
                          placeholder="Rue, Ville, Pays"
                          {...register('adresse', { required: 'L\'adresse est obligatoire' })}
                        />
                        {errors.adresse && (
                          <div className="invalid-feedback">{errors.adresse.message}</div>
                        )}
                      </div>
                    </div>

                    {/* Mot de passe */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Mot de passe</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <BsLock className="text-muted" />
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className={`form-control border-start-0 border-end-0 ps-0 ${errors.password ? 'is-invalid' : ''}`}
                          placeholder="Votre mot de passe"
                          {...register('password', {
                            required: 'Mot de passe obligatoire',
                            pattern: {
                              value: /^(?=.*[A-Z])(?=.*[@$!%*#?&]).{8,}$/,
                              message: 'Min 8 caractères, 1 majuscule et 1 caractère spécial'
                            }
                          })}
                        />
                        <button
                          type="button"
                          className="input-group-text bg-white border-start-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword
                            ? <BsEyeSlash className="text-muted" />
                            : <BsEye className="text-muted" />
                          }
                        </button>
                        {errors.password && (
                          <div className="invalid-feedback">{errors.password.message}</div>
                        )}
                      </div>
                    </div>

                    {/* Confirmer mot de passe */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Confirmer le mot de passe</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <BsShieldLock className="text-muted" />
                        </span>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className={`form-control border-start-0 border-end-0 ps-0 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                          placeholder="Confirmez votre mot de passe"
                          {...register('confirmPassword', {
                            required: 'Veuillez confirmer votre mot de passe',
                            validate: value => value === password || 'Les mots de passe ne correspondent pas'
                          })}
                        />
                        <button
                          type="button"
                          className="input-group-text bg-white border-start-0"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword
                            ? <BsEyeSlash className="text-muted" />
                            : <BsEye className="text-muted" />
                          }
                        </button>
                        {errors.confirmPassword && (
                          <div className="invalid-feedback">{errors.confirmPassword.message}</div>
                        )}
                      </div>
                    </div>

                    {/* Bouton submit */}
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2 fw-semibold rounded-3"
                      disabled={submitting || checkingEmail}
                    >
                      {submitting
                        ? <><span className="spinner-border spinner-border-sm me-2" />Création en cours...</>
                        : <><BsPersonPlus className="me-2" />Créer un compte</>
                      }
                    </button>

                    {/* Footer */}
                    <div className="text-center mt-4">
                      <p className="text-muted small mb-0">
                        Vous avez déjà un compte ?{' '}
                        <a href="/Login" className="text-primary fw-semibold text-decoration-none">
                          Se connecter
                        </a>
                      </p>
                    </div>

                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Register