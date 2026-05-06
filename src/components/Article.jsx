import React, { useState, useEffect } from 'react';
import image1 from './../assets/images/banner.jpg';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Article = () => {

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    ArticlesRequest();
  }, []);

  const ArticlesRequest = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}Article`);

      console.log("API RESPONSE:", res.data);

      //  adapte selon mon API Laravel
      setArticles(res.data.data || res.data.Article || []);

    } catch (error) {
      console.error("Erreur API:", error);
    }
  };
 const url = (path) => path ? `${import.meta.env.VITE_BACKEND_URL_IMAGES}${path}` : null
 const formatDate = (date) => {
  if (!date) return "Date inconnue";

  const d = new Date(date);

  if (isNaN(d)) return "Date invalide";

  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

  return (
    <>
      {/* ===== SECTION 3 — Nouveaux articles ===== */}
      <section className="section-3 py-5">
        <div className="container-fluid px-4">

          <div className="section-header mb-4">
            <h3 className="section-title">
              Nouveaux Articles ({articles.length})
            </h3>
            <div className="section-divider" />
          </div>

          <div className="row g-4">
            {articles.length > 0 ? (
              articles.map((article) => (
                <div className="col-12 col-sm-6 col-lg-3" key={article.id}>
                  <div className="card-article">

                    <div className="card-img-wrapper">
                      <img
                        src={url(article.image)|| image1}
                        alt={article.titre}
                      />
                    </div>

                    <div className="card-body">
                      <span className="badge-category">
                        {article.categorie || "Culture"}
                      </span>

                      <h5 className="card-title">
                        {article.titre}
                      </h5>

                      <p className="card-excerpt">
                      {
                        article.description1
                          ? article.description1.slice(0, 130) +
                            (article.description1.length > 130 ? "..." : "")
                          : "Aucune description"
                      }

                      </p>

                      <div className="card-footer-row">
                        <div className="author">
                          <div className="avatar">
                            {article.auteur ? article.auteur[0] : "A"}
                          </div>
                          <div>
                            <p className="author-name">
                              {article.auteur || "Rédaction"}
                            </p>
                            <p className="author-date">
                           {formatDate(article.created_at)|| "Date inconnue"}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/lirearticle/${article.id}`}
                          className="read-more"
                        >
                          Voir plus →
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Chargement des articles...</p>
            )}
          </div>

        </div>
      </section>
    </>
  );
};

export default Article;
