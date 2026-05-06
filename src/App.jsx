import { useState } from 'react'
import { BrowserRouter, Routes ,Route } from 'react-router-dom'
import Home from './components/Home'
import Contact from './components/Contact'
import Aboute from './components/Aboute'
import Fairdon from './components/Fairdon'
import Actualite from './components/Actualite'
import Lirearticle from './components/Lirearticle'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify/unstyled'
import Dashbord from './components/Admin/Dashbord'
import Parametres from './components/Admin/Parametres'
import User from './components/Admin/User'
import { AdminRequireAuth } from './components/Admin/context/AdminRequireAuth'
import Actualitead from './components/Admin/Actualitead'
import EditArticle from './components/Admin/EditArticle'
import ArticleList from './components/Admin/ArticleList'
import EventList from './components/Admin/EventList'
import EditEvent from './components/Admin/EditEvent'
import AddEvent from './components/Admin/AddEvent'
import Register from './components/register'
import EditAbout from './components/Admin/EditAbout'
import CreateAbout from './components/Admin/CreateAbout'
import AboutAdmin from './components/Admin/AboutAdmin'
import EditImpact from './components/Admin/EditImpact'
import EditUser from './components/Admin/EditUser'
import Statistiques from './components/Admin/Statistiques'
import AddSlide from './components/Admin/AddSlide'
import Hero from './components/common/Hero'
import Sliders from './components/Admin/sliders'
import EditSlide from './components/Admin/EditSlide'
import AddGalerie from './components/Admin/AddGalerie'
import Galerie from './components/Admin/Galerie'
import Galeries from './components/common/Galeries'
import Contacts from './components/common/Contacts'
import Agenda from './components/Agenda'
import Messages from './components/Admin/Messages'


function App() {

  return (
    <>
     <BrowserRouter>
     <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/contacts' element={<Contacts/>}/>
        <Route path='/aboute' element={<Aboute/>}/>
        <Route path='/fairdon' element={<Fairdon/>}/>
        <Route path='/actualite' element={<Actualite/>}/>
        <Route path='/lirearticle/:id' element={<Lirearticle/>}/>
        <Route path="/lireEvent/:id" element={<Event/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Register' element={<Register/>}/>
        <Route path="/galeries/:article_id" element={<Galeries />} />
        <Route path="/Agenda" element={<Agenda/>}/>
        
        
        
        {/* administration du site web */}
        <Route path='/Admin/dashbord' element={
                 
              <Dashbord/>
          }/>
        <Route path='/Admin/Parametres' element={<Parametres/>}/>
        <Route path='/Admin/User' element={<User/>}/>
        <Route path='/Admin/Actualitead' element={<Actualitead/>}/>
        <Route path='/Admin/EditArticle/:id' element={<EditArticle/>}/>
        <Route path='/Admin/ArticleList' element={<ArticleList/>}/>
        <Route path='/Admin/EventList' element={<EventList/>}/>
        <Route path='/Admin/EditEvenement/:id' element={<EditEvent/>}/>
        <Route path='/Admin/AddEvenement' element={<AddEvent/>}/>
        <Route path='/Admin/EditAbout/:id' element={<EditAbout/>}/>
        <Route path='/Admin/CreateAbout' element={<CreateAbout/>}/>
        <Route path='/Admin/AboutAdmin' element={<AboutAdmin/>}/>
        <Route path='/Admin/EditImpact/:id' element={<EditImpact/>}/>
        <Route path='/Admin/EditUser/:id' element={<EditUser/>}/>
        <Route path='/Admin/Statistiques' element={<Statistiques/>}/>
        <Route path='/Admin/AddSlide' element={<AddSlide/>}/>
        <Route path='/Admin/Sliders' element={<Sliders/>}/>
        <Route path='/Admin/EditSlide/:id' element={<EditSlide/>}/>
        <Route path='/Admin/AddGalerie' element={<AddGalerie/>}/>
        <Route path="/Admin/galeries" element={<Galerie/>} />
        <Route path="/Admin/Messages" element={<Messages/>} />
       


      </Routes>
     </BrowserRouter>
     <ToastContainer/>
    </>
  )
}

export default App
