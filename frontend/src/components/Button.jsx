import { useNavigate } from "react-router-dom";

export function BackButton() {
  const navigate = useNavigate();
  return (
    <button className="border" onClick={() => navigate(-1)}>back</button>
  )
}