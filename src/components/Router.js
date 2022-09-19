import React, { useState } from 'react'
import { HashRouter as Router, Redirect, Route, Switch  } from 'react-router-dom'
import Auth from 'routes/Auth'
import Home from 'routes/Home'
import Profile from 'routes/Profile'
import Navigation from 'components/Navigation'

const AppRouter = ({
  isLoggedIn,
  userObj
}) => {
  return (
    <Router>
      {isLoggedIn && <Navigation />}
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <Home userObj={userObj} />
            </Route>
            <Route exact path="/profile">
              <Profile userObj={userObj} />
            </Route>
            {/* 404 페이지 같은 경우 이런 식으로 Redirect를 사용할 수 있음 */}
            {/* <Redirect from="*" to="/" />  */}
          </>
        ) : (
          <>
            <Route exact path="/">
              <Auth />
            </Route>
            {/* <Redirect from="*" to="/" /> */}
          </>
        )}
      </Switch>
    </Router>
  )
}
export default AppRouter