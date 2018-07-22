import { h, Component } from 'preact'
import Modal from 'react-responsive-modal'
import Spinner from 'react-md-spinner'
import style from './style.css'

class SpinnerModal extends Component {
  render() {
    return (
      <Modal
        style={style}
        classNames={{ overlay: 'custom-overlay', modal: 'custom-modal' }}
        open
        center
        onClose={() => {}}
        closeIconSize={0}
      >
        <Spinner
          size="80"
          duration={2000}
          color1="#3c4f6d"
          color2="#62728a"
          color3="#8a95a7"
          color4="#b1b8c4"
        />
      </Modal>
    )
  }
}

export default SpinnerModal
