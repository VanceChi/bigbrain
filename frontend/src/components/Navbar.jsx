import { useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';

function NavButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="font-bold text-white hover:cursor-pointer hover:bg-bigbrain-dark-pink p-4"
      aria-label={children}
    >
      {children}
    </button>
  );
}


/**
 * 
 * @param {*} rightBtn if token, set it to log out anyway. 
 *                     else if not specify, set it to log 
 * @returns 
 */
export default function Navbar() {
  const location = useLocation();
  const router = location.pathname;
  const token = JSON.parse(localStorage.getItem('token'));
  
  const navigate = useNavigate();
  
  function DashBoardBtn() {
    return (
      <NavButton onClick={() => navigate('/dashboard')}>
        Dashboard
      </NavButton>
    )
  }

  function LogoutBtn() {
    const handleLogout = async () => {
      try {
        await logoutUser();
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        navigate('/login');
      }
    };

    return (
      <NavButton onClick={handleLogout}>
        Log out
      </NavButton>
    )
  }


  function LoginBtn() {
    return (
      <NavButton onClick={() => navigate('/login')}>
        Log in
      </NavButton>
    )
  }


  function RegisterBtn() {
    return (
      <NavButton onClick={() => navigate('/register')}>
        Register
      </NavButton>
    )
  }

  return (
    <div className="bg-bigbrain-light-pink shadow-[0_2px_2px_rgba(0,0,0,0.15)] place-content-between flex mb-1">
      <div className="flex place-content-between">
        <p className="italic text-bigbrain-dark-green font-bold text-lg/8 inline-block p-3">BigBrain</p>
        {! ['/login', '/register'].includes(router) && !router.includes('/play') && (
          <DashBoardBtn />
        )}
      </div>

        {token? ( !router.includes('/play') && <LogoutBtn /> ) : 
        ( router === '/login' && <RegisterBtn /> ) ||
        ( router === '/register' && <LoginBtn /> )}

    </div>
  );
}