import React from 'react'

const Missons = () => {
  return (
    <>
      
{/* ===== SECTION MISSIONS ===== */}
<section className="section-missions py-5">
  <div className="container px-3">
    <span className="badge-category mb-2">Missions</span>
    <h3 className="section-title">Ce que nous faisons</h3>
    <div className="section-divider mb-4" />
    <div className="row g-3">
      {[
        { icon: "📚", title: "Éducation",      color: "#E6F1FB", text: "Programmes de formation et bourses pour les jeunes défavorisés." },
        { icon: "🤝", title: "Solidarité",     color: "#E1F5EE", text: "Aide humanitaire et soutien aux familles en situation précaire." },
        { icon: "🌱", title: "Environnement",  color: "#FAEEDA", text: "Actions locales pour un développement durable et responsable." },
        { icon: "💬", title: "Sensibilisation",color: "#FBEAF0", text: "Campagnes de communication et plaidoyer pour les droits fondamentaux." },
      ].map((m, i) => (
        <div className="col-12 col-sm-6 col-lg-3" key={i}>
          <div className="mission-card">
            <div className="mission-icon" style={{ background: m.color }}>{m.icon}</div>
            <h5>{m.title}</h5>
            <p>{m.text}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
    </>
  )
}

export default Missons
