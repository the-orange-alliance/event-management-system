import * as React from 'react';
import {EMSProvider, SocketProvider} from "@the-orange-alliance/lib-ems";
import {Button, Form, Grid, Header, Message, Segment} from "semantic-ui-react";
import ResetPassword from "./ResetPasswordContainer";

interface IProps {
  callback: () => void;
}

interface IState {
  username: string,
  password: string,
  error: string | null,
  successMsg: string | null,
  showResetPass: boolean,
  loading: boolean
}

class LoginContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: null,
      successMsg: null,
      showResetPass: false,
      loading: false
    }
  }

  public render() {
    return (
      <>{!this.state.showResetPass &&
      <Grid textAlign='center' style={{ height: '90vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='green' textAlign='center'>
            Login to EMS
          </Header>
          <Form size='large'>
            <Segment stacked>
              <Form.Input
                fluid
                icon='user'
                iconPosition='left'
                placeholder='Username'
                disabled={this.state.loading}
                value={this.state.username}
                onChange={(e) => this.setState({username: e.target.value})}
              />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                disabled={this.state.loading}
                type='password'
                value={this.state.password}
                onChange={(e) => this.setState({password: e.target.value})}
              />
              <Button color='green' fluid size='large' onClick={() => this.login()} disabled={this.state.loading}>{this.state.loading ? "Logging in..." : "Login"}</Button>
            </Segment>
          </Form>
          <Message color={'red'} hidden={!this.state.error}>
            {this.state.error}
          </Message>
          <Message color={'green'} hidden={!this.state.successMsg}>
            {this.state.successMsg}
          </Message>
          <Message>
            Default login is <p>Username: <code>ems-admin</code></p> <p>Password: <code>admin</code></p>
          </Message>
        </Grid.Column>
      </Grid>
      }
      {this.state.showResetPass &&
        <ResetPassword
            customMsgText={"You are using the default password. It is recommended you change it before continuing with event setup."}
            callback={() => {this.setState({loading: false, showResetPass: false, successMsg: "Password set successfully. Please sign in again.", error: null, password: ''})}}
        />
      }
      </>
    );
  }

  private login(): void {
    this.setState({loading: true});
    EMSProvider.authPassword(this.state.username, this.state.password).then((key: string) => {
      this.setState({error: null});
      if(this.state.password === 'admin') {
        this.setState({showResetPass: true});
      } else {
        SocketProvider.reconnect();
        localStorage.setItem('auth', key);
        this.props.callback();
      }
    }).catch(() => {
      this.setState({error: 'Invalid username/password!', successMsg: null, loading: false});
    })
  }
}

export default LoginContainer;
