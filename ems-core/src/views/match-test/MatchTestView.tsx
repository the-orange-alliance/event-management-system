import * as React from "react";
import {Button, Card, Grid} from "semantic-ui-react";
import {getTheme} from "../../shared/AppTheme";
import {IApplicationState} from "../../stores";
import SocketProvider from "../../shared/providers/SocketProvider";
import EMSProvider from "../../shared/providers/EMSProvider";
import {connect} from "react-redux";
import DialogManager from "../../shared/managers/DialogManager";
import HttpError from "../../shared/models/HttpError";
import TOAProvider from "../../shared/providers/TOAProvider";
import TOAConfig from "../../shared/models/TOAConfig";
import WebProvider from "../../shared/providers/WebProvider";

interface IProps {
  slaveModeEnabled?: boolean,
  toaConfig?: TOAConfig
}

interface IState {
  apiTested: boolean,
  sckTested: boolean,
  webTested: boolean,
  toaTested: boolean,
  audTested: boolean,
  apiConnected: boolean,
  sckConnected: boolean,
  webConnected: boolean,
  toaConnected: boolean
  audConnected: boolean
}

class MatchTestView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      apiTested: false,
      sckTested: false,
      webTested: false,
      toaTested: false,
      audTested: false,
      apiConnected: false,
      sckConnected: false,
      webConnected: false,
      toaConnected: false,
      audConnected: false
    };
    this.updateSocketStatus = this.updateSocketStatus.bind(this);
    this.updateAudStatus = this.updateAudStatus.bind(this);
    this.testAPI = this.testAPI.bind(this);
    this.testSocketIO = this.testSocketIO.bind(this);
    this.testWeb = this.testWeb.bind(this);
    this.testTOA = this.testTOA.bind(this);
    this.testAudience = this.testAudience.bind(this);
  }

  public componentDidMount() {
    if (!this.props.toaConfig.enabled) {
      TOAProvider.initialize(new TOAConfig());
    }
    SocketProvider.on("drop", this.updateSocketStatus);
    SocketProvider.on("test-audience-success", this.updateAudStatus);
  }

  public componentWillUnmount() {
    SocketProvider.off("drop");
    SocketProvider.off("test-audience-success");
  }

  public render() {
    const {apiTested, sckTested, audTested, webTested, toaTested, apiConnected, sckConnected, webConnected, audConnected, toaConnected} = this.state;
    const {slaveModeEnabled} = this.props;
    return (
      <div className="view">
        <Card fluid={true} color={getTheme().secondary}>
          <Card.Content className="card-header">
            <Card.Header>Network Test</Card.Header>
          </Card.Content>
          <Card.Content>
            <Grid column={16}>
              <Grid.Row textAlign="center">
                <Grid.Column width={3}/>
                <Grid.Column width={2}><h3>REST API {slaveModeEnabled ? "(MASTER)" : ""}</h3></Grid.Column>
                <Grid.Column width={2}><h3>SocketIO Server</h3></Grid.Column>
                <Grid.Column width={2}><h3>Web Server</h3></Grid.Column>
                <Grid.Column width={2}><h3>TheOrangeAlliance</h3></Grid.Column>
                <Grid.Column width={2}><h3>Audience Display</h3></Grid.Column>
                <Grid.Column width={3}/>
              </Grid.Row>
              <Grid.Row textAlign="center">
                <Grid.Column width={3}/>
                <Grid.Column width={2} className={apiConnected ? "success-text" : "error-text"}>{apiTested ? (apiConnected ? "CONNECTED" : "NOT CONNECTED") : "NOT TESTED"}</Grid.Column>
                <Grid.Column width={2} className={sckConnected ? "success-text" : "error-text"}>{sckTested ? (sckConnected ? "CONNECTED" : "NOT CONNECTED") : "NOT TESTED"}</Grid.Column>
                <Grid.Column width={2} className={webConnected ? "success-text" : "error-text"}>{webTested ? (webConnected ? "CONNECTED" : "NOT CONNECTED") : "NOT TESTED"}</Grid.Column>
                <Grid.Column width={2} className={toaConnected ? "success-text" : "error-text"}>{toaTested ? (toaConnected ? "CONNECTED" : "NOT CONNECTED") : "NOT TESTED"}</Grid.Column>
                <Grid.Column width={2} className={audConnected ? "success-text" : "error-text"}>{audTested ? (audConnected ? "CONNECTED" : "NOT CONNECTED") : "NOT TESTED"}</Grid.Column>
                <Grid.Column width={3}/>
              </Grid.Row>
              <Grid.Row textAlign="center">
                <Grid.Column width={3}/>
                <Grid.Column width={2}><Button fluid={true} color={getTheme().primary} onClick={this.testAPI}>Test</Button></Grid.Column>
                <Grid.Column width={2}><Button fluid={true} color={getTheme().primary} onClick={this.testSocketIO}>Test</Button></Grid.Column>
                <Grid.Column width={2}><Button fluid={true} color={getTheme().primary} onClick={this.testWeb}>Test</Button></Grid.Column>
                <Grid.Column width={2}><Button fluid={true} color={getTheme().primary} onClick={this.testTOA}>Test</Button></Grid.Column>
                <Grid.Column width={2}><Button fluid={true} color={getTheme().primary} onClick={this.testAudience}>Test</Button></Grid.Column>
                <Grid.Column width={3}/>
              </Grid.Row>
            </Grid>
          </Card.Content>
        </Card>
      </div>
    );
  }

  private updateSocketStatus() {
    this.setState({sckConnected: true, sckTested: true});
  }

  private updateAudStatus() {
    this.setState({audConnected: true, audTested: true});
  }

  private testAPI() {
    EMSProvider.ping().then(() => {
      this.setState({apiConnected: true, apiTested: true});
    }).catch((error: HttpError) => {
      DialogManager.showErrorBox(error);
      this.setState({apiConnected: false, apiTested: true});
    });
  }

  private testSocketIO() {
    SocketProvider.emit("drip");
    setTimeout(() => {
      if (!this.state.sckConnected) {
        this.setState({sckConnected: false, sckTested: true});
      }
    }, 2000);
  }

  private testWeb() {
    WebProvider.ping().then(() => {
      this.setState({webConnected: true, webTested: true});
    }).catch((error: HttpError) => {
      DialogManager.showErrorBox(error);
      this.setState({webConnected: false, webTested: false});
    });
  }

  private testTOA() {
    TOAProvider.ping().then(() => {
      this.setState({toaConnected: true, toaTested: true});
    }).catch((error: HttpError) => {
      DialogManager.showErrorBox(error);
      this.setState({toaConnected: false, toaTested: true});
    });
  }

  private testAudience() {
    SocketProvider.emit("test-audience");
    setTimeout(() => {
      if (!this.state.audConnected) {
        this.setState({audConnected: false, audTested: true});
      }
    }, 2000);
  }
}

export function mapStateToProps({configState}: IApplicationState) {
  return {
    slaveModeEnabled: configState.slaveModeEnabled,
    toaConfig: configState.toaConfig
  };
}

export default connect(mapStateToProps)(MatchTestView);