import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import logo from '../../assets/images/logo.jpg'
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom'
const Header = () => {

  
  return (

       <header className='shadow'>
          
                  <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
              <Navbar.Brand href="#"><img src={logo} alt="FAKOZE" width={50}  /></Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll">
                <Nav
                  className="me-auto my-2 my-lg-0   gap-4"
                  style={{ maxHeight: '100px' }}
                  navbarScroll
                >
                  <Nav.Link href="/">Accueil</Nav.Link>
                  <Nav.Link href="/Aboute">À propos</Nav.Link>
                   <Nav.Link href="/Actualite">Actualités</Nav.Link>
                  <NavDropdown title="Nos services" id="navbarScrollingDropdown">
                    <NavDropdown.Item href="#action4">
                      Notre équipe
                    </NavDropdown.Item>
      
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                     Partenaires 
                    </NavDropdown.Item>
                      <NavDropdown.Divider />
                     <NavDropdown.Item href="#action4">
                      Témoignages
                    </NavDropdown.Item>
      
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                    </NavDropdown.Item>
                  </NavDropdown>
                   <Nav.Link href="/Contact"> Contact</Nav.Link>
                   <Nav.Link href="/Fairdon">  Faire un don</Nav.Link>
                </Nav>
                
                <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                  />
                  <Button variant="outline-success">Search</Button>
                </Form>
              </Navbar.Collapse>
            </Container>
          </Navbar>          
           </header>
      
         

  )
}

export default Header
