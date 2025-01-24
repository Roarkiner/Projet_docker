import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "../typings/Auth";
import Cookies from "js-cookie";

interface AuthContextProps {
	user: User | null;
	login: (user: User, token: string, afterLogin: () => void) => void;
	logout: () => void;
	isConnected: () => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(() => {
		const storedUser = localStorage.getItem("user");
		return storedUser ? JSON.parse(storedUser) : null;
	});

	useEffect(() => {
		const token = Cookies.get("auth_token");
		if (!token) {
			setUser(null);
			localStorage.removeItem("user");
		}
	}, []);

	const login = (user: User, token: string, afterLogin: () => void) => {
		setUser(user);
		localStorage.setItem("user", JSON.stringify(user));
		Cookies.set("auth_token", token, { secure: true, sameSite: "strict" });
		afterLogin();
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
		Cookies.remove("auth_token");
	};

	const isConnected = () => {
		return user !== null;
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, isConnected }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};