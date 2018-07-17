import { h, Component } from 'preact'

import Button from 'preact-material-components/Button'
import 'preact-material-components/Button/style.css'

import NewSurveyDialog from '../../components/new-survey-dialog'

export default class Home extends Component {
  state = {
    surveys: []
  }

  newSurvey() {}

  componentDidMount() {
    // start a timer for the clock:
    this.timer = setInterval(this.updateTime, 1000)
  }

  // gets called just before navigating away from the route
  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    return (
      <div id="home">
        <h1>Surveys</h1>

        <section>
          <NewSurveyDialog />

          <table>
            <tbody>
              <tr>
                <td data-bind="text: name" />
                <td>
                  <a data-bind="attr: { href: 'survey.html?id=' + ko.unwrap(id) }">
                    Run
                  </a>
                  <a data-bind="attr: { href: 'editor.html?id=' + ko.unwrap(id)+'&name='+ko.unwrap(name) }">
                    Edit
                  </a>
                  <a data-bind="attr: { href: 'results.html?id=' + ko.unwrap(id) }">
                    Results
                  </a>
                  <span data-bind="click: function() { $parent.deleteSurvey(ko.unwrap(id), $parent.loadSurveys); }">
                    Delete
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <div class="fees-notice">
          <div>
            <b>Rewards:</b> Fill out a survey (1 MOBI)
          </div>
          <div>
            <b>Fees:</b> Create New Survey (10 MOBI)
          </div>
          <div>
            <small>
              NOTE: ALL fees will be donated to{' '}
              <a
                href="https://stemchain.io"
                rel="noopener noreferrer"
                target="_blank"
              >
                STEMchain
              </a>{' '}
              projects.
            </small>
          </div>
        </div>
      </div>
    )
  }
}
