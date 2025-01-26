import { FC } from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/system";

interface CustomTypographyProps {
    type?: string;
    [key: string]: any;
}

const CustomTypography: FC<CustomTypographyProps> = ({ type, ...other }) => {
    const StyledTypography = styled(Typography)(() => ({
        ...(type === "error" && {
            backgroundColor: "red",
            color: "white",
            fontWeight: "bold",
            padding: "1em",
            borderRadius: "8px",
        }),
    }));

    return <StyledTypography {...other} />;
};

export default CustomTypography;
