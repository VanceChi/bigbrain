import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';


export default function Navbar({pageName}) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiCall('/admin/auth/logout', 'POST');
      localStorage.removeItem('authData');
      navigate('/login');
    } catch (error) { 
      console.error('Logout failed:', error.message);
      // Still navigate to login even if API call fails, since local storage is cleared
      localStorage.removeItem('authData');
      navigate('/login');
    }
  };
  
  const handleGoToRegister = async () => {
    navigate('/register');
  }
  
  const handleGoToLogin = async () => {
    navigate('/login');
  
  }

  
  let rightBtn;

  if (pageName === 'Login')
    rightBtn = <button onClick={handleGoToRegister} className='font-bold text-white hover:cursor-pointer hover:bg-bigbrain-dark-pink p-3'>Register</button>
  else if (pageName === 'Register')
    rightBtn = <button onClick={handleGoToLogin} className='font-bold text-white hover:cursor-pointer hover:bg-bigbrain-dark-pink p-3'>Log in</button>
  else if (pageName === 'Dashboard')
    rightBtn = <button onClick={handleLogout} className='font-bold text-white hover:cursor-pointer hover:bg-bigbrain-dark-pink p-3'>Log Out</button>
  else 
    console.error('pageName in Navbar error--pageName:', pageName)
  return (
    <div className='bg-bigbrain-light-pink shadow-[0_2px_2px_rgba(0,0,0,0.15)] place-content-between flex mb-1'>
      <p className='italic text-bigbrain-dark-green font-bold text-lg/8 inline-block p-3'>BigBrain</p>
      {rightBtn}
    </div>
  )
}