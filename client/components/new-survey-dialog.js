import { h, Component } from 'preact'
import Button from 'preact-material-components/Button'
import Dialog from 'preact-material-components/Dialog'
import TextField from 'preact-material-components/TextField'
import 'preact-material-components/Button/style.css'
import 'preact-material-components/Dialog/style.css'
import 'preact-material-components/TextField/style.css'

import Spinner from './spinner'
import api from '../api'

const DEFAULT_COMPLETIONS = 1 // 50
const DEFAULT_FEE_PER_COMPLETION = 1

const BASE_FEE = 10

export default class NewSurveyDialog extends Component {
  state = {
    completions: DEFAULT_COMPLETIONS,
    feePerCompletion: DEFAULT_FEE_PER_COMPLETION,
    totalFee: this.calculateTotalFee(
      DEFAULT_COMPLETIONS,
      DEFAULT_FEE_PER_COMPLETION
    ),
    createInProgress: false
  }

  constructor() {
    super()
    this.onClickCreate = this.onClickCreate.bind(this)
    this.onClickAdd = this.onClickAdd.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
  }

  onClickCreate() {
    this.setState({ createInProgress: true })
    api
      .createSurvey({
        name: `NewSurvey-${Date.now()}`,
        completions: this.state.completions
      })
      .then(() => {
        // ugly hard reload the list...
        window.location.href = '/'
      })
    return false
  }

  onClickAdd() {
    this.dialog.MDComponent.show()
  }

  onInputChange({ target }) {
    const { name, value } = target

    let { completions, feePerCompletion } = this.state

    if (name === 'completions') {
      completions = value
    }
    else if (name === 'feePerCompletion') {
      feePerCompletion = value
    }
    else {
      console.error(`what the hell is this?: ${target} ... terminating`)
      return
    }

    this.setState({
      completions,
      feePerCompletion,
      totalFee: this.calculateTotalFee(completions, feePerCompletion)
    })
  }

  calculateTotalFee(completions, feePerCompletion) {
    return completions * feePerCompletion + BASE_FEE
  }

  render() {
    return (
      <div id="new-survey-dialog">
        <Dialog
          ref={dialog => {
            this.dialog = dialog
          }}
        >
          <Dialog.Header>Add New Survey</Dialog.Header>
          <Dialog.Body>
            <form>
              <TextField
                name="completions"
                helperText="How many people do you want to complete this survey?"
                label="Completions"
                height={50}
                value={this.state.completions}
                onKeyup={this.onInputChange}
              />
              <TextField
                name="feePerCompletion"
                helperText="How much MOBI do you want to reward each person?"
                label="Reward per survey"
                value={this.state.feePerCompletion}
                onKeyup={this.onInputChange}
              />

              <div>Fee: 10 MOBI</div>

              <div>Total Cost: {this.state.totalFee} MOBI</div>
            </form>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.FooterButton cancel>Cancel</Dialog.FooterButton>
            <Dialog.FooterButton onClick={this.onClickCreate}>
              Create
            </Dialog.FooterButton>
          </Dialog.Footer>
          {this.state.createInProgress === true && <Spinner />}
        </Dialog>
        <Button raised ripple onClick={this.onClickAdd}>
          Add
        </Button>
      </div>
    )
  }
}
