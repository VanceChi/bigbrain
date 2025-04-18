import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiCall } from '../utils/api';

function NavRightButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="font-bold text-white hover:cursor-pointer hover:bg-bigbrain-dark-pink p-4"
    >
      {children}
    </button>
  );
}

export default function Navbar({ dashboardBtnShow, editGameBtnShow, rightBtn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = JSON.parse(localStorage.getItem('token'));

  const handleLogout = async () => {
    try {
      await apiCall('/admin/auth/logout', 'POST');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.message);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  // page: rightBtn
  const defaultRightBtn = {
    login: { name: 'Log in', handler: () => navigate('/login') },
    register: { name: 'Register', handler: () => navigate('/register') },
    logout: { name: 'Log out', handler: handleLogout },
  };

  const pageRightBtnMap = {
    register: 'login',
    login: 'register',
    dashboard: 'logout'
  };

  // Get router name
  const currentPage = location.pathname.slice(1) || 'login';
  const effectiveRightBtn = token
    ? (currentPage === 'dashboard' || currentPage.startsWith('game/') ? defaultRightBtn.logout : rightBtn || defaultRightBtn[currentPage])
    : rightBtn || defaultRightBtn[pageRightBtnMap[currentPage]];

  return (
    <div className="bg-bigbrain-light-pink shadow-[0_2px_2px_rgba(0,0,0,0.15)] place-content-between flex mb-1">
      <div>
        <p className="italic text-bigbrain-dark-green font-bold text-lg/8 inline-block p-3">BigBrain</p>
        {dashboardBtnShow && (
          <Link to="/dashboard">
            <NavRightButton>Dashboard</NavRightButton>
          </Link>
        )}
        </div>
      {effectiveRightBtn && (
        <NavRightButton onClick={effectiveRightBtn.handler}>{effectiveRightBtn.name}</NavRightButton>
      )}
    </div>
  );
}