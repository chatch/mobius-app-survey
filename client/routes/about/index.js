import { h, Component } from 'preact'

export default class About extends Component {
  render() {
    return (
      <div>
        <h1>About</h1>
        <div>
          <div>
            Survey Rewards enables users to create surveys and reward those who
            complete surveys with MOBI tokens. It operates like Google Opinion
            Rewards but for the Mobius store.
          </div>
          <div>
            A base fee of 10 MOBI is charged to create a survey. In addition 1
            MOBI per completed survey must be provisioned to reward
            participants. On survey create you can specify how many survey
            completions you would like to target. So for example if you want 100
            users to complete your survey then the cost of survey creation will
            be 100 MOBI (to be payed to 100 users as reward) plus 10 MOBI base
            fee for a total of 110 MOBI.
          </div>
          <div>
            The 10 MOBI base fee is collected by the DApp and will be later
            exchanged for STEM tokens and donated to{' '}
            <a
              href="https://stemchain.io"
              rel="noopener noreferrer"
              target="_blank"
            >
              STEMchain
            </a>{' '}
            approved projects.
          </div>
        </div>
      </div>
    )
  }
}
