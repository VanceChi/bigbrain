import { useLocation, useNavigate } from 'react-router-dom';
import { DashBoardBtn } from './Button';
import { RegisterBtn } from './Button';
import { LogoutBtn } from './Button';
import { LoginBtn } from './Button';


/**
 * 
 * @returns Nav bar
 */
export default function Navbar() {
  const location = useLocation();
  const router = location.pathname;
  const token = JSON.parse(localStorage.getItem('token'));
  
  const navigate = useNavigate();
  
  return (
    <div className="bg-bigbrain-light-pink shadow-[0_2px_2px_rgba(0,0,0,0.15)] place-content-between flex mb-1">
      <div className="flex place-content-between">
        <p className="italic text-bigbrain-dark-green font-bold text-lg/8 inline-block p-3">BigBrain</p>
        {! ['/login', '/register'].includes(router) && !router.includes('/play') && (
          <DashBoardBtn onClick={() => navigate('/dashboard')}/>
        )}
      </div>
      {token? ( !router.includes('/play') && <LogoutBtn /> ) : 
        ( router === '/login' && <RegisterBtn onClick={() => navigate('/register')}/> ) ||
        ( router === '/register' && <LoginBtn onClick={() => navigate('/login')}/> )
      }
    </div>
  );
}