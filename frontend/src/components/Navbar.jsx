import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';

/**
 * 
 * @param {String} serveName Register, Log in, Log out
 * @returns 
 */
function NavRightButton({children, handler}) {
  
  return (
    <button onClick={handler} className='font-bold text-white hover:cursor-pointer hover:bg-bigbrain-dark-pink p-3'>{children}</button>
  )
}

/**
 * 
 * @param {String} pageName Login, Register, Dashboard
 * @returns 
 */
export default function Navbar({pageName}) {
  const navigate = useNavigate();
  const services = {
    logout: {},
    register: {},
    login: {}
  };  // logout, register, login
  const pageNavService = {  // pageNmae -> services
    'Login': 'register',
    'Register': 'login',
    'Dashboard': 'logout'
  }

  services['logout'].name = 'Log out';
  services['logout'].handler = async () => {
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
  
  services['register'].name = 'Register';
  services['register'].handler = async () => {
    navigate('/register');
  }
  
  services['login'].name = 'Log in';
  services['login'].handler = async () => {
    navigate('/login');
  
  }

  const service = services[pageNavService[pageName]];
  
  return (
    <div className='bg-bigbrain-light-pink shadow-[0_2px_2px_rgba(0,0,0,0.15)] place-content-between flex mb-1'>
      <p className='italic text-bigbrain-dark-green font-bold text-lg/8 inline-block p-3'>BigBrain</p>
      <NavRightButton handler={service.handler}>{service.name}</NavRightButton>
    </div>
  )
}