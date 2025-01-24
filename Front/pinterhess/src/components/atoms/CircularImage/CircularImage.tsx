import { FC } from 'react';
import { BoxProps, Box } from '@mui/material';

interface CircularImageProps extends BoxProps {
	src: string;
	alt: string;
	size?: number;
	borderColor?: string;
	borderWidth?: number;
}

const CircularImage: FC<CircularImageProps> = ({ src, alt, size = 100, borderColor = 'primary.main', borderWidth = 2, ...other}) => {
	return (
		<Box
			component="img"
			src={src}
			alt={alt}
			sx={{
				width: size,
				height: size,
				border: `${borderWidth}px solid`,
				borderRadius: '50%',
				borderColor: borderColor,
				objectFit: 'cover'
			}}
			{...other}
		/>
	);
};

export default CircularImage;