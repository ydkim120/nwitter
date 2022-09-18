import Nweet from 'components/Nweet'
import { dbService } from 'fbase'
import React, { useEffect, useState } from 'react'

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState('')
  const [nweetList, setNweetList] = useState([])

  const [photo, setPhoto] = useState()

  // 요런 방식은 좀 구식
  // const getNweets = async () => {
  //   const response = await dbService.collection('nweets').get()
  //   response.forEach(doc => {
  //     const nweetObject = {
  //       ...doc.data(),
  //       id: doc.id
  //     }
  //     setNweetList((prev) => [nweetObject, ...prev]) // set 함수의 경우 함수로 작성할 수 있으며, 이전 값에 접근할 수 있다.
  //   })
  // }
  useEffect(() => {
    // getNweets()
    dbService.collection('nweets').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
      const nweetArr = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setNweetList(nweetArr)
    })
  }, [])
  const onSubmit = async (event) => {
    event.preventDefault()
    await dbService.collection('nweets').add({
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj?.uid
    })
    setNweet('')
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
  const onClearPhoto = () => setPhoto(null)

  return (
    <div>
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
      <div>
        {nweetList.map(item => (
          <Nweet
            key={item.id}
            nweetObj={item}
            isOwner={item.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  )
}
export default Home