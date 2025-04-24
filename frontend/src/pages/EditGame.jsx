import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiCall } from '../utils/api';
import Navbar from '../components/Navbar';
import { BackButton } from "../components/Button"
import { queryGamebyId } from '../utils/query';
import EditQuestionCard from "../components/EditQuestionCard";
import { updateQuestions } from "../utils/update"

/**
 * 1. Allow to select the question they want to edit
 * 2. Allow to ADD a new question
 * 3. Allow to DELETE a particular question
 * 
 * @returns UI of editting a single game.
 */
export default function EditGame() {
  // pass down games, game, questions to children componet 
  const location = useLocation();
  const { gameId } = useParams();
  const [games, setGames] = useState([]);
  const [game, setGame] = useState({});
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showAddQues, setShowAddQues] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('showAddQues changed')
  }, [showAddQues])

  useEffect(() => {
    (async () => {
      try {
        // get all questions
        const res = await apiCall('/admin/games', 'GET');
        const games = res.games;
        setGames(games);
        // const game = games.filter((game) => game.id == gameId)[0];
        const game = await queryGamebyId(gameId)
        setGame(game);
        setTitle(game.name);
        setQuestions(game.questions??[]);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [])


  const delQuesHandler = async (id) => {
    try {
      const newQuestions = questions.filter(question => question.id != id);
      const newGame = await updateQuestions(newQuestions, game);
      setQuestions(newQuestions);
      console.log('delete game')
      setGame(newGame);
      // debugger
    } catch (err) {
      console.error('delQuestion error:' +  err)
    }
    
  }

  const editQuesHandler = (quesId) => {
    navigate(`/game/${game.id}/question/${quesId}`);
  }

  return (
    <>
      <Navbar  />
      <BackButton />
      <div className="p-5 bg-bigbrain-light-mint min-h-[80vh]">
        <h2 className="text-2xl font-bold mb-4 ">Edit Game: {title}</h2>
        <button 
            className=" bg-bigbrain-light-pink font-bold text-sm/4 text-white hover:cursor-pointer hover:bg-bigbrain-dark-pink p-3 mb-2 rounded-3xl" 
            onClick={() => setShowAddQues(showAddQues => !showAddQues)}
          >+ Question
        </button>

        {/* Input question Info */}
        {showAddQues && 
        <EditQuestionCard 
          gameId={gameId}
          showAddQues={showAddQues}
          setShowAddQues={setShowAddQues}
          questions={questions}
          setQuestions={setQuestions}
        />}

        {/* All questions now */}
        <div className="bg-bigbrain-light-mint justify-center h-fit">
          <h2>Questions:</h2>
          {(Array.isArray(questions) && questions.length>0)? 
            questions.map((question) => {
              return (
                <div key={question.id} className='border m-1'>
                  <div>
                    <p>{JSON.stringify(question.questionText)}</p>
                  </div>
                  <div className='flex place-content-between'>
                    <button 
                      className='border w-1/2'
                      onClick={() => delQuesHandler(question.id)}
                    >Delete</button>
                    <button 
                      className='border w-1/2'
                      onClick={() => editQuesHandler(question.id)}
                    >Edit</button>
                  </div>
                </div>
              )
            }):(
              <p style={{display:(showAddQues?'none':'block')}}>No question</p>
            )
          }
        </div>
      </div>
    </>
  );
}