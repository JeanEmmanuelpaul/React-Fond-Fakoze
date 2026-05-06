import React from 'react'

const Impact = () => {
  return (
    <>
      {/* ===== SECTION STATS ===== */}
<section className="section-stats py-5 bg-light">
  <div className="container px-3">
    <span className="badge-category mb-2">Impact</span>
    <h3 className="section-title">Notre impact en chiffres</h3>
    <div className="section-divider mb-4" />
    <div className="row g-3">
      {[
        { num: "5 200+", label: "Membres actifs" },
        { num: "120",    label: "Projets réalisés" },
        { num: "14",     label: "Années d'expérience" },
        { num: "38",     label: "Partenaires" },
      ].map((s, i) => (
        <div className="col-6 col-md-3" key={i}>
          <div className="stat-card text-center">
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
    </>
  )
}

export default Impact
