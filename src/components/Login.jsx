import React, { useState } from 'react'
import Layout from './common/Layout'
import imagelogo from '../assets/images/logo.jpg'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)

  // Submit
  const onSubmit = async (data) => {

    console.log(data)

    try {

      // API LOGIN
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}login`,
        data
      )

      const result = response.data

      console.log(result)

      // Succès connexion
      if (result.status === true) {

        toast.success('Connexion réussie')

        // Sauvegarde user
        localStorage.setItem(
          'adminInfo',
          JSON.stringify({
            token: result.token,
            user: result.user,
            role: result.role
          })
        )

        // Vérification rôle
        if (result.role === 'admin') {

          navigate('/Admin/dashbord')

        } else {

          navigate('/')

        }

      } else {

        toast.error(result.message || 'Erreur de connexion')

      }

    } catch (error) {

      console.log(error)

      // Erreurs Laravel
      if (error.response?.data?.message) {

        toast.error(error.response.data.message)

      } else if (error.response?.data?.errors) {

        const allErrors = error.response.data.errors

        Object.keys(allErrors).forEach((key) => {
          toast.error(allErrors[key][0])
        })

      } else {

        toast.error('Erreur serveur')

      }
    }
  }

  return (
    <Layout>

      <div className='py-4'></div>

      <div className="min-vh-98 d-flex align-items-center justify-content-center bg-light py-2">

        <div className="container">

          <div className="row justify-content-center">

            <div className="col-12 col-sm-10 col-md-8 col-lg-5">

              {/* Card */}
              <div className="card border-0 shadow-lg rounded-4">

                <div className="card-body p-4 p-md-5">

                  {/* Header */}
                  <div className="text-center mb-4">

                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
                      style={{ width: 80, height: 80 }}
                    >
                      <img
                        src={imagelogo}
                        width={60}
                        className="rounded-circle"
                        alt="Logo"
                      />
                    </div>

                    <h2 className="fw-bold mb-1">
                      Connexion
                    </h2>

                    <p className="text-muted small">
                      Bienvenue ! Veuillez vous connecter à votre compte.
                    </p>

                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>

                    {/* Email */}
                    <div className="mb-3">

                      <label
                        htmlFor="email"
                        className="form-label fw-semibold"
                      >
                        Adresse e-mail
                      </label>

                      <div className="input-group has-validation">

                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-envelope text-muted"></i>
                        </span>

                        <input
                          {...register('email', {
                            required: "L'adresse e-mail est obligatoire.",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message:
                                "Veuillez entrer une adresse e-mail valide.",
                            },
                          })}
                          type="email"
                          id="email"
                          className={`form-control border-start-0 ps-0 ${errors.email ? 'is-invalid' : ''
                            }`}
                          placeholder="exemple@domaine.com"
                          autoComplete="email"
                        />

                        {errors.email && (
                          <div className="invalid-feedback">
                            {errors.email.message}
                          </div>
                        )}

                      </div>

                    </div>

                    {/* Password */}
                    <div className="mb-3">

                      <div className="d-flex justify-content-between align-items-center">

                        <label
                          htmlFor="password"
                          className="form-label fw-semibold mb-0"
                        >
                          Mot de passe
                        </label>

                        <a
                          href="/forgot-password"
                          className="small text-primary text-decoration-none"
                        >
                          Mot de passe oublié ?
                        </a>

                      </div>

                      <div className="input-group has-validation mt-1">

                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-lock text-muted"></i>
                        </span>

                        <input
                          {...register('password', {
                            required: 'Le mot de passe est obligatoire.',
                          })}
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          className={`form-control border-start-0 border-end-0 ps-0 ${errors.password ? 'is-invalid' : ''
                            }`}
                          placeholder="Votre mot de passe"
                          autoComplete="current-password"
                        />

                        <button
                          type="button"
                          className="input-group-text bg-white border-start-0"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          <i
                            className={`bi ${showPassword
                                ? 'bi-eye-slash'
                                : 'bi-eye'
                              } text-muted`}
                          ></i>
                        </button>

                        {errors.password && (
                          <div className="invalid-feedback">
                            {errors.password.message}
                          </div>
                        )}

                      </div>

                    </div>

                    {/* Remember */}
                    <div className="mb-4">

                      <div className="form-check">

                        <input
                          {...register('remember')}
                          type="checkbox"
                          id="remember"
                          className="form-check-input"
                        />

                        <label
                          htmlFor="remember"
                          className="form-check-label text-muted small"
                        >
                          Se souvenir de moi
                        </label>

                      </div>

                    </div>

                    {/* Button */}
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2 fw-semibold rounded-3"
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Se connecter
                    </button>

                    {/* Divider */}
                    <div className="position-relative my-4 text-center">

                      <hr className="my-0" />

                      <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                        ou
                      </span>

                    </div>

                    {/* Register */}
                    <p className="text-center text-muted small mb-0">

                      Vous n'avez pas de compte ?{' '}

                      <a
                        href="/register"
                        className="text-primary fw-semibold text-decoration-none"
                      >
                        Créer un compte
                      </a>

                    </p>

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

export default Login
