import React, { useState, useEffect } from 'react';
import Layout from './common/Layout';
import image1 from '../assets/images/banner.jpg';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import New from './common/New';
import Galerie from './common/Galeries';
import Events from './common/Events';
 
const Lirearticle = () => {
 
  const { id } = useParams();
 
  const [article, setArticle]       = useState(null);
  const [loading, setLoading]       = useState(true);
 
  // ── Fetch article courant ─────────────────────────────────────────────────
  useEffect(() => {
    getArticle();
  }, [id]);
 

  // ── FUNCTIONS ─────────────────────────────────────────────────────────────
 
  const getArticle = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}Article/${id}`);
      console.log("Article response:", res.data);
 
      // ✅ Laravel retourne { Article: {...}, Status: 200 }
      const data = res.data?.Article ?? res.data?.data ?? res.data;
      setArticle(data);
 
    } catch (error) {
      console.error("Erreur article:", error);
    } finally {
      setLoading(false);
    }
  };
 
 
 
  const formatDate = (date) => {
    if (!date) return "Date inconnue";
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
 
  // ── Loader ────────────────────────────────────────────────────────────────
  if (loading) return (
    <Layout>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: 48, height: 48 }} role="status" />
          <p className="text-muted">Chargement de l'article...</p>
        </div>
      </div>
    </Layout>
  );
 
  // ── Pas de données ────────────────────────────────────────────────────────
  if (!article) return (
    <Layout>
      <div className="text-center py-5">
        <div style={{ fontSize: 64 }}>📭</div>
        <h4 className="mt-3 text-muted">Article introuvable</h4>
      </div>
    </Layout>
  );
  return (
    <>
    <Layout>
      <div className=" py-5" ></div>
 <div className="ar-hero-img" >
     {article.image && (
              <div className="mb-4">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL_IMAGES}${article.image}`}
                  alt={article.titre}
                  className="img-fluid rounded-3 w-100"
                  style={{ maxHeight: 500, objectFit: 'cover' }}
                />
              </div>
            )}
 
</div>
 
<div class="container ar-wrapper">
  <div class="row g-5">
 
    <div class="col-12 col-lg-8">
 
     
      <div class="ar-langs">
        <a href="#" class="ar-lang-btn">عربي</a>
        <a href="#" class="ar-lang-btn">中文</a>
        <a href="#" class="ar-lang-btn ar-lang-active">Français</a>
        <a href="#" class="ar-lang-btn">Русский</a>
        <a href="#" class="ar-lang-btn">Español</a>
      </div>
 
     
      <h1 class="ar-title">
           {article.titre}  </h1>
 
  
      <div class="ar-meta">
        <span class="ar-meta-date">{formatDate(article.created_at)}</span>
        <span class="ar-meta-sep">|</span>
        <span class="ar-meta-type">{article.auteur || "Rédaction"}</span>
        <span class="ar-meta-sep">|</span>
        <span class="ar-meta-loc">  {article.lieu || "Haiti_"}</span>
        <span class="ar-meta-sep">|</span>
        <span class="ar-meta-read">Genre: {article.categorie || "Culture"}</span>
      </div>
 
   
      <div class="ar-body">
 
        <p>
          {article.description1 || "Aucune description"}      </p>
 
       
 
        <blockquote class="ar-quote">
          " {article.sou_description1 || "Aucune sou_description"}"
        </blockquote>
 
        <p>
           {article.description2 || "Aucune description"} 
        </p>
 
        <blockquote class="ar-quote">
          "  {article.sou_description2 || "Aucune sou_description"} "
        </blockquote>
 
        <p>
            {article.description3 || "Aucune description"} 
        </p>

        <h2 class="ar-subtitle">{article.resume}</h2>
   
        <h3 class="ar-action-title">{article.resume}</h3>
      
          <p>
            {article.resumearticle || "Aucune description"} 
        </p>
        
        <Galerie/>
      </div>
    </div>
 
    
    <div class="col-12 col-lg-4">
      <div class="ar-sidebar">
 
      
        <div class="ar-sidebar-block">
          <h4 class="ar-sidebar-title">Media Contacts</h4>
 
          <div class="ar-contact-item">
            <div class="ar-contact-avatar">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#009650" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <p class="ar-contact-name">WHO Media Team</p>
              <p class="ar-contact-org">World Health Organization</p>
              <p class="ar-contact-email">Email: <a href="mailto:mediainquiries@who.int">mediainquiries@who.int</a></p>
            </div>
          </div>
 
          <div class="ar-contact-item">
            <div class="ar-contact-avatar">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#009650" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <p class="ar-contact-name">Fallon Bwatu Mbuyi</p>
              <p class="ar-contact-org">Communications Officer</p>
              <p class="ar-contact-email">Email: <a href="mailto:bwatuj@who.int">bwatuj@who.int</a></p>
            </div>
          </div>
 
          <div class="ar-contact-item ar-contact-item--simple">
            <div>
              <p class="ar-contact-name">Tunga Namjilsuren</p>
              <p class="ar-contact-org">Unit Head</p>
              <p class="ar-contact-email">Email: <a href="mailto:namjilsurent@who.int">namjilsurent@who.int</a></p>
            </div>
          </div>
        </div>
 
     
        <div class="ar-sidebar-block">
          <h4 class="ar-sidebar-title">Related</h4>
          <ul class="ar-related-list">
            <li><a href="#">One Health Summit, 5-7 April 2026, Lyon, France</a></li>
            <li><a href="#">Key WHO side events during the One Health Festival</a></li>
            <li><a href="#">One Health Initiative</a></li>
          </ul>
        </div>
 
     
       <New/>
      
       
       <Events/>
 
      </div>
    </div>
 
  </div>
</div>
   
    </Layout>
    </>
  )
}

export default Lirearticle
