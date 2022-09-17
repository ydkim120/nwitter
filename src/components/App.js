import React, { useState } from 'react'
import AppRouter from "components/Router";
import { authService } from 'fbase'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser) // 없으면 null
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App; 
