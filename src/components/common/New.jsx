import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const New = () => {
  const [articleLast, setArticleLast] = useState(null)
  const [loading, setLoading]         = useState(true)
  const navigate                      = useNavigate()

  useEffect(() => {
    getLatestArticle()
  }, [])

  const getLatestArticle = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}latest-article`)
      console.log("Latest article response:", res.data)
      const data = res.data?.Article ?? res.data?.data ?? res.data
      setArticleLast(data)
    } catch (error) {
      console.error("Erreur dernier article:", error)
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
      <h4 className="ar-sidebar-title">News</h4>

      {/* ── Loader ── */}
      {loading && (
        <div className="d-flex align-items-center gap-2 text-muted small py-2">
          <span className="spinner-border spinner-border-sm" />
          Chargement...
        </div>
      )}

      {/* ── Pas de données ── */}
      {!loading && !articleLast && (
        <p className="text-muted small">Aucune actualité disponible.</p>
      )}

      {/* ── Article cliquable ── */}
      {!loading && articleLast && (
        <div
          className="ar-news-item"
          onClick={() => navigate(`/lireArticle/${articleLast.id}&&${articleLast.titre}`)}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={
              articleLast.image
                ? `${import.meta.env.VITE_BACKEND_URL_IMAGES}${articleLast.image}`
                : image1
            }
            alt={articleLast.titre || "News"}
            className="ar-news-thumb"
            onError={(e) => { e.target.src = image1 }}
          />
          <div>
            <p className="ar-news-tag">{articleLast.categorie || "Actualité"}</p>
            <p className="ar-news-headline">{articleLast.titre}</p>
            <p className="ar-news-date">{formatDate(articleLast.created_at)}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default New