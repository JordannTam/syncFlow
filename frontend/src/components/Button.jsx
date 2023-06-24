import ButtonMUI from '@mui/material/Button';
import React from 'react';
import styled from '@emotion/styled';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#023047',
      darker: '#053e85',
    },
    neutral: {
      main: '#219EBC',
      contrastText: '#fff',
    },
  },
});

const EditButton = styled(ButtonMUI)({
  borderRadius: '20px',
})

export const BigButton = styled(Button)((props) => ({
  width: '400px',
}))

export const HeaderButton = styled(Button)((props) => ({
  width: '100px',
}))

export default function Button (props) {
  return (
    <ThemeProvider theme={theme}>
      <EditButton color='neutral' {...props}>{props.children}</EditButton>
    </ThemeProvider>
  )
}
