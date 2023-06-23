import React from 'react';
import { BigButton } from '../components/Button';
import { Alert, Box, Divider, TextField } from '@mui/material';
import PageContainer from '../components/PageContainer';
import { apiCall } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { ColumnBox } from '../components/FlexBox'
// import { Context, useContext } from '../../../context';

export default function SignupPage () {
  // const { setters } = useContext(Context);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState('');

  const navigate = useNavigate();

  const signupAPI = async () => {
    const object = {
      email,
      password,
      name,
    }
    try {
      const data = await apiCall('/register', object, 'POST');
      // setters.setLoggedIn(true);
      // setters.setToken(data.token);
      localStorage.setItem('token', data.token);
      navigate('/home')
    } catch (err) {
      setHasError(true)
      setError(err)
    }
  }

  return (
    <PageContainer padding='10px' border='1px solid #ddd' maxWidth='xs'>
      <ColumnBox rowGap='20px'>
        <Box margin={'auto'}>
          <h2>Register</h2>
        </Box>
        <TextField helperText="Must be between six and 50 characters long" label="name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField error={ hasError } helperText="Please enter a valid email" label="email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField helperText='Must be between eight and 32 characters long' label="Password" type='password' variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
        { hasError && <Alert severity="error" onClose={() => { setHasError(false) }}>{error}</Alert> }

        <BigButton variant='contained' onClick={() => signupAPI()}>Register</BigButton>
        <Divider />
        <BigButton variant='outlined' onClick={() => navigate('/login')}>Already have a account?</BigButton>
        <br />
      </ColumnBox>
    </PageContainer>
  )
}
