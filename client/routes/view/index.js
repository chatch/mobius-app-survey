import { h, Component } from 'preact'
import {
  Survey,
  Model,
  StylesManager as SurveyJSStylesManager
} from 'survey-react'
import 'survey-react/survey.css'

import api from '../../api'
import Error from '../../components/error'
import Spinner from '../../components/spinner'

class SurveyView extends Component {
  state = {
    loading: true,
    survey: {}
  }

  constructor() {
    super()
    this.onComplete = this.onComplete.bind(this)
  }

  componentDidMount() {
    Survey.cssType = 'standard'
    SurveyJSStylesManager.applyTheme('darkblue')
    api.survey(this.props.surveyId).then(survey => {
      this.setState({ survey, loading: false })
    })
  }

  onComplete({ data: result }, { showDataSavingClear, showDataSavingError }) {
    this.setState({ loading: true })
    showDataSavingClear()
    return api
      .createResult({ surveyId: this.props.surveyId, surveyResult: result })
      .then(rsp => {
        this.setState({ loading: false })
        console.log(`createResult returned: rsp: ${JSON.stringify(rsp)}`)
        if (rsp.error && rsp.error.message)
          this.setState({ completionError: rsp.error.message })
      })
  }

  render() {
    if (!this.state.survey.json) return null

    if (this.state.completionError)
      return (
        <Error
          error="Survey Completion Error"
          extra={this.state.completionError}
        />
      )

    const model = new Model(this.state.survey.json)

    return (
      <div className="SurveyView">
        <h1>{this.state.survey.name}</h1>
        {this.state.loading === true && <Spinner />}
        <Survey
          model={model}
          onComplete={this.onComplete}
          showCompletedPage={false}
        />
      </div>
    )
  }
}

export default SurveyView
