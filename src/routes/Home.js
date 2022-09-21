import React, { useEffect, useState } from 'react'
import Nweet from 'components/Nweet'
import { dbService } from 'fbase'
import NweetFactory from 'components/NweetFactory'

const Home = ({ userObj }) => {
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

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
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