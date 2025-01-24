import { TextField as MuiTextField, Typography } from '@mui/material';
import { FC } from 'react';
import { styled } from '@mui/system';

interface CustomTextFieldProps {
    errorText?: string;

    [key: string]: any;
}

const StyledTextField = styled(MuiTextField)({
    marginBottom: '0px',
});

const TextField: FC<CustomTextFieldProps> = ({errorText, ...other}) => {
    return (
        <>
            <StyledTextField
                {...other}
                error={!!errorText}
            />

            <Typography
                component="p"
                variant="body2"
                sx={{
                    fontSize: '0.75rem',
                    margin: '3px 14px 0',
                    color: !!errorText ? '#d32f2f' : 'transparent',
                    userSelect: 'none',
                    height: '1em'
                }}
                dangerouslySetInnerHTML={{ __html: errorText || '' }}
            >
            </Typography>
        </>
    );
};

export default TextField;
