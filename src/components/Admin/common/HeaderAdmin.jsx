import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import logo from '../../../assets/images/logo.jpg'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import axios from 'axios'

const HeaderAdmin = () => {


  return (

    <>
      <header className='shadow'>

        <Navbar expand="lg" className="bg-body-tertiary">

          <Container fluid>

            <Navbar.Brand href="#">
              <img
                src={logo}
                alt="FAKOZE"
                width={50}
              />
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="navbarScroll" />

            <Navbar.Collapse id="navbarScroll">

              <Nav
                className="me-auto my-2 my-lg-0 gap-4"
                style={{ maxHeight: '100px' }}
                navbarScroll
              >

                <Nav.Link href="/Admin/dashbord">
                  Dashboard
                </Nav.Link>

                <Nav.Link href="/Admin/Statistiques">
                  Statistique
                </Nav.Link>

                <Nav.Link href="/Admin/User">
                  Utilisateur
                </Nav.Link>



 <NavDropdown
                  title="Contenu"
                  id="navbarScrollingDropdown"
                >
                   <NavDropdown.Item href="/Admin/ArticleList">
                     Voir les Article
                   </NavDropdown.Item>
                   <NavDropdown.Divider />

                    <NavDropdown.Item href="/Admin/Actualitead">
                     Ajouter Article
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                
                   <NavDropdown.Item href="/Admin/EventList">
                      Voir les Evenement
                   </NavDropdown.Item>
                   <NavDropdown.Divider />

                   <NavDropdown.Item href="/Admin/AddEvenement">
                    Ajouter Events
                   </NavDropdown.Item>
                   <NavDropdown.Divider />
                 
                  <NavDropdown.Item href="/Admin/galeries">
                    Voir Galerie Article
                  </NavDropdown.Item>
                  <NavDropdown.Divider />

                  <NavDropdown.Item href="/Admin/AddGalerie">
                   Ajouter Galerie Article
                  </NavDropdown.Item>
                
 </NavDropdown>





     <NavDropdown
                  title="Plus Option"
                  id="navbarScrollingDropdown"
                >
                 <NavDropdown.Item href="/Admin/Sliders">
                  Voir Slider Banner
                  </NavDropdown.Item>
                  <NavDropdown.Divider />

                  <NavDropdown.Item href="/Admin/AddSlide">
                  Add Slider Banner
                  </NavDropdown.Item>

                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/Admin/AboutAdmin">
                    Apropos
                  </NavDropdown.Item>
                  <NavDropdown.Divider />

                 <NavDropdown.Item href="/Admin/EditImpact/1">
                    Voir les Impact
                  </NavDropdown.Item>
                  <NavDropdown.Divider />

                  <NavDropdown.Item href="/Admin/EditImpact/1">
                    Modifier les Impact
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item href="#action4">
                    Témoignages
                  </NavDropdown.Item>

    </NavDropdown>

                <Nav.Link href="/Admin/Messages">
                 Messages
                </Nav.Link>

                <Nav.Link href="/Admin/EventList">
                 Nos Dons 
                </Nav.Link>

                <Nav.Link href="/Admin/Parametres">
                  Paramètres
                </Nav.Link>

              </Nav>

              {/* Affichage firstname */}
              <div className="d-flex align-items-center gap-2">

                <i className="bi bi-person-circle fs-5"></i>

                <span className="fw-semibold text-capitalize">

                  {/* {profile?.firstname
                    ? `Bienvenue ${profile.firstname}`
                    : 'Chargement...'} */}

                </span>

              </div>

            </Navbar.Collapse>

          </Container>

        </Navbar>

      </header>
    </>
  )
}

export default HeaderAdmin
