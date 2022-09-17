import { authService } from 'fbase'
import React from 'react'
import { useHistory } from 'react-router'

export default () => {
  const history = useHistory()

  /**
   * 로그아웃 이벤트
   * Home으로 라우팅
   */
  const onLogOutClick = () => {
    authService.signOut()
    history.push('/')
  }
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}