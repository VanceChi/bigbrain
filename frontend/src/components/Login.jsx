import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/AuthService';
import Form from './Form';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      localStorage.setItem('authData', JSON.stringify(response));
      setEmail('');
      setPassword('');
      setError('');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your email or password.');
    }
  };

  return (
    <Form
      onSubmit={handleLoginSubmit}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
      buttonText="Log in"
    />
  );
}

export default Login;