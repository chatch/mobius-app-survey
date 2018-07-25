import { h, Component } from 'preact'
import ReactTable from 'react-table'
import { Model } from 'survey-react'
import 'react-table/react-table.css'

import api from '../../api'

const ResultTable = ({ loading, results, columns }) => (
  <ReactTable
    data={results}
    columns={columns}
    loading={loading}
    minRows={10}
    noDataText="No results yet!"
    showPagination
    style={{ marginTop: 30 }}
  />
)

export default class Home extends Component {
  state = {
    loading: true,
    results: [],
    survey: {}
  }

  componentDidMount() {
    const surveyId = this.props.surveyId
    return Promise.all([api.survey(surveyId), api.results(surveyId)]).then(
      ([survey, results]) => this.setState({ survey, results, loading: false })
    )
  }

  render() {
    let columns = []
    let resultData = []

    if (this.state.survey.json && this.state.results.length > 0) {
      const survey = new Model(this.state.survey.json)
      const questions = survey.getAllQuestions()

      columns = questions.map(q => ({ Header: q.title, accessor: q.name }))

      resultData = this.state.results.map(res => {
        const answers = JSON.parse(res.json)
        return Object.keys(answers).reduce((accumulator, qKey) => {
          let result = answers[qKey]
          result = result instanceof Array ? result.join(',') : result
          accumulator[qKey] = result
          return accumulator
        }, {})
      })
    }

    return (
      <div id="home">
        <h1>Results</h1>
        <ResultTable
          loading={this.state.loading}
          results={resultData}
          columns={columns}
        />
      </div>
    )
  }
}
