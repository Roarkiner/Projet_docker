import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Button } from "@mui/material";
import { FC, useState } from "react";
import CircularImage from "../../atoms/CircularImage/CircularImage";

const Header: FC = () => {
	const { isConnected, user, logout } = useAuth();
	const [hovered, setHovered] = useState(false);

	return (
		<>
			<nav className="main-navbar">
				<ul>
					<li><Link to="/" className="home-link"><CircularImage src="/whale512.png" alt="Logo PinterHess" size={36} borderColor="black" style={{ marginRight: '1rem' }} /><h3>Gallerie</h3></Link></li>
				</ul>
				<div className="header-auth-buttons">
					{!isConnected() ?
						<Link to="/auth/login"><h3>Connexion</h3></Link>
						:
						<Button
							sx={{ color: "black", '&:hover': { color: "red" } }}
							onMouseEnter={() => setHovered(true)}
							onMouseLeave={() => setHovered(false)}
							onClick={logout}
						>
							<Box display='flex' alignItems='center'>
								<AccountCircleIcon style={{ marginRight: '0.5rem' }} />
								<h3>{hovered ? "Se déconnecter" : `Bienvenue, ${user?.nom}`}</h3>
							</Box>
						</Button>
					}
				</div>
			</nav>
		</>
	);
}

export default Header;
