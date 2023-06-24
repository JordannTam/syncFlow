import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { HeaderButton } from './Button';
import { createTheme } from '@mui/material';
const themeAB = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#22223B',
      darker: '#053e85',
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
  },
});


function Navbar () {
  const narviage = useNavigate();
  return (
    <Box sx={{ flexGrow: 1, zIndex: 99 }}>
      <AppBar theme={themeAB} position="fixed" color='primary'>
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, pt: 1.5 }}>
              {/* <Link to='/'><Box component='img' sx={{
                height: 40,
                width: 240,
              }}
              src={logo} /></Link> */}
            </Typography>
            <Box display='flex' columnGap='30px' >
              <HeaderButton size='medium' variant='contained' onClick={() => {
                narviage('/register')
              }}>Register</HeaderButton>
              <HeaderButton size='medium' variant='contained' onClick={() => {
                  narviage('/login')
              }}>Login</HeaderButton>
            </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
