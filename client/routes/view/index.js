import { h, Component } from 'preact'
import { Survey, Model } from 'survey-react'
import 'survey-react/survey.css'

import api from '../../api'

class SurveyView extends Component {
  state = { survey: {} }

  componentDidMount() {
    api.survey(this.props.surveyId).then(survey => {
      this.setState({ survey })
    })
  }

  onComplete(surveyId, result) {
    api
      .createResult({ surveyId, surveyResult: result })
      .then(() => console.log('saved result'))
  }

  onValueChanged(result) {
    console.log('value changed!')
  }

  render() {
    if (!this.state.survey.json) {
      return
    }

    Survey.cssType = 'standard'
    const model = new Model(this.state.survey.json)

    return (
      <div className="SurveyView">
        <h1>SurveyJS library in action:</h1>
        <Survey
          model={model}
          onComplete={({ data: result }) =>
            this.onComplete(this.props.surveyId, result)
          }
          onValueChanged={this.onValueChanged}
        />
      </div>
    )
  }
}

export default SurveyView
