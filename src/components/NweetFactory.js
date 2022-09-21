import { dbService, storageService } from 'fbase'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons"

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState('')
  const [photo, setPhoto] = useState('')

  // tweet 제출 이벤트
  const onSubmit = async (event) => {
    if (!nweet) return
    event.preventDefault()

    let photoUrl = ''
    if (photo !== '') {
      const photoRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`) // 유저 ID 기반, 파일에 대한 reference 생성
      const response = await photoRef.putString(photo, 'data_url')
      photoUrl = await response.ref.getDownloadURL()
    }

    const nweetItem = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj?.uid,
      photoUrl
    }
    await dbService.collection('nweets').add(nweetItem)
    setNweet('')
    setPhoto('')
  }

  // 트윗 작성 input Change 이벤트
  const onChange = (event) => {
    const {
      target: { value }
    } = event
    if (value) setNweet(value)
  }

  // 썸네일 이미지 변경 이벤트
  const onFileChange = (event) => {
    const {
      target: { files }
    } = event
    const file = files[0]

    const reader = new FileReader()
    reader.onloadend = (finishidEvent) => { // finishidEvent: 파일을 가져온 후 이벤트 객체
      const {
        currentTarget: { result }
      } = finishidEvent
      setPhoto(result)
    }
    reader.readAsDataURL(file) // reader로 읽은 파일 데이터를 가져옴
  }

  // 업로드 이미지 clear 이벤트
  const onClearPhoto = () => setPhoto('')

  return (
    <form
      onSubmit={onSubmit}
      className="factoryForm"
    >
      <div className="factoryInput__container">
        <input
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          value={nweet}
          onChange={onChange}
          className="factoryInput__input"
        />
        <input
          type="submit"
          value="&rarr;"
          className="factoryInput__arrow"
        />
      </div>
      <label
        htmlFor="attach-file"
        className="factoryInput__label"
      >
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {photo && (
        <div className="factoryForm__attachment">
          <img
            src={photo}
            style={{
              backgroundImage: photo,
            }}
            alt="tweet 썸네일"
          />
          <div
            className="factoryForm__clear"
            onClick={onClearPhoto}
          >
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  )
}
export default NweetFactory