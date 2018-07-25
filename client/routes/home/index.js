import { h, Component } from 'preact'
import { route } from 'preact-router'

import Button from 'preact-material-components/Button'
import Dialog from 'preact-material-components/Dialog'
import IconButton from 'preact-material-components/IconButton'
import 'preact-material-components/Button/style.css'
import 'preact-material-components/Dialog/style.css'
import 'preact-material-components/IconButton/style.css'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import api from '../../api'
import NewSurveyDialog from '../../components/new-survey-dialog'
import Spinner from '../../components/spinner'
import storage from '../../storage'

const steexpAddr =
  window.location.host === 'surveyrewards.network'
    ? 'https://steexp.com'
    : 'https://testnet.steexp.com'

const UserLink = ({ userId }) => (
  <span title={userId}>
    <a
      href={`${steexpAddr}/account/${userId}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      {userId.substring(0, 4)}
    </a>
  </span>
)

const SurveyTable = ({ loading, surveys, onClickDelete }) => {
  const runSurvey = el => route(`/view/${el.target.id}`)
  const resultsSurvey = el => route(`/results/${el.target.id}`)
  const deleteSurvey = el => onClickDelete(el.target.id)
  const editSurvey = el => route(`/edit/${el.target.id}`)

  const currentUser = storage.getUser()

  const AdminUserIcon = (icon, onClickFn) => ({
    original: { id, userId: owner }
  }) =>
    owner === currentUser && (
      <IconButton id={id} onClick={onClickFn}>
        {icon}
      </IconButton>
    )

  const centerCellStyle = () => ({
    style: {
      textAlign: 'center'
    }
  })

  const isActive = ({ completions, completionsDone }) =>
    completionsDone < completions

  const columns = [
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Owner',
      Cell: ({ original: { userId } }) => <UserLink userId={userId} />,
      getProps: centerCellStyle
    },
    {
      Header: 'Run',
      Cell: ({ original }) =>
        isActive(original) && (
          <Button id={original.id} ripple raised onClick={runSurvey}>
            Run
          </Button>
        ),
      getProps: centerCellStyle
    },
    {
      Header: 'Completions',
      Cell: ({ original: { completions, completionsDone } }) => (
        <span>{`${completionsDone} / ${completions}`}</span>
      ),
      getProps: centerCellStyle
    },
    {
      Header: 'Results',
      Cell: ({ original: { id } }) => (
        <IconButton id={id} onClick={resultsSurvey}>
          table_chart
        </IconButton>
      ),
      getProps: centerCellStyle
    },
    {
      Header: 'Edit',
      Cell: AdminUserIcon('edit', editSurvey),
      getProps: centerCellStyle
    },
    {
      Header: 'Delete',
      Cell: AdminUserIcon('delete', deleteSurvey),
      getProps: centerCellStyle
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
