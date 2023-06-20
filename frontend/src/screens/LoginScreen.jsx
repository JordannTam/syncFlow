import React, { useState } from 'react';
import axios from 'axios';

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');

  const login = async (e) => {
    e.preventDefault()
    const data = new FormData();
    data.append('email', email)
    data.append('password', password)
    try {
      const response = await axios.post('http://localhost:8000/login', data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={login}>
        <label>
          Email
          <input type="text" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Login</button>
      </form>
      <h2>
        <a className='register-link' href="/register">
          SIGN UP
        </a>
      </h2>
    </>
  );
};

export default LoginScreen;