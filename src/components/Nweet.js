import { dbService } from 'fbase'
import React, { useState } from 'react'

const Nweet = ({
  nweetObj,
  isOwner // nweet의 작성자가 관리자(수정 권한이 있는) 인지?
}) => {
  const [editing, setEditing] = useState(false) // editing 모드
  const [newNweet, setNewNweet] = useState(nweetObj.text) // input에 입력된 값(nweetObj.text) 업데이트

  // [삭제] 삭제 버튼 눌렀을 때 이벤트
  const onDeleteClick = async () => {
    const ok = window.confirm('정말 이 nweet을 삭제하시겠습니까?')
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete()
    }
  }
  // 편집 모드를 토글
  const toggleEditing = () => setEditing((prev) => !prev)

  // [수정] 수정 후 tweet을 submit할 때 발생하는 이벤트
  const onSubmit = async (event) => {
    event.preventDefault()
    await dbService.doc(`nweets/${nweetObj.id}`).update({
      text: newNweet
    })
    setEditing(false)
  }

  // [수정] input Change 이벤트
  const onChange = (event) => {
    const {
      target: { value }
    } = event
    setNewNweet(value)
  }

  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Edit yout nweet"
                  value={newNweet}
                  required
                  onChange={onChange}
                />
                <input type="submit" value="Update Nweet" />
              </form>
              <button onClick={toggleEditing}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {isOwner && 
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          }
        </>
      )}
    </div>
  )
}
export default Nweet