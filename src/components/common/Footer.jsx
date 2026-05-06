import React from 'react'

const Footer = () => {
  return (
<footer className="footer-site pt-5 pb-3">
  <div className="container px-3">
    <div className="row g-4 pb-5">
      
      {/* Colonne 1: À propos / Logo */}
      <div className="col-lg-4">
        <div className="footer-brand mb-3">
          <h4 className="footer-logo">Fanm Kole Zepol</h4>
          <div className="section-divider" />
        </div>
        <p className="footer-desc">
          Depuis 2010, nous œuvrons pour un avenir meilleur à travers 
          l'inclusion et le développement communautaire durable en Haïti.
        </p>
        <div className="footer-socials d-flex gap-3">
          <a href="#" className="social-link">FB</a>
          <a href="#" className="social-link">IG</a>
          <a href="#" className="social-link">TW</a>
        </div>
      </div>

      {/* Colonne 2: Liens Rapides */}
      <div className="col-6 col-lg-2 offset-lg-1">
        <h5 className="footer-title">Navigation</h5>
        <ul className="footer-links list-unstyled">
          <li><a href="/">Accueil</a></li>
          <li><a href="/apropos">À propos</a></li>
          <li><a href="/missions">Missions</a></li>
          <li><a href="/evenements">Événements</a></li>
        </ul>
      </div>

      {/* Colonne 3: Support */}
      <div className="col-6 col-lg-2">
        <h5 className="footer-title">Engagement</h5>
        <ul className="footer-links list-unstyled">
          <li><a href="/rejoindre">Nous rejoindre</a></li>
          <li><a href="/don">Faire un don</a></li>
          <li><a href="/partenariat">Partenaires</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>

      {/* Colonne 4: Infos Légales */}
      <div className="col-lg-3">
        <h5 className="footer-title">Siège Social</h5>
        <p className="footer-info">
          12 Rue Capois, Port-au-Prince<br />
          Haiti, HT6110<br />
          <strong>T:</strong> +509 3700-0000
        </p>
      </div>
    </div>

    {/* Barre de Copyright */}
    <div className="footer-bottom border-top pt-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 text-center text-md-start">
        <p className="mb-0 copyright-text">
          © {new Date().getFullYear()} <strong>Fanm Kole Zepol</strong>. Tous droits réservés.
        </p>
        <p className="mb-0 powered-by">
          Powered by <span className="nobless-text">NOBLESS COMMUNITY</span>
        </p>
      </div>
    </div>
  </div>
</footer>

  )
}

export default Footer
