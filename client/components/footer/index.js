import { h, Component } from 'preact'
import LayoutGrid from 'preact-material-components/LayoutGrid'
import 'preact-material-components/LayoutGrid/style.css'
import style from './style'

export default class Footer extends Component {
  render() {
    return (
      <footer>
        <LayoutGrid>
          <LayoutGrid.Inner>
            <LayoutGrid.Cell cols={4}>
              Powered by{' '}
              <a
                href="https://mobius.network/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Mobius
              </a>,{' '}
              <a
                href="https://stellar.org/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Stellar
              </a>{' '}
              and{' '}
              <a
                href="https://surveyjs.io/"
                rel="noopener noreferrer"
                target="_blank"
              >
                SurveyJS
              </a>
            </LayoutGrid.Cell>
            <LayoutGrid.Cell cols={4} />
            <LayoutGrid.Cell cols={4}>
              Source code @{' '}
              <a
                href="https://github.com/chatch/mobius-app-survey"
                rel="noopener noreferrer"
                target="_blank"
              >
                Deconet
              </a>
            </LayoutGrid.Cell>
          </LayoutGrid.Inner>
        </LayoutGrid>
      </footer>
    )
  }
}
