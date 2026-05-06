import React from 'react'
import HeaderAdmin from './HeaderAdmin'

const AdminLayout = (
   {children}
) => {
  return (
    <>
   <HeaderAdmin/>
      {children}
    </>
  )
}

export default AdminLayout
