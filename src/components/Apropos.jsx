import React from 'react'
import image1 from './../assets/images/banner.jpg'
const Apropos = () => {
  return (
    <>
      <section className="section-1 py-5">
        <div className="container-fluid px-4 ">
          <div className="info-block row align-items-center g-4">
      
            <div className="col-md-4">
              <div className="info-img-wrapper">
                <img src={image1} alt="À propos" />
              </div>
            </div>
            <div className="col-md-8">
              <div className="info-content">
                <span className="badge-category mb-3">À propos</span>
                <h3 className="info-title">Qui Nous Sommes</h3>
                <p className="info-text">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit eveniet ut
                  voluptate et, at nostrum quod, aliquam facere sapiente laborum ea ratione
                  dolores distinctio nobis saepe incidunt quaerat, ad eaque! Lorem ipsum dolor
                  sit amet consectetur adipisicing elit. At veniam expedita quasi earum ab
                  temporibus culpa illo debitis, eveniet quibusdam libero quis non ad, magni
                  reiciendis molestias quod ex dignissimos?
                </p>
                <a href="/apropos" className="btn-apropos">À propos →</a>
              </div>
            </div>
      
          </div>
        </div>
      </section>
    </>
  )
}

export default Apropos
