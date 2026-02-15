import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(sessionStorage.getItem("user")) || null;
  })

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return (sessionStorage.getItem("isLoggedIn") === "true");
  })

  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(user) || null);
    sessionStorage.setItem("isLoggedIn", isLoggedIn);
  }, [user, isLoggedIn])

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}
