import * as React from 'react';
import {Cookies, withCookies} from 'react-cookie';
import './App.css';
import Event from "./shared/models/Event";
import {Redirect, Route, RouteComponentProps} from "react-router";
import LoginView from "./views/LoginView";
import MainView from "./views/MainView";
import RedView from "./views/RedView";
import BlueView from "./views/BlueView";
import HeadRefereeView from "./views/HeadRefereeView";

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
    this.renderRedView = this.renderRedView.bind(this);
    this.renderBlueView = this.renderBlueView.bind(this);
    this.renderHeadRefereeView = this.renderHeadRefereeView.bind(this);
    this.renderMainView = this.renderMainView.bind(this);
  }

  public render() {
    return (
      <div id="app-container">
        <Route exact={true} path="/" render={this.renderLoginView}/>
        <Route path="/main" render={this.renderMainView}/>
        <Route path="/red-view" render={this.renderRedView}/>
        <Route path="/blue-view" render={this.renderBlueView}/>
        <Route path="/ref-view" render={this.renderHeadRefereeView}/>
      </div>
    );
  }

  private navigateToMain(props: RouteComponentProps<any>) {
    props.history.push("/main");
  }

  private navigateToLogin(props: RouteComponentProps<any>) {
    props.history.push("/");
  }

  private navigateToRedView(props: RouteComponentProps<any>) {
    props.history.push("/red-view");
  }

  private navigateToBlueView(props: RouteComponentProps<any>) {
    props.history.push("/blue-view");
  }

  private navigateToHeadRefView(props: RouteComponentProps<any>) {
    props.history.push("/ref-view");
  }

  private renderLoginView(props: RouteComponentProps<any>) {
    const navigateToMain = this.navigateToMain.bind(this, props);
    if (typeof this.props.cookies.get("login") !== "undefined" &&
      this.props.cookies.get("login")) {
      return <Redirect to={"/main"}/>
    } else {
      return <LoginView cookies={this.props.cookies} onSuccessfulLogin={navigateToMain}/>;
    }
  }

  private renderRedView(props: RouteComponentProps<any>) {
    if (typeof this.props.cookies.get("login") === "undefined" ||
      !this.props.cookies.get("login")) {
      return <Redirect to={"/"}/>
    } else {
      return <RedView/>;
    }
  }

  private renderBlueView(props: RouteComponentProps<any>) {
    if (typeof this.props.cookies.get("login") === "undefined" ||
      !this.props.cookies.get("login")) {
      return <Redirect to={"/"}/>
    } else {
      return <BlueView/>;
    }
  }

  private renderHeadRefereeView(props: RouteComponentProps<any>) {
    if (typeof this.props.cookies.get("login") === "undefined" ||
      !this.props.cookies.get("login")) {
      return <Redirect to={"/"}/>
    } else {
      return <HeadRefereeView/>;
    }
  }

  private renderMainView(props: RouteComponentProps<any>) {
    const navigateToLogin = this.navigateToLogin.bind(this, props);
    const navigateToRed = this.navigateToRedView.bind(this, props);
    const navigateToBlue = this.navigateToBlueView.bind(this, props);
    const navigateToHeadRef = this.navigateToHeadRefView.bind(this, props);
    return <MainView
      cookies={this.props.cookies}
      onLoginFailure={navigateToLogin}
      connected={false}
      onRedAllianceLogin={navigateToRed}
      onBlueAllianceLogin={navigateToBlue}
      onHeadRefereeLogin={navigateToHeadRef}
    />;
  }
}

export default withCookies(App);