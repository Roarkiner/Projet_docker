import {FC} from "react";
import {FormControlLabelProps, FormControlLabel as MuiFormControlLabel} from "@mui/material";

const FormControlLabel: FC<FormControlLabelProps> = ({...other}) => {
    return <MuiFormControlLabel {...other} />;
};

export default FormControlLabel;