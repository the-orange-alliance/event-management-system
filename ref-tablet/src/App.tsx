import * as React from 'react';
import {Cookies, withCookies} from 'react-cookie';
import './App.css';
import Event from "./shared/models/Event";
import {Route, RouteComponentProps} from "react-router";
import LoginView from "./views/LoginView";
import MainView from "./views/MainView";

interface IProps {
  cookies: Cookies
}

interface IState {
  event: Event
}

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      event: new Event()
    };
    this.renderLoginView = this.renderLoginView.bind(this);
    this.renderMainView = this.renderMainView.bind(this);
  }

  public render() {
    return (
      <div id="app-container">
        <Route exact={true} path="/" render={this.renderLoginView}/>
        <Route path="/main" render={this.renderMainView}/>
      </div>
    );
  }

  private navigateToMain(props: RouteComponentProps<any>) {
    props.history.push("/main");
  }

  private navigateToLogin(props: RouteComponentProps<any>) {
    props.history.push("/");
  }

  private renderLoginView(props: RouteComponentProps<any>) {
    const navigateToMain = this.navigateToMain.bind(this, props);
    return <LoginView cookies={this.props.cookies} onSuccessfulLogin={navigateToMain}/>;
  }

  private renderMainView(props: RouteComponentProps<any>) {
    const navigateToLogin = this.navigateToLogin.bind(this, props);
    return <MainView cookies={this.props.cookies} onLoginFailure={navigateToLogin}/>;
  }
}

export default withCookies(App);