import { h, Component } from 'preact'
import { route } from 'preact-router'
import Tabs from 'preact-material-components/Tabs'
import Toolbar from 'preact-material-components/Toolbar'
import 'preact-material-components/Tabs/style.css'
import 'preact-material-components/Toolbar/style.css'

import api from '../../api'
import { SESSION_TIMEOUT } from '../error'

export default class Header extends Component {
  state = {
    activeTabIndex: 0,
    balance: null
  }

  componentDidMount() {
    api
      .balance()
      .then(balance => this.setState({ balance }))
      .catch(err => {
        console.error(`Get balance failed: ${err.toString() + err.message}`)
        if (err.message === SESSION_TIMEOUT)
          route(`/error/?error=${SESSION_TIMEOUT}`)
      })
  }

  render() {
    return (
      <Toolbar className="toolbar">
        <Toolbar.Row>
          <Toolbar.Section align-start style={{ paddingLeft: 30 }}>
            <a href="/" className="toolbar-title-link">
              <img
                src="/assets/icons/logo-white.svg"
                width={30}
                height={30}
                style={{ position: 'relative', top: 8 }}
              />
              <Toolbar.Title>Survey Rewards</Toolbar.Title>
            </a>
          </Toolbar.Section>
          <Toolbar.Section align-end>
            <Tabs activeTabIndex={this.state.activeTabIndex}>
              <Tabs.Tab href="/">Surveys</Tabs.Tab>
              <Tabs.Tab href="/about">About</Tabs.Tab>
            </Tabs>
            {this.state.userBalance !== null && (
              <div>Balance: {this.state.balance} MOBI</div>
            )}
          </Toolbar.Section>
        </Toolbar.Row>
      </Toolbar>
    )
  }
}
