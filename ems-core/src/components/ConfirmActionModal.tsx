import * as React from "react";
import {Button, Icon, Modal} from "semantic-ui-react";

interface IProps {
  open: boolean,
  onClose: () => void
  onConfirm: () => void,
  innerText: string
}

class ConfirmActionModal extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
        closeOnDimmerClick={true}
        size='tiny'
      >
        <Modal.Header>Confirm Your Action</Modal.Header>
        <Modal.Content>
          {this.props.innerText}
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.props.onConfirm}>
            <Icon name='checkmark' /> Confirm
          </Button>
          <Button color='red' onClick={this.props.onClose}>
            <Icon name='remove' /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ConfirmActionModal;