import { h, Component } from 'preact'
import { Survey, Model } from 'survey-react'
import 'survey-react/survey.css'

import api from '../../api'

class SurveyView extends Component {
  state = { survey: {} }

  constructor() {
    super()
    this.onComplete = this.onComplete.bind(this)
  }

  componentDidMount() {
    api.survey(this.props.surveyId).then(survey => {
      this.setState({ survey })
    })
  }

  onComplete({ data: result }) {
    api
      .createResult({ surveyId: this.props.surveyId, surveyResult: result })
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
        <h1>{this.state.survey.name}</h1>
        <Survey
          model={model}
          onComplete={this.onComplete}
          onValueChanged={this.onValueChanged}
        />
      </div>
    )
  }
}

export default SurveyView
