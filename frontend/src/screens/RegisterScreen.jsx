import React, { useState } from 'react';
import axios from 'axios';

const RegisterScreen = () => {
  const [email, setEmail] = useState('')
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [password, setPassword] = useState('');

  const register = async (e) => {
    e.preventDefault();
    const data = new FormData()
    data.append('email', email)
    data.append('first_name', first_name)
    data.append('last_name', last_name)
    data.append('password', password)
    try {
      await axios.post('http://localhost:8000/register', data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={register}>
        <label>
          Email
          <input type="text" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          First Name
          <input type="text" value={first_name} onChange={e => setFirstName(e.target.value)} required />
        </label>
        <label>
          Last Name
          <input type="text" value={last_name} onChange={e => setLastName(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Register</button>
      </form>
      <h2>
        <a className='register-link' href="/login">
            Login
        </a>
      </h2>

    </>
    );
};

export default RegisterScreen;