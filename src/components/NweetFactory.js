import { dbService, storageService } from 'fbase'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState('')
  const [photo, setPhoto] = useState('')

  // tweet 제출 이벤트
  const onSubmit = async (event) => {
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
    <form onSubmit={onSubmit}>
      <input
        type="test"
        placeholder="What's on your mind?"
        maxLength={120}
        value={nweet}
        onChange={onChange}
      />
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
      />
      <input
        type="submit"
        value="Nweet"
      />
      {photo && (
        <div>
          <img
            src={photo}
            width="50px"
            height="50px"
            alt="tweet 썸네일"
          />
          <button onClick={onClearPhoto}>Clear</button>
        </div>
      )}
    </form>
  )
}
export default NweetFactory