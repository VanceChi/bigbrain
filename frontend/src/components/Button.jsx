import { useNavigate } from "react-router-dom";


export function BackButton({onClick}) {
  const navigate = useNavigate();
  if (!onClick)
    onClick = () => navigate(-1);
  return (
    <button className="border" onClick={onClick}>back</button>
  )
}