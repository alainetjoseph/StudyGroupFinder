import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import { SnackbarProvider } from 'notistack'
import ProtectedRoutes from './Utils/ProtectedRoutes'
import { AuthProvider } from './contexts/AuthContext'
import CreateGroup from './components/CreateGroup'
import FindGroups from './components/FindGroups'

function App() {

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route element={<ProtectedRoutes />}>
            <Route path='/' element={<Home />} />
            <Route path='/creategroup' element={<CreateGroup />} />
            <Route path='/findgroup' element={<FindGroups />} />
          </Route>
        </Routes>
        <SnackbarProvider />
      </AuthProvider>
    </>
  )
}

export default App
