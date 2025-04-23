import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import Form from '../components/Form';
import Navbar from "../components/Navbar"

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      localStorage.clear();
      localStorage.setItem('token', JSON.stringify(response.token));
      localStorage.setItem('email', JSON.stringify(email));
      setEmail('');
      setPassword('');
      setError('');
      navigate('/dashboard', { state: { email } });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your email or password.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-bigbrain-light-mint flex justify-center items-center h-[80vh]">
        <Form
          onSubmit={handleLoginSubmit}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          buttonText="Log in"
        />
      </div>
    </>
  );
}

export default Login;