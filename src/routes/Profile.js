import { authService, dbService } from 'fbase'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'

export default ({
  userObj,
  refreshUser
}) => {
  const history = useHistory()
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)

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

  // displayName 입력 이벤트
  const onChangeDisplayName = (event) => {
    const {
      target: { value }
    } = event
    setNewDisplayName(value)
  }
  // displayName 변경 이벤트
  const onSubmitDisplayName = async (event) => {
    event.preventDefault()
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({ // firebase의 유저 정보 업데이트
        displayName: newDisplayName
      })
      refreshUser() // 유저 정보 동기화
    }
  }
  return (
    <div className="container">
      <form 
        onSubmit={onSubmitDisplayName}
        className="profileForm"
      >
        <input
          type="text"
          placeholder="Display Name"
          value={newDisplayName}
          onChange={onChangeDisplayName}
          autoFocus
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <a
        className="formBtn cancelBtn logOut"
        onClick={onLogOutClick}
      >
        Log Out
      </a>
    </div>
  )
}