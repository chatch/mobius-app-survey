import { h, Component } from 'preact'
import Tabs from 'preact-material-components/Tabs'
import Toolbar from 'preact-material-components/Toolbar'
import 'preact-material-components/Tabs/style.css'
import 'preact-material-components/Toolbar/style.css'
// import style from './style';

export default class Header extends Component {
  state = {
    activeTabIndex: 0
  }

  render() {
    /*
    <div>
      <div>
        <b>Your Balance:</b>{' '}
        <span id="mobi-user-balance">loading ...</span> MOBI
      </div>
      <div>
        <b>DAPP Balance:</b>{' '}
        <span id="mobi-app-balance">loading ...</span> MOBI
      </div>
    </div>
*/
    return (
      <Toolbar className="toolbar">
        <Toolbar.Row>
          <Toolbar.Section align-start>
            <Toolbar.Title>Survey Rewards</Toolbar.Title>
          </Toolbar.Section>
          <Toolbar.Section align-end onClick={this.openSettings}>
            <Tabs activeTabIndex={this.state.activeTabIndex}>
              <Tabs.Tab href="/">Surveys</Tabs.Tab>
              <Tabs.Tab href="/profile">Profile</Tabs.Tab>
              <Tabs.Tab href="/about">About</Tabs.Tab>
            </Tabs>
          </Toolbar.Section>
        </Toolbar.Row>
      </Toolbar>
    )
  }
}
