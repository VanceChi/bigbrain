import Navbar from "../components/Navbar"
import Register from "./Register"
import Login from "./Login"
import Dashboard from "./Dashboard"
export default function Page({pageName}) {
  const pages = {
    'Register': <Register />,
    'Login': <Login />,
    'Dashboard': <Dashboard />
  }

  return (
    <>
      <Navbar pageName={pageName}/>
      {pages[pageName] || <div>Page not found</div>}
    </>
  )
}