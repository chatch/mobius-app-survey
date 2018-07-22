import React, { Component } from 'react'
import {
  SurveyEditor as SurveyJSEditor,
  StylesManager as SurveyJSStylesManager
} from 'surveyjs-editor'
import 'surveyjs-editor/surveyeditor.css'

import api from '../../api'
import Spinner from '../../components/spinner'

const EDITOR_OPTIONS = {
  // TODO: add more question types for richer surveys
  questionTypes: ['text', 'checkbox', 'radiogroup', 'dropdown']
}
const EDITOR_THEME = 'darkblue'

class SurveyEditor extends Component {
  state = {
    loading: true,
    survey: {}
  }

  componentDidMount() {
    SurveyJSStylesManager.applyTheme(EDITOR_THEME)
    this.editor = new SurveyJSEditor('surveyEditorContainer', EDITOR_OPTIONS)
    this.editor.saveSurveyFunc = this.handleSave
    api.survey(this.props.surveyId).then(survey => {
      this.editor.text = survey.json
      this.setState({ survey, loading: false })
    })
  }

  handleSave = () => {
    this.setState({ loading: true })
    const survey = Object.assign({}, this.state.survey, {
      json: this.editor.text
    })
    api.updateSurvey(survey).then(() => this.setState({ loading: false }))
  }

  render() {
    return (
      <div id="survey-edit">
        {this.state.loading === true && <Spinner />}
        <div id="surveyEditorContainer" />
      </div>
    )
  }
}

export default SurveyEditor
