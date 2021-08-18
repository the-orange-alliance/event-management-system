import * as React from 'react';
import {EMSProvider, ResetPassword as RP} from "@the-orange-alliance/lib-ems";
import {Button, Form, Grid, Header, Message, Segment} from "semantic-ui-react";

interface IProps {
  callback: () => void,
  customMsgText?: string
}

interface IState {
  oldPassword: string,
  newPassword: string,
  newPasswordRepeat: string,
  error: string | null,
  showResetPass: boolean
}

class ResetPasswordContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      newPasswordRepeat: '',
      error: null,
      showResetPass: false
    }
  }

  public componentDidMount() {

  }

  public render() {
    return (
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='green' textAlign='center'>
            Change Password
          </Header>
          <Form size='large'>
            <Segment stacked>
              <Form.Input
                fluid
                icon='user'
                iconPosition='left'
                placeholder='Old Password'
                type='password'
                value={this.state.oldPassword}
                onChange={(e) => this.setState({oldPassword: e.target.value})}
              />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='New Password'
                type='password'
                value={this.state.newPassword}
                onChange={(e) => this.setState({newPassword: e.target.value})}
              />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Verify New Password'
                type='password'
                value={this.state.newPasswordRepeat}
                onChange={(e) => this.setState({newPasswordRepeat: e.target.value})}
              />
              <Button color='green' fluid size='large' onClick={() => this.reset()}>Reset</Button>
            </Segment>
          </Form>
          <Message color={'yellow'} hidden={!this.props.customMsgText}>
            {this.props.customMsgText}
          </Message>
          <Message color={'red'} hidden={!this.state.error}>
            {this.state.error}
          </Message>
        </Grid.Column>
      </Grid>
    );
  }

  private reset(): void {
    if (this.state.newPassword !== this.state.newPasswordRepeat) {
      this.setState({error: 'Passwords do not match'});
      return;
    }
    const passwords = new RP();
    passwords.oldPassword = this.state.oldPassword;
    passwords.newPassword = this.state.newPassword;
    passwords.newPasswordVerifier = this.state.newPasswordRepeat;
    EMSProvider.resetPassword(passwords).then(() => {
      this.props.callback();
    }).catch(() => {
      this.setState({error: 'Incorrect Password'});
    })
  }
}

export default ResetPasswordContainer;
