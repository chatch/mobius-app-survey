import { h, Component } from 'preact'

import Button from 'preact-material-components/Button'
import Dialog from 'preact-material-components/Dialog'
import TextField from 'preact-material-components/TextField'
import 'preact-material-components/Button/style.css'
import 'preact-material-components/Dialog/style.css'
import 'preact-material-components/TextField/style.css'

const DEFAULT_COMPLETIONS = 50
const DEFAULT_FEE_PER_COMPLETION = 1

const BASE_FEE = 10

export default class NewSurveyDialog extends Component {
  state = {
    completions: DEFAULT_COMPLETIONS,
    feePerCompletion: DEFAULT_FEE_PER_COMPLETION,
    totalFee: this.calculateTotalFee(
      DEFAULT_COMPLETIONS,
      DEFAULT_FEE_PER_COMPLETION
    )
  }

  constructor() {
    super()
    this.onAccept = this.onAccept.bind(this)
    this.onClickAdd = this.onClickAdd.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
  }

  onAccept() {
    console.log(`vcan`)
    // createSurvey('NewSurvey' + Date.now(), loadSurveys)
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
      <div>
        <Dialog
          ref={dialog => {
            this.dialog = dialog
          }}
          onAccept={this.onAccept}
        >
          <Dialog.Header>Add New Survey</Dialog.Header>
          <Dialog.Body>
            <form>
              <TextField
                name="completions"
                helperText="How many people do you want to complete this survey?"
                label="Completions"
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
            <Dialog.FooterButton accept>Create</Dialog.FooterButton>
          </Dialog.Footer>
        </Dialog>
        <Button raised ripple onClick={this.onClickAdd}>
          Add
        </Button>
      </div>
    )
  }
}
