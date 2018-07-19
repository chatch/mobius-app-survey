import { h, Component } from 'preact'
import ReactTable from 'react-table'
import { Survey, Model } from 'survey-react'
import 'react-table/react-table.css'

import api from '../../api'

const ResultTable = ({ loading, results, columns }) => (
  // const columns = [
  //   {
  //     Header: 'Name',
  //     accessor: 'name'
  //   },
  // ]

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
    columns: []
  }

  componentDidMount() {
    const surveyId = this.props.surveyId
    api
      .results(surveyId)
      .then(resultsRsp => this.renderResults(surveyId, resultsRsp))
  }

  renderResults(surveyId, resultsRsp) {
    const survey = new Model({})

    const results = resultsRsp.map(r => JSON.parse(r || '{}'))

    const columns = survey.getAllQuestions().map(q => ({
      data: q.name,
      sTitle: (q.title || '').trim(' ') || q.name,
      mRender(data, type, row) {
        survey.data = row
        let displayValue = q.displayValue
        return (
          (typeof displayValue === 'string'
            ? displayValue
            : JSON.stringify(displayValue)) || ''
        )
      }
    }))

    // columns.push({
    //   targets: -1,
    //   data: null,
    //   sortable: false,
    //   defaultContent:
    //     "<button style='min-width: 150px;'>Show in Survey</button>"
    // });

    this.setState({ loading: false, results, columns })
  }

  render() {
    return (
      <div id="home">
        <h1>Results</h1>
        <ResultTable
          loading={this.state.loading}
          results={this.state.results}
          columns={this.state.columns}
        />
      </div>
    )
  }
}
