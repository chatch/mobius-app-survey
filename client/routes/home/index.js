import { h, Component } from 'preact'
import { route } from 'preact-router'

import Button from 'preact-material-components/Button'
import Dialog from 'preact-material-components/Dialog'
import 'preact-material-components/Button/style.css'
import 'preact-material-components/Dialog/style.css'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import NewSurveyDialog from '../../components/new-survey-dialog'
import Spinner from '../../components/spinner'
import api from '../../api'

const SurveyTable = ({ loading, surveys, onClickDelete }) => {
  const runSurvey = el => route(`/view/${el.target.id}`)
  const resultsSurvey = el => route(`/results/${el.target.id}`)
  const deleteSurvey = el => onClickDelete(el.target.id)
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
    pendingDeleteSurveyId: null,
    surveys: []
  }

  constructor() {
    super()
    this.onClickDelete = this.onClickDelete.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.cancelDelete = this.cancelDelete.bind(this)
  }

  componentDidMount() {
    this.loadSurveys()
  }

  loadSurveys() {
    api
      .surveys()
      .then(result => this.setState({ loading: false, surveys: result }))
  }

  onClickDelete(id) {
    console.log(`onClickDelete: ${id}`)
    this.setState({
      pendingDeleteSurveyId: id
    })
    this.confirmDeleteDialog.MDComponent.show()
  }

  handleDelete() {
    const surveyId = this.state.pendingDeleteSurveyId
    console.log(`handleDelete: ${surveyId}`)
    if (surveyId && surveyId !== null) {
      this.setState({ loading: true })
      api.deleteSurvey(surveyId).then(() => {
        // hideous hack: state updated not forcing a rerender for some reason ..
        window.location.href = '/'
      })
    }
  }

  cancelDelete() {
    this.confirmDeleteDialog.MDComponent.close()
    this.setState({ pendingDeleteSurveyId: null })
  }

  render() {
    return (
      <div id="home">
        <h1>Surveys</h1>
        <NewSurveyDialog />
        {this.state.loading === true && <Spinner />}
        <SurveyTable
          loading={this.state.loading}
          surveys={this.state.surveys}
          onClickDelete={this.onClickDelete}
        />
        <Dialog
          ref={thisDialog => {
            this.confirmDeleteDialog = thisDialog
          }}
        >
          <Dialog.Header>Confirm Delete</Dialog.Header>
          <Dialog.Body>
            Are you sure you want to Delete this Survey?
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.FooterButton onClick={this.cancelDelete}>
              Cancel
            </Dialog.FooterButton>
            <Dialog.FooterButton onClick={this.handleDelete}>
              Confirm
            </Dialog.FooterButton>
          </Dialog.Footer>
        </Dialog>
      </div>
    )
  }
}
