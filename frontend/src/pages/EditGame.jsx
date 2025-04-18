import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiCall } from '../utils/api';
import Navbar from '../components/Navbar';


/**
 * 1. Allow to select the question they want to edit
 * 2. Allow to DELETE a particular question and ADD a new question, all actions must be done without a refresh.
 * 
 * @returns 
 */
export default function EditGame() {
  const location = useLocation();
  const [title, setTitle] = useState(location.state.title);
  const [questions, setQuestions] = useState(location.state.questions);
  const [showAddQues, setShowAddQues] = useState(false);
  const navigate = useNavigate();

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

  return (
    <>
      <Navbar dashboardBtnShow={true} rightBtn={{ name: 'Log out', handler: handleLogout }} />
      <div className="p-5 bg-bigbrain-light-mint min-h-[80vh]">
        <h2 className="text-2xl font-bold mb-4 ">Edit Game: {title}</h2>
        
        <button 
            className=" bg-bigbrain-light-pink font-bold text-sm/4 text-white hover:cursor-pointer hover:bg-bigbrain-dark-pink p-3 mb-2 rounded-3xl" 
            onClick={() => setShowAddQues(showAddQues => !showAddQues)}
          >+ Question
        </button>

        {/* Input question Info */}
        {console.log('1', showAddQues)}
        {showAddQues && <QuizQuestion />}
        {console.log('2',)}



        <div className="bg-bigbrain-light-mint flex justify-center h-fit">
          <div>
            {questions? questions.map(() => {

              }):(
                <p style={{display:(showAddQues?'none':'block')}}>No question</p>
              )
            }
          </div>
        </div>
        

      </div>
    </>
  );
}