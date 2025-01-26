import { Button, CircularProgress, Container } from "@mui/material";
import { ChangeEvent, FC, useState } from "react";
import { TextField, Typography } from "../../atoms";
import { RegisterRequestModel } from "../../../typings/Auth";
import axiosService from "../../../services/AxiosService";
import { useAuth } from "../../../contexts/AuthContext";

const RegisterForm: FC = () => {
	const [name, setName] = useState('');
	const [loginField, setLoginField] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState({
		password: '',
		confirmPassword: '',
		general: ''
	});
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();

	const validateForm = (): boolean => {
		return validatePassword() && validateConfirmPassword();
	};

	const validatePassword = (): boolean => {
		const isPasswordValid = password.length >= 8;
		setErrors(prevErrors => ({
			...prevErrors,
			password: isPasswordValid ? '' : 'Le texte mot de passe doit contenir au moins 8 caractères.'
		}));
		return isPasswordValid;
	};

	const validateConfirmPassword = (): boolean => {
		const arePasswordsIdentical = password === confirmPassword;
		setErrors(prevErrors => ({
			...prevErrors,
			confirmPassword: arePasswordsIdentical ? '' : 'La confirmation doit être identique au mot de passe'
		}));
		return arePasswordsIdentical;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		setErrors({ password: '', confirmPassword: '', general: '' });

		if (!validateForm()) {
			setLoading(false);
			return;
		}

		const data: RegisterRequestModel = { nom: name, login: loginField, mdp: password };

		try {
			const response = await axiosService.post("/auth/inscription", data);
			const responseData = response?.data;
			if (!responseData?.user || !responseData?.jwt) throw new Error();

			login(responseData.user, responseData.jwt, () => {
				window.location.href = '/gallery';
			});
		} catch (error) {
			console.error('Erreur inconnue:', error);
			setErrors(prevErrors => ({
				...prevErrors,
				general: 'Une erreur à été retournée, veuillez-rééssayer.'
			}));
		} finally {
			setLoading(false);
		}
	};

	const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setConfirmPassword(value);
		if (value === password && errors.confirmPassword) {
			setErrors(prevErrors => ({ ...prevErrors, confirmPassword: '' }));
		}
	};

	return (
		<Container maxWidth="sm" style={{ marginTop: '50px' }}>
			<Typography variant="h5" gutterBottom>
				Créer mon compte
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
					label="Nom"
					variant="outlined"
					fullWidth
					margin="normal"
					type="text"
					value={name}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
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
					errorText={errors.password}
					disabled={loading}
				/>
				<TextField
					label="Confirmation du mot de passe"
					variant="outlined"
					fullWidth
					margin="normal"
					type="password"
					value={confirmPassword}
					onChange={handleConfirmPasswordChange}
					required
					errorText={errors.confirmPassword}
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
				{errors.general && (
					<Typography variant="body1" style={{ marginTop: '16px', color: 'red' }}>
						{errors.general}
					</Typography>
				)}
			</form>
		</Container>
	);
};


export default RegisterForm;