import React from 'react';
import { BigButton } from '../../../components/Button';
import { Alert, Box, Divider, TextField, Typography } from '@mui/material';
import loginPic from '../../../asset/login_pic_1.png'
import PageContainer from '../../../components/PageContainer';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../../util/api'
import { Context, useContext } from '../../../context';

export default function LoginPage () {
  const { setters } = useContext(Context);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const loginAPI = async () => {
    const object = {
      email,
      password,
    }
    try {
      const data = await apiCall('/admin/auth/login', object, 'POST', undefined);
      setters.setLoggedIn(true);
      setters.setToken(data.token);
      localStorage.setItem('token', data.token)
      navigate('/admin/dashboard/quizzes')
    } catch (err) {
      setHasError(true)
      setError(err)
    }
  }

  return (
      <PageContainer maxWidth='lg'>
        <Box display='flex' flexDirection='row' justifyContent='space-around'>
          <Box display='flex' flexDirection='column' rowGap='20px' maxWidth='400px'>
            <Typography variant="h2" component="h1">
              Welcome Back to BigBrain!!!
            </Typography>
            <TextField error={ hasError } label="email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField error={ hasError } type='password' label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
            { hasError && <Alert severity="error" onClose={() => { setHasError(false) }}>{error}</Alert> }
            <BigButton variant='contained' onClick={() => loginAPI()}>Login</BigButton>
            <Divider />
            <BigButton variant='outlined' onClick={() => navigate('/admin/auth/signup')}>Register</BigButton>
          </Box>
          <Box width='450px' height='450px' component="img" src={loginPic} />
        </Box>
      </PageContainer>
  )
}
