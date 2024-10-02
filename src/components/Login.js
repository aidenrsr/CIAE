import './css/Login.css';
import React, { useState } from 'react';
import axios from 'axios';

function Form(props) {
  return (
    <form>
      <input 
        className={props.type}
        type={props.type} 
        name={props.name}
        value={props.value}
        placeholder={props.label}
        onChange={props.onChange}
        />
    </form>
  );
}

function Button(props) {
  return (
      <button onClick={props.onClick} className='button'>로그인</button>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();  // Fix typo here
    setErrorMessage('');

    try {
      const response = await axios.post('https://your-backend-url.com/api/login', {
        email,
        password,
      });

      console.log('login successful!', response.data);
      localStorage.setItem('token', response.data.token);

      alert('login succeed!');
    } catch (error) {
      console.error('login failed:', error);
      setErrorMessage('login failed, please try again!');
    }
  };

  return (
    <div className='background'>
      <div className='won'></div>
        <div className='Logi'>
          <Form
          type='email' 
          name='email'
          label='이메일'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
          <Form
            type='password' 
            name='password'
            label='비밀번호'
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />       
        <Button name='로그인' onClick={handleSubmit} /> 
        </div>
      {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
    </div>
  );
}