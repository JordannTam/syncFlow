import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Context, useContext } from '../context';
import logo from '../asset/BigBrain-1.png'
import { HeaderButton } from './Button';

function Navbar () {
  const { getters } = useContext(Context);
  const narviage = useNavigate();
  return (
    <Box sx={{ flexGrow: 1, zIndex: 99 }}>
      <AppBar position="fixed" color='inherit'>
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, pt: 1.5 }}>
              <Link to='/'><Box component='img' sx={{
                height: 40,
                width: 240,
              }}
              src={logo} /></Link>
            </Typography>
            <Box display='flex' columnGap='30px' >
              { !getters.loggedIn && <HeaderButton size='medium' variant='outlined' onClick={() => {
                narviage('/admin/auth/signup')
              }}>Register</HeaderButton>
              }
              <HeaderButton size='medium' variant='contained' onClick={() => {
                if (getters.loggedIn) {
                  narviage('/admin/auth/logout')
                } else {
                  narviage('/admin/auth/login')
                }
              }}>{getters.loggedIn ? 'Logout' : 'Login'}</HeaderButton>
            </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
