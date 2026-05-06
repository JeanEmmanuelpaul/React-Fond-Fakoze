import { Children, createContext,useState } from "react";

 export const AdminAuthContext =createContext();

 export const AdminAuthProvider =({Children})=>
 {
       const AdminInfo = localStorage.getItem('adminInfo');
       const[user,setUser]= useState(AdminInfo);
       const login =(user)=>
       {
        setUser(user)
       }
 const logout =() =>
 {
    localStorage.removeItem('adminIfo')
    setUser(null)
 }
 return <AdminAuthContext.Provider value={{
    user,
    login,
    logout
 }}>

    {Children}
 </AdminAuthContext.Provider>
 }