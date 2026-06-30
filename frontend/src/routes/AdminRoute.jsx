import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({children}){
    const {
        user
    } = useAuth();

    if(user?.role !== "admin")
    {
        return (
            <Navigate to = '/dashboard' />
        );
    }
    return children;
}
export default AdminRoute;