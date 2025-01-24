import { Navigate, useParams } from "react-router-dom";
import { Register, Login } from "../../organisms";
import { FC } from "react";

const Authentication: FC = () => {
	const { type } = useParams<{ type: string }>();

	if (type === 'login') {
		return <Login />;
	} else if (type === 'register') {
		return <Register />;
	} else {
		return <Navigate to="/auth/login" />;
	}
}

export default Authentication;