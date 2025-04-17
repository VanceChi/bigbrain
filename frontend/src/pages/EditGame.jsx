import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiCall } from '../utils/api';
import Form from '../components/Form';
import Navbar from '../components/Navbar';

/**
 * 1. Allow to select the question they want to edit
 * 2. Allow to DELETE a particular question and ADD a new question, all actions must be done without a refresh.
 * 
 * 
 * @returns 
 */
export default function EditGame() {
  const location = useLocation();
  const {gameId} = useParams();
  const [title, setTitle] = useState(location.state.title);
  const [thumbnail, setThumbnail] = useState(location.state.thumbnail);
  const [questions, setQuestions] = useState(location.state.questions);
  // const [validationError, setValidationError] = useState('');
  // const [error, setError] = useState('');
  const navigate = useNavigate();

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

  // useEffect(() => {
  //   const fetchGame = async () => {
  //     try {
  //       const response = await apiCall(`/admin/game/${gameId}`, 'GET');
  //       setGame(response.game);
  //       setTitle(response.game.title);
  //       setThumbnail(response.game.thumbnail);
  //     } catch (err) {
  //       setError('Failed to load game. Please try again.');
  //     }
  //   };
  //   fetchGame();
  // }, [gameId]);

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

  return (
    <>
      <Navbar dashboardBtnShow={true} rightBtn={{ name: 'Log out', handler: handleLogout }} />
      <div className="p-6 bg-bigbrain-light-mint">
        <h2 className="text-2xl font-bold mb-4 ">Edit Game: {title}</h2>
        <div className="bg-bigbrain-light-mint flex justify-center items-center h-[60vh]">
          {questions? questions.map(() => {

            }):(
              <p>No question</p>
            )
          }
          {/* <Form
            onSubmit={handleSave}
            title={title}
            setTitle={setTitle}
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
            // error={error}
            // validationError={validationError}
            buttonText="Save Changes"
          /> */}
        </div>
      </div>
    </>
  );
}