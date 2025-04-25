import Navbar from "../components/Navbar"
import { BackBtn } from "../components/SVGBtn"
import { useParams } from "react-router-dom"
import { queryQuestions } from "../utils/query";
import { useEffect, useState } from "react";
import EditQuestionCard from "../components/EditQuestionCard";

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
      <BackBtn />
      <EditQuestionCard  
        gameId={gameId}
        questionId={questionId}
        showAddQues={true}
        questions={questions}
        setQuestions={setQuestions}
      />
    </>
    
  )
}