import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiCall } from '../utils/api';
import Form from '../components/Form';
import Navbar from '../components/Navbar';

export default function EditGame() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [validationError, setValidationError] = useState('');
  const location = useLocation();

  console.log('-------locatino:', location.id, location.title)
  const handleLogout = async () => {
    try {
      await apiCall('/admin/auth/logout', 'POST');
      localStorage.removeItem('authData');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.message);
      localStorage.removeItem('authData');
      navigate('/login');
    }
  };

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await apiCall(`/admin/game/${gameId}`, 'GET');
        setGame(response.game);
        setTitle(response.game.title);
        setThumbnail(response.game.thumbnail);
      } catch (err) {
        setError('Failed to load game. Please try again.');
      }
    };
    fetchGame();
  }, [gameId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title) {
      setValidationError('Please enter a game title.');
      return;
    }
    try {
      await apiCall(`/admin/game/${gameId}/mutate`, 'POST', { title, thumbnail });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save game. Please try again.');
    }
  };

  // if (!game) return <div>Loading...</div>;

  return (
    <>
      <Navbar dashboardBtnShow={true} rightBtn={{ name: 'Log out', handler: handleLogout }} />
      <div className="p-6 bg-bigbrain-light-mint min-h-screen">
        <h2 className="text-2xl font-bold mb-4 ">Edit Game: {gameId}</h2>
        <Form
          onSubmit={handleSave}
          title={title}
          setTitle={setTitle}
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          error={error}
          validationError={validationError}
          buttonText="Save Changes"
          className="p-4 bg-bigbrain-milky-white rounded shadow-md"
        />
        {/* Add question list and edit functionality here */}
      </div>
    </>
  );
}