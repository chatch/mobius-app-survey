import React, { Component } from 'react'
import {
  SurveyEditor as SurveyJSEditor,
  StylesManager as SurveyJSStylesManager
} from 'surveyjs-editor'
import 'surveyjs-editor/surveyeditor.css'

import api from '../../api'

const EDITOR_OPTIONS = {
  // TODO: add more question types for richer surveys
  questionTypes: ['text', 'checkbox', 'radiogroup', 'dropdown']
}
const EDITOR_THEME = 'darkblue'

class SurveyEditor extends Component {
  state = {
    survey: {}
  }

  handleSave = () => {
    const survey = Object.assign({}, this.state.survey, {
      json: this.editor.text
    })
    api.updateSurvey(survey).then(() => console.log(`SAVED`))
  }

  componentDidMount() {
    SurveyJSStylesManager.applyTheme(EDITOR_THEME)
    this.editor = new SurveyJSEditor('surveyEditorContainer', EDITOR_OPTIONS)
    this.editor.saveSurveyFunc = this.handleSave
    api.survey(this.props.surveyId).then(survey => {
      this.editor.text = survey.json
      this.setState({ survey })
    })
  }

  render() {
    return <div id="surveyEditorContainer" />
  }
}

export default SurveyEditor
