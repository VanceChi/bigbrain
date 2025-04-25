import { useNavigate } from "react-router-dom";
import { logoutUser } from '../services/authService';

export function NavButton({ children, onClick }) {
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


export function LoginBtn({ onClick }) {
  return (
    <NavButton onClick={onClick}>
      Log in
    </NavButton>
  )
}

export function BackButton({ onClick }) {
  const navigate = useNavigate();
  if (!onClick)
    onClick = () => navigate(-1);
  return (
    <button className="border" onClick={onClick}>back</button>
  )
}


export function DashBoardBtn({ onClick }) {
  return (
    <NavButton onClick={onClick}>
      Dashboard
    </NavButton>
  )
}


export function RegisterBtn({ onClick }) {
  return (
    <NavButton onClick={onClick}>
      Register
    </NavButton>
  )
}


export function LogoutBtn() {
  const navigate = useNavigate();
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