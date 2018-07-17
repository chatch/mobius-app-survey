import { h, Component } from 'preact'
import { Router } from 'preact-router'

import Header from './header'
import Footer from './footer'
import AuthTokenHandler from './auth-token-handler'

import About from '../routes/about'
import Home from '../routes/home'
import Profile from '../routes/profile'
import SurveyView from '../routes/view'
import SurveyEditor from '../routes/edit'

export default class App extends Component {
  render() {
    return (
      <AuthTokenHandler>
        <div id="app">
          <Header />
          <div id="body">
            <Router>
              <Home path="/" />
              <About path="/about" />
              <Profile path="/profile/" user="me" />
              <Profile path="/profile/:user" />
              <SurveyView path="/view" />
              <SurveyEditor path="/edit" />
            </Router>
          </div>
          <Footer />
        </div>
      </AuthTokenHandler>
    )
  }
}
