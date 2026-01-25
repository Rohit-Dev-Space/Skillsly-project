import { UserContext } from "../Componet/Context/UserContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

    const { user, loading } = useContext(UserContext)
    if (loading) return null;

    if (!user || user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;