import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box } from "@mui/material";
import { FC } from "react";
import CircularImage from "../../atoms/CircularImage/CircularImage";

const Header: FC = () => {
	const { isConnected, user } = useAuth();

	return (
		<>
			<nav className="main-navbar">
				<ul>
					<li><Link to="/" className="home-link"><CircularImage src="/whale512.png" alt="Logo PinterHess" size={36} borderColor="black" style={{marginRight: '1rem'}}/><h3>Accueil</h3></Link></li>
					<li><Link to="/gallery"><h3>Gallerie</h3></Link></li>
				</ul>
				{!isConnected() ?
					<div className="header-auth-buttons">
						<Link to="/auth/login"><h3>Connexion</h3></Link>
					</div>
					:

					<Link to="/profile">
						<Box display='flex' alignItems='center'>
							<AccountCircleIcon style={{ marginRight: '0.5rem' }} />
							<h3>Bienvenue, {user?.name}</h3>
						</Box>
					</Link>
				}
			</nav>
		</>
	);
}

export default Header;
