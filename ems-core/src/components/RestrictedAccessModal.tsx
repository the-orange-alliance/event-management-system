import * as React from "react";
import {Button, Form, Icon, InputProps, Modal} from "semantic-ui-react";
import {SyntheticEvent} from "react";

// TODO - Implement administrator PIN from redux that is read in through config.
interface IProps {
  open: boolean,
  onClose: () => void
  onSuccess: () => void
}

interface IState {
  pin: string,
  valid: boolean
}

class RestrictedAccessModal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      pin: "",
      valid: true
    };
    this.validateAndAct = this.validateAndAct.bind(this);
    this.updatePIN = this.updatePIN.bind(this);
  }

  public render() {
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
        closeOnDimmerClick={true}
        size='mini'
      >
        <Modal.Header>This Action Has Restricted Access</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label="Administrator Password"
              value={this.state.pin}
              onChange={this.updatePIN}
              error={!this.state.valid}
              type="password"
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.validateAndAct}>
            <Icon name='checkmark' /> Proceed
          </Button>
          <Button color='red' onClick={this.props.onClose}>
            <Icon name='remove' /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private validateAndAct() {
    if (this.state.pin === "FGCadmin#1") {
      this.props.onClose();
      this.props.onSuccess();
    } else {
      this.setState({valid: false})
    }
  }

  private updatePIN(event: SyntheticEvent, props: InputProps) {
    this.setState({pin: props.value});
  }
}

export default RestrictedAccessModal;