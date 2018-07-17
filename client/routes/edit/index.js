import React, { Component } from 'react'
import {
  SurveyEditor as SurveyJSEditor,
  StylesManager as SurveyJSStylesManager
} from 'surveyjs-editor'
import 'surveyjs-editor/surveyeditor.css'

const EDITOR_OPTIONS = {
  // TODO: add more question types for richer surveys
  questionTypes: ['text', 'checkbox', 'radiogroup', 'dropdown']
}
const EDITOR_THEME = 'darkblue'

class SurveyEditor extends Component {
  saveMySurvey = () => {
    console.log(JSON.stringify(this.editor.text))
  }

  componentDidMount() {
    SurveyJSStylesManager.applyTheme(EDITOR_THEME)
    this.editor = new SurveyJSEditor('surveyEditorContainer', EDITOR_OPTIONS)
    this.editor.saveSurveyFunc = this.saveMySurvey
  }

  render() {
    return <div id="surveyEditorContainer" />
  }
}

export default SurveyEditor
