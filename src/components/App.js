import React, { useEffect, useState } from 'react'
import AppRouter from "components/Router";
import { authService } from 'fbase'

function App() {
  const [init, setInit] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // 로그인 유무

  useEffect(() => { 
    authService.onAuthStateChanged((user) => { // 계정에 변화가 있을 때 실행되는 메서드
      setIsLoggedIn(!!user)
      setInit(true)
    })
  }, [])
  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : 'Initializing...'}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App; 
