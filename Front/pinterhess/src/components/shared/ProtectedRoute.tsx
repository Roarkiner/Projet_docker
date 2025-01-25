import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const { isConnected } = useAuth();

	if (!isConnected()) {
		return <Navigate to="/auth/login" replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;