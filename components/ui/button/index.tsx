import {
  Button as MUIButton,
  ButtonProps as MUIButtonProps,
} from "@mui/material";

export const Button = ({ children, ...rest }: MUIButtonProps) => (
  <MUIButton
    variant="outlined"
    style={{
      fontFamily: "Comic Neue",
    }}
    {...rest}
  >
    {children}
  </MUIButton>
);
