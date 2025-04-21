import Navbar from "../components/Navbar"
import { BackButton } from "../components/Button"
import { useParams } from "react-router-dom"
import { queryQuestions } from "../utils/query";
import { useEffect, useState } from "react";
import EditQuizQuestionCard from "../components/QuestionEditor";

export default function EditQuestion () {
  const { gameId, questionId } = useParams();
  const [questions, setQuestions] = useState();
  
  useEffect(() => {
    (async () => {
      try {
        const questions = await queryQuestions(gameId);
        setQuestions(questions)
      } catch (err) {
        console.error("Failed to load games:", err);
      }
    })();
    
  }, []);


  return (
    <>
      <Navbar />
      <BackButton />
      <EditQuizQuestionCard  
        gameId={gameId}
        questionId={questionId}
        showAddQues={true}
        questions={questions}
        setQuestions={setQuestions}
      />
    </>
    
  )
}