import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/AuthService';

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
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your email or password.');
    }
  };

  return (
    <form onSubmit={handleLoginSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;