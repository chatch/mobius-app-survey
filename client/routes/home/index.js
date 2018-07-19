import { h, Component } from 'preact'
import { route } from 'preact-router'
import Button from 'preact-material-components/Button'
import 'preact-material-components/Button/style.css'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import NewSurveyDialog from '../../components/new-survey-dialog'
import api from '../../api'

const SurveyTable = ({ loading, surveys, handleDelete }) => {
  const runSurvey = el => route(`/view/${el.target.id}`)
  const resultsSurvey = el => route(`/results/${el.target.id}`)
  const deleteSurvey = el => handleDelete(el.target.id)
  const editSurvey = el => route(`/edit/${el.target.id}`)

  const columns = [
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Run',
      Cell: ({ original: { id } }) => (
        <Button id={id} onClick={runSurvey}>
          Run
        </Button>
      )
    },
    {
      Header: 'Results',
      Cell: ({ original: { id } }) => (
        <Button id={id} onClick={resultsSurvey}>
          Results
        </Button>
      )
    },
    {
      Header: 'Edit',
      Cell: ({ original: { id } }) => (
        <Button id={id} onClick={editSurvey}>
          Edit
        </Button>
      )
    },
    {
      Header: 'Delete',
      Cell: ({ original: { id } }) => (
        <Button id={id} onClick={deleteSurvey}>
          Delete
        </Button>
      )
    }
  ]

  return (
    <ReactTable
      data={surveys}
      columns={columns}
      loading={loading}
      minRows={3}
      noDataText="No surveys yet!"
      showPagination={false}
      style={{ marginTop: 30 }}
    />
  )
}

export default class Home extends Component {
  state = {
    loading: true,
    surveys: []
  }

  componentDidMount() {
    this.loadSurveys()
  }

  loadSurveys() {
    api
      .surveys()
      .then(result => this.setState({ loading: false, surveys: result }))
  }

  handleDelete(id) {
    api.deleteSurvey(id).then(() => {
      // hideous hack: state updated not forcing a rerender for some reason ..
      window.location.href = '/'
    })
  }

  render() {
    return (
      <div id="home">
        <h1>Surveys</h1>
        <NewSurveyDialog />
        <SurveyTable
          loading={this.state.loading}
          surveys={this.state.surveys}
          handleDelete={this.handleDelete}
        />
      </div>
    )
  }
}
