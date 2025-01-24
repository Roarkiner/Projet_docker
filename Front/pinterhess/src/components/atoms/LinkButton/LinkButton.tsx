import { FC } from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { LinkProps } from 'react-router-dom';

interface LinkButtonProps extends LinkProps {
	to: string;
	children: React.ReactNode;
	variant?: 'text' | 'outlined' | 'contained';
	color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
	size?: 'small' | 'medium' | 'large';
}

const LinkButton: FC<LinkButtonProps> = ({
	to,
	children,
	variant,
	color,
	size,
	...props
}) => {
	return (
		<Button
			component={Link}
			to={to}
			variant={variant ?? 'contained'}
			color={color ?? 'primary'}
			size={size ?? 'medium'}
			{...props}
		>
			{children}
		</Button>
	);
};

export default LinkButton;
