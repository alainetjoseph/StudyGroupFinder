import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import axios from "axios"
import AgentLoader from "../components/AgentLoader"
import StudyGroupLoader from "../components/AgentLoader"

const ProtectedRoutes = () => {
  const { user, setUser, setIsLoggedIn } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [showOverlay, setShowOverlay] = useState(true)
  const location = useLocation();

  useEffect(() => {
    const startTime = Date.now();

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/me`, { withCredentials: true })
      .then((res) => {
        console.log("protection", res.data.user);
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error("protectError", err)
        setUser(null);
        setIsLoggedIn(true);
      })
      .finally(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 800 - elapsed);

        setTimeout(() => {
          setLoading(false);
        }, remaining);
      })
  }, [])

  console.log(location.pathname)

  return (
    <>
      {!loading && (user ? <Outlet /> : <Navigate to={"/login"} />)}
      {showOverlay && (
        <StudyGroupLoader 
          isLoading={loading} 
          onFinished={() => setShowOverlay(false)} 
        />
      )}
    </>
  );
};

export default ProtectedRoutes
