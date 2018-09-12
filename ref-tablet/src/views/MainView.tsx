import * as React from 'react';
import {Cookies} from 'react-cookie';

interface IProps {
  cookies: Cookies,
  connected: boolean,
  onLoginFailure: () => void,
  onRedAllianceLogin: () => void,
  onBlueAllianceLogin: () => void,
  onHeadRefereeLogin: () => void
}

class MainView extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    if (typeof this.props.cookies.get("login") === "undefined" ||
        this.props.cookies.get("login") === false) {
      this.props.onLoginFailure();
    }
  }

  public render() {
    const {connected} = this.props;
    return (
      <div id="login-container">
        <div id="login-header">
          Login stuff
        </div>
        <div id="login-body">
          <div id="login-body-status">
            <span>Status: </span><span className={connected ? "success" : "error"}>{connected ? "CONNECTED" : "NOT CONNECTED"}</span>
          </div>
          <div id="login-body-button-container">
            <div className="login-body-button-row">
              <button className="big-button red-btn" onClick={this.props.onRedAllianceLogin}>Red Alliance</button>
              <button className="big-button blue-btn" onClick={this.props.onBlueAllianceLogin}>Blue Alliance</button>
            </div>
            <div className="login-body-button-row">
              <button className="big-button wide yellow-btn" onClick={this.props.onHeadRefereeLogin}>Head Referee</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MainView;