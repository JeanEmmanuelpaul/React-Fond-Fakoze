import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import image1 from '../../assets/images/banner.jpg'

const Events = () => {
  const [eventLast, setEventLast] = useState(null)
  const [loading, setLoading]     = useState(true)
  const navigate                  = useNavigate()

  useEffect(() => {
    getLatestEvent()
  }, [])

  const getLatestEvent = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}Latest-Event`)
      console.log("Latest event response:", res.data)
      const data = res.data?.event ?? res.data?.data ?? res.data
      setEventLast(data)
    } catch (error) {
      console.error("Erreur dernier event:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return "Date inconnue"
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="ar-sidebar-block">
      <h4 className="ar-sidebar-title">Events</h4>

      {/* ── Loader ── */}
      {loading && (
        <div className="d-flex align-items-center gap-2 text-muted small py-2">
          <span className="spinner-border spinner-border-sm" />
          Chargement...
        </div>
      )}

      {/* ── Pas de données ── */}
      {!loading && !eventLast && (
        <p className="text-muted small">Aucun événement disponible.</p>
      )}

      {/* ── Event cliquable ── */}
      {!loading && eventLast && (
        <div
          className="ar-news-item"
          onClick={() => navigate(`lireEvent/${eventLast.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={
              eventLast.image
                ? `${import.meta.env.VITE_BACKEND_URL_IMAGES}${eventLast.image}`
                : image1
            }
            alt={eventLast.titre || "Event"}
            className="ar-news-thumb"
            onError={(e) => { e.target.src = image1 }}
          />
          <div>
            <p className="ar-news-tag">{eventLast.categorie || "Événement"}</p>
            <p className="ar-news-headline">{eventLast.titre}</p>
            <p className="ar-news-date">{formatDate(eventLast.created_at)}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Events