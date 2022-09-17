import React, { useEffect, useState } from 'react'
import AppRouter from "components/Router";
import { authService } from 'fbase'

function App() {
  const [init, setInit] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // 로그인 유무
  const [userObj, setUserObj] = useState(null)

  useEffect(() => { 
    authService.onAuthStateChanged((user) => { // 계정에 변화가 있을 때 실행되는 메서드
      setInit(true) // 페이지 시작
      setUserObj(user) // 유저 정보
      setIsLoggedIn(!!user) // 로그인 유무
    })
  }, [])
  return (
    <>
      {init ? (
        <AppRouter 
          isLoggedIn={isLoggedIn}
          userObj={userObj}
        />
      ) : (
        'Initializing...'
      )}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App; 
