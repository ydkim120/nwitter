import React, { useEffect, useState } from 'react'
import AppRouter from "components/Router";
import { authService } from 'fbase'

function App() {
  const [init, setInit] = useState(false)
  const [userObj, setUserObj] = useState(null)

  useEffect(() => {
    authService.onAuthStateChanged((user) => { // 로그인, 로그아웃, 어플리케이션이 초기화 될 때 발생 이벤트
      setInit(true) // 페이지 시작. onAuthStateChanged() 발생 유무를 알기 위함

      if (user) {
        // user 정보를 그대로 저장하면 react가 전처리 하기에 어려울 수 있으므로 이렇게 필요한 정보만 뽑아서 저장해준다.
        const { displayName, uid } = user 
        setUserObj({
          displayName,
          uid,
          updateProfile: (args) => user.updateProfile(args)
        }) // 유저 정보
      } else setUserObj(null)
    })
  }, [])

  // 유저 정보(userObj) 새로고침
  const refreshUser = () => {
    const { displayName, uid } = authService.currentUser
    setUserObj({
      displayName,
      uid,
      updateProfile: (args) => authService.currentUser.updateProfile(args)
    })
  }

  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={!!userObj} // 로그인 유무
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
        'Initializing...'
      )}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App; 
