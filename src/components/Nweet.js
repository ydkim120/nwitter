import { dbService, storageService } from 'fbase'
import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons"

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
      await dbService.doc(`nweets/${nweetObj.id}`).delete() // nweet 삭제
      if (nweetObj?.photoUrl) await storageService.refFromURL(nweetObj.photoUrl).delete() // 사진 저장된 버킷 storage에서 사진 파일 삭제
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
    <div className="nweet">
      {editing ? (
        <>
          {isOwner && (
            <>
              <form
                onSubmit={onSubmit}
                className="container nweetEdit"
              >
                <input
                  type="text"
                  placeholder="Edit yout nweet"
                  value={newNweet}
                  required
                  onChange={onChange}
                  autoFocus
                  className="formInput"
                />
                <input
                  type="submit"
                  className="formBtn"
                  value="Update Nweet"
                />
              </form>
              <a
                onClick={toggleEditing}
                className="formBtn cancelBtn"
              >
                Cancel
              </a>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.photoUrl && (
            <img src={nweetObj.photoUrl} />
          )}
          {isOwner && 
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          }
        </>
      )}
    </div>
  )
}
export default Nweet