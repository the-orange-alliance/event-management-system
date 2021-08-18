import * as React from 'react';
import {Cookies} from 'react-cookie';
import {EMSProvider, Event, SocketProvider} from "@the-orange-alliance/lib-ems";
import {Button, Form, Grid, Header, Message, Segment} from "semantic-ui-react";

interface IProps {
  cookies: Cookies,
  event: Event,
  onSuccessfulLogin: () => void
}

interface IState {
  username: string,
  password: string,
  loading: boolean,
  errorMsg: string | null,
  successMsg: string | null,
  showResetPass: boolean
}

class LoginView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loading: false,
      errorMsg: null,
      successMsg: null,
      showResetPass: false
    };
  }

  public render() {
    return (
      <>{!this.state.showResetPass &&
      <Grid textAlign='center' style={{height: '90vh'}} verticalAlign='middle'>
          <Grid.Column style={{maxWidth: 450}}>
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
                      <Button color='green' fluid size='large' onClick={() => this.login()}
                              disabled={this.state.loading}>{this.state.loading ? "Logging in..." : "Login"}</Button>
                  </Segment>
              </Form>
              <Message color={'red'} hidden={!this.state.errorMsg}>
                {this.state.errorMsg}
              </Message>
              <Message color={'green'} hidden={!this.state.successMsg}>
                {this.state.successMsg}
              </Message>
              <Message>
                  Default login is <p>Username: <code>ems-admin</code></p> <p>Password: <code>admin</code></p>
              </Message>
          </Grid.Column>
      </Grid>
      }</>
    );
  }

  private login(): void {
    this.setState({loading: true});
    EMSProvider.authPassword(this.state.username, this.state.password).then((key: string) => {
      this.setState({errorMsg: null});
      if(this.state.password === 'admin') {
        this.setState({showResetPass: true});
      } else {
        SocketProvider.reconnect();
        this.props.cookies.set('login', key);
        this.props.onSuccessfulLogin();
      }
    }).catch(() => {
      this.setState({errorMsg: 'Invalid username/password!', successMsg: null, loading: false});
    })
  }
}

export default LoginView;
