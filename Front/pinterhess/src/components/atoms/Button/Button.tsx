import {ButtonProps, Button as MuiButton} from "@mui/material";
import {FC} from "react";

const Button: FC<ButtonProps> = ({...other}) => {
    return <MuiButton {...other}/>;
};

export default Button;