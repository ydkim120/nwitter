import React, { useEffect, useState } from 'react'
import AppRouter from "components/Router";
import { authService } from 'fbase'

function App() {
  const [init, setInit] = useState(false)
  const [userObj, setUserObj] = useState(null)

  useEffect(() => {
    authService.onAuthStateChanged((user) => { // 로그인, 로그아웃, 어플리케이션이 초기화 될 때 발생 이벤트
      setInit(true) // 페이지 시작. onAuthStateChanged() 발생 유무를 알기 위함
      setUserObj(user) // 유저 정보
    })
  }, [])
  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={!!userObj} // 로그인 유무
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
