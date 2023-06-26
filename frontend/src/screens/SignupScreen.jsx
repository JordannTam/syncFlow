import React from 'react';
import { BigButton } from '../components/Button';
import { Alert, Box, Divider, TextField } from '@mui/material';
import PageContainer from '../components/PageContainer';
import { apiCall } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { ColumnBox } from '../components/FlexBox'
import Cookies from 'js-cookie';
// import { Context, useContext } from '../../../context';

export default function SignupScreen () {
  // const { setters } = useContext(Context);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [first_name, setFirstName] = React.useState('');
  const [last_name, setLastName] = React.useState('');
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState('');

  const navigate = useNavigate();

  const signupAPI = async () => {
    const object = {
    email,
    password,
    first_name,
    last_name,
    }
    try {
      const res = await apiCall('/register', object, 'POST', undefined);
      const token = res.data.token;
      // Calculate the expiry date 2 minutes from the current time
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + 2 * 60 * 1000);
      Cookies.set('loginToken', token, { expires: expiryDate });
      navigate('/login')
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <PageContainer sx={{ border: '1px solid #ddd', padding: '10px' }} marginTop='140px' maxWidth='xs'>
      <ColumnBox rowGap='10px' margin={'-20px auto 0'}>
        <Box margin={'-10px auto 0'}>
          <h2>Register</h2>
        </Box>
        <TextField helperText="Must be between 1 and 50 characters long" label="First Name" variant="outlined" value={first_name} onChange={(e) => setFirstName(e.target.value)} />
        <TextField helperText="Must be between 1 and 50 characters long" label="Last Name" variant="outlined" value={last_name} onChange={(e) => setLastName(e.target.value)} />
        <TextField error={ hasError } helperText="Please enter a valid email" label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField helperText='Must be between 8 and 32 characters long' label="Password" type='password' variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
        { hasError && <Alert severity="error" onClose={() => { setHasError(false) }}>{error}</Alert> }

        <BigButton variant='contained' onClick={() => signupAPI()}>Register</BigButton>
        <Divider />
        <BigButton variant='outlined' onClick={() => navigate('/login')}>Already have account?</BigButton>
        <br />
      </ColumnBox>
    </PageContainer>
  )
}
