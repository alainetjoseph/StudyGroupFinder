import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { Navigate, Outlet } from "react-router-dom"

const AdminRoutes = () => {
  const { user } = useContext(AuthContext)

  if (!user) {
    return <Navigate to={'/login'} replace />
  }
  if (!user.isAdmin) {
    return <Navigate to={'/'} replace />
  }

  return <Outlet />
}

export default AdminRoutes
