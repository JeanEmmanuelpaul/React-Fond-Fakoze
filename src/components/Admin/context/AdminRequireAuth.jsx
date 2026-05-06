import { useContext } from "react";
import { AdminAuthContext } from "./AdminAuth";
import { Navigate} from "react-router-dom"; 


export const AdminRequireAuth =({children }) =>
{
    const{User}=useContext(AdminAuthContext) 
    if(!User)
    {
        return <Navigate to={'/admin/login'}/>
    }
    return children;
}