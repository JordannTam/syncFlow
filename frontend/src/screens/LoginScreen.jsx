import React, { useState } from 'react';
import axios from 'axios';
import { BigButton } from '../components/Button';
import { Alert, Box, Divider, TextField, Typography } from '@mui/material';
import PageContainer from '../components/PageContainer';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const login = async () => {
    const object = {
      email,
      password,
    }
    try {
      const res = await apiCall('/login', object, 'POST');
      localStorage.setItem('token', res.token);
      navigate('/home')
    } catch (err) {
      console.log(err);
    }
  }


  return (
      <PageContainer marginTop='160px' maxWidth='xs' >
        <Box display='flex' flexDirection='row' justifyContent='space-around'>
          <Box display='flex' flexDirection='column' rowGap='20px' maxWidth='400px'>
            <Box margin={'-10px auto 0'}>
                <h2>Login</h2>
            </Box>
            <TextField error={ hasError } label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField error={ hasError } type='password' label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
            { hasError && <Alert severity="error" onClose={() => { setHasError(false) }}>{error}</Alert> }
            <BigButton variant='contained' onClick={() => login()}>Login</BigButton>
            <Divider />
            <BigButton variant='outlined' onClick={() => navigate('/register')}>Register</BigButton>
          </Box>
          {/* <Box width='450px' height='450px' component="img" src="" /> */}
        </Box>
      </PageContainer>
  )
};

export default LoginScreen;