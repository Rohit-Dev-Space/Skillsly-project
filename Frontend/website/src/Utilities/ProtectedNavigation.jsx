import { UserContext } from "../Componet/Context/UserContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const ProtectedNavigation = ({ children }) => {

    const { user, loading } = useContext(UserContext)
    if (loading) return null;

    if (!user) {
        return <Navigate to="/authenticate" replace />;
    } else if (user.isBlocked) {
        return <Navigate to="/BlockedPage" replace />;
    }

    return children;
}

export default ProtectedNavigation;