import { CircularProgress, Container } from "@mui/material";
import { Button, TextField, Typography } from "../../atoms";
import { ChangeEvent, FC, useState } from "react";
import { LoginRequestModel } from "../../../typings/Auth";
import axiosService from "../../../services/AxiosService";
import { useAuth } from "../../../contexts/AuthContext";


const LoginForm: FC = () => {
	const [loginField, setLoginField] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState('');
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const data: LoginRequestModel = {
			login: loginField,
			password: password
		}

		try {
			const response = await axiosService.post("/login", data);
			const responseData = response?.data;
			if (!responseData?.User || !responseData?.Jwt) throw new Error();

			login(responseData.User, responseData.Jwt, () => {
				window.location.href = '/gallery';
			});
		} catch (error) {
			setErrors('Une erreur à été retournée, veuillez-rééssayer.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="sm" style={{ marginTop: '50px' }}>
			<Typography variant="h5" gutterBottom>
				Connexion
			</Typography>
			<form onSubmit={handleSubmit}>
				<TextField
					label="Login"
					variant="outlined"
					fullWidth
					margin="normal"
					type="text"
					value={loginField}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginField(e.target.value)}
					required
					disabled={loading}
				/>

				<TextField
					label="Mot de passe"
					variant="outlined"
					fullWidth
					margin="normal"
					type="password"
					value={password}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
					required
					disabled={loading}
				/>
				<Button
					variant="contained"
					color="primary"
					type="submit"
					fullWidth
					style={{ marginTop: '20px' }}
					disabled={loading}
				>
					{loading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
				</Button>
				{!!errors && (
					<Typography variant="body1" type={'error'} style={{ marginTop: '16px' }}>
						{errors}
					</Typography>
				)}
			</form>
		</Container>
	)
}

export default LoginForm;