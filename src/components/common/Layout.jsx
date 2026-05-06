import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Hero from './Hero'

const Layout = ({children}) => {
  return (
    <>
    <Header/>
    <Hero/>
   {children}
    <Footer/>
    </>
  )
}

export default Layout
