import { TextField, TextFieldProps } from "@mui/material";

export const Input = ({ ...rest }: TextFieldProps) => (
  <TextField
    variant="outlined"
    style={{
      fontFamily: "Comic Neue",
    }}
    {...rest}
  />
);
