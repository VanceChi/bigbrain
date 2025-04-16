import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/AuthService';
import Navbar from './Navbar';

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
      // Clear input fields on successful login
      setEmail('');
      setPassword('');
      setError(''); // Optional: Clear error message as well
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your email or password.');
    }
  };

  return (
    <>      
      <div className=" bg-bigbrain-light-mint flex justify-center items-center min-h-screen ">
        <form 
          onSubmit={handleLoginSubmit}
          className="p-6 bg-bigbrain-milky-white rounded shadow-md"
          autoComplete="off"
        >
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="block w-full p-2 border rounded"
              autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="block w-full p-2 border rounded bg-bigbrain-milky-white"
              autoComplete="off"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button type="submit" className="bg-bigbrain-light-pink font-bold w-full p-2 text-white rounded hover:bg-bigbrain-dark-pink hover:cursor-pointer">
            Log in
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;