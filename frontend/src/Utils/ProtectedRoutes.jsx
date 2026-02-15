import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import axios from "axios"
const ProtectedRoutes = () => {
  const { user, setUser, setIsLoggedIn } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const location = useLocation();
  useEffect(() => {
    axios.get("http://localhost:3000/me", { withCredentials: true })
      .then((res) => {
        console.log("protection", res.data.user);
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error("protectError", err)
        setUser(null);
        setIsLoggedIn(false);
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
  console.log(location.pathname)
  if (loading) { return <div>Checking Authorization</div> }
  return user ? <Outlet /> : <Navigate to={"/login"} />
};

export default ProtectedRoutes
