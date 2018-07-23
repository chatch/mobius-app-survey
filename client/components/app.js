import { h, Component } from 'preact'
import { Router } from 'preact-router'

import Header from './header'
import Footer from './footer'
import AuthTokenHandler from './auth-token-handler'
import { default as Error, UNKNOWN_ROUTE } from './error'

import About from '../routes/about'
import Home from '../routes/home'
import Results from '../routes/results'
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
              <Results path="/results/:surveyId" />
              <SurveyView path="/view/:surveyId" />
              <SurveyEditor path="/edit/:surveyId" />
              <Error error={UNKNOWN_ROUTE} default />
            </Router>
          </div>
          <Footer />
        </div>
      </AuthTokenHandler>
    )
  }
}
