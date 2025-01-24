import { RegisterForm } from "../../molecules";
import { LinkButton } from "../../atoms";
import { Box } from "@mui/material";
import { FC } from "react";

const Register : FC = () => {
    return (<>
        <RegisterForm />
		<Box display="flex" justifyContent="center">
        	<LinkButton to="/auth/login" color="secondary" variant="outlined" size="small" style={{padding: '0.5rem 1rem', marginTop: '1rem', width: '25%'}}>Me connecter</LinkButton>
    	</Box>
    </>)
}

export default Register;