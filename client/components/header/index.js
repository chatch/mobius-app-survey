import { h, Component } from 'preact'
import Tabs from 'preact-material-components/Tabs'
import Toolbar from 'preact-material-components/Toolbar'
import 'preact-material-components/Tabs/style.css'
import 'preact-material-components/Toolbar/style.css'

import api from '../../api'

export default class Header extends Component {
  state = {
    activeTabIndex: 0,
    balance: null
  }

  componentDidMount() {
    api.balance().then(balance => this.setState({ balance }))
  }

  render() {
    return (
      <Toolbar className="toolbar">
        <Toolbar.Row>
          <Toolbar.Section align-start>
            <Toolbar.Title>Survey Rewards</Toolbar.Title>
          </Toolbar.Section>
          <Toolbar.Section align-end>
            <Tabs activeTabIndex={this.state.activeTabIndex}>
              <Tabs.Tab href="/">Surveys</Tabs.Tab>
              <Tabs.Tab href="/profile">Profile</Tabs.Tab>
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
