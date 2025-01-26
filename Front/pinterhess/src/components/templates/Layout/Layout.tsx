import './Layout.css';

import { Container } from "@mui/material";
import Navbar from "../../organisms/Header/Header";
import { Outlet } from "react-router-dom";
import { FC } from 'react';

const Layout: FC = () => {
	return (
		<>
			<Navbar />
			<Container>
				<div className="main-content">
					<Outlet />
				</div>
			</Container>
		</>
	)
}

export default Layout;
