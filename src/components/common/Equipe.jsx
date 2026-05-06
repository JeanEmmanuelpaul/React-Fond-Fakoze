import React from 'react'

const Equipe = () => {
  return (
    <>
      
{/* ===== SECTION ÉQUIPE ===== */}
<section className="section-team py-5">
  <div className="container px-3">
    <span className="badge-category mb-2">Équipe</span>
    <h3 className="section-title">Notre équipe dirigeante</h3>
    <div className="section-divider mb-4" />
    <div className="row g-3">
      {[
        { initials: "MJ", name: "Marie Joseph",  role: "Directrice générale",  bg: "#E6F1FB", color: "#185FA5" },
        { initials: "PD", name: "Pierre Dorval", role: "Coordinateur projets", bg: "#E1F5EE", color: "#0F6E56" },
        { initials: "SA", name: "Sophie Auguste",role: "Responsable comm.",    bg: "#FAEEDA", color: "#854F0B" },
        { initials: "JB", name: "Jean Baptiste", role: "Trésorier",            bg: "#FBEAF0", color: "#993556" },
      ].map((t, i) => (
        <div className="col-6 col-md-3" key={i}>
          <div className="team-card text-center">
            <div className="team-avatar mx-auto mb-2" style={{ background: t.bg, color: t.color }}>{t.initials}</div>
            <h5>{t.name}</h5>
            <p>{t.role}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

    </>
  )
}

export default Equipe
