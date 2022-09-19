import { authService, dbService } from 'fbase'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'

export default ({ userObj }) => {
  const history = useHistory()

  //로그아웃 이벤트
  // Home으로 라우팅
  const onLogOutClick = () => {
    authService.signOut()
    history.push('/')
  }

  // 내가 쓴 nweet만 조회
  const getMyNweets = async () => {
    const nweets = await dbService.collection('nweets')
      .where('creatorId', '==', userObj.uid)
      // .where()... 이렇게 체이닝으로 조건을 추가 할 수 있음
      // ** noSQL 기반 DB라서 where로 준 조건 쿼리는 index가 필요하다는 에러가 뜬다. (pre-made query)
      .orderBy('createdAt') // 'desc' 조건을 줄 경우, 쿼리를 하나 더 추가해야 하므로 index를 한 개 더 생성해야 한다.
      .get()
    console.log(nweets)
  }
  useEffect(() => {
    getMyNweets()
  }, [])
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}