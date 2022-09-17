import Nweet from 'components/Nweet'
import { dbService } from 'fbase'
import React, { useEffect, useState } from 'react'

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState('')
  const [nweetList, setNweetList] = useState([])

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
  const onChange = (event) => {
    const {
      target: { value }
    } = event
    if (value) setNweet(value)
  }

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
          type="submit"
          value="Nweet"
        />
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