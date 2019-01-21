import * as React from "react";
import {Button, Card, Grid} from "semantic-ui-react";
import {getTheme} from "../../AppTheme";
import {IApplicationState} from "../../stores";
import {connect} from "react-redux";
import DialogManager from "../../managers/DialogManager";
import {EMSProvider, HttpError, SocketProvider, TOAConfig, TOAProvider, WebProvider} from "@the-orange-alliance/lib-ems";

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
  apiTesting: boolean,
  sckTesting: boolean,
  webTesting: boolean,
  toaTesting: boolean,
  audTesting: boolean,
  apiConnected: boolean,
  sckConnected: boolean,
  webConnected: boolean,
  toaConnected: boolean,
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
      apiTesting: false,
      sckTesting: false,
      webTesting: false,
      toaTesting: false,
      audTesting: false,
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
    const {apiTested, sckTested, audTested, webTested, toaTested, apiTesting, sckTesting, webTesting, toaTesting,
      audTesting, apiConnected, sckConnected, webConnected, audConnected, toaConnected
    } = this.state;
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
                <Grid.Column width={2} className={apiConnected ? "success-text" : "error-text"}>
                  {apiTesting ? "TESTING..." :  apiTested ? (apiConnected ? "CONNECTED" : "NOT CONNECTED") : "NOT TESTED"}
                </Grid.Column>
                <Grid.Column width={2} className={sckConnected ? "success-text" : "error-text"}>
                  {sckTesting ? "TESTING..." :  sckTested ? (sckConnected ? "CONNECTED" : "NOT CONNECTED") : "NOT TESTED"}
                </Grid.Column>
                <Grid.Column width={2} className={webConnected ? "success-text" : "error-text"}>
                  {webTesting ? "TESTING..." :  webTested ? (webConnected ? "CONNECTED" : "NOT CONNECTED") : "NOT TESTED"}
                </Grid.Column>
                <Grid.Column width={2} className={toaConnected ? "success-text" : "error-text"}>
                  {toaTesting ? "TESTING..." :  toaTested ? (toaConnected ? "CONNECTED" : "NOT CONNECTED") : "NOT TESTED"}
                </Grid.Column>
                <Grid.Column width={2} className={audConnected ? "success-text" : "error-text"}>
                  {audTesting ? "TESTING..." :  audTested ? (audConnected ? "CONNECTED" : "NOT CONNECTED") : "NOT TESTED"}
                </Grid.Column>
                <Grid.Column width={3}/>
              </Grid.Row>
              <Grid.Row textAlign="center">
                <Grid.Column width={3}/>
                <Grid.Column width={2}>
                  <Button fluid={true} disabled={apiTesting} loading={apiTesting} color={getTheme().primary} onClick={this.testAPI}>Test</Button>
                </Grid.Column>
                <Grid.Column width={2}>
                  <Button fluid={true} disabled={sckTesting} loading={sckTesting} color={getTheme().primary} onClick={this.testSocketIO}>Test</Button>
                </Grid.Column>
                <Grid.Column width={2}>
                  <Button fluid={true} disabled={webTesting} loading={webTesting} color={getTheme().primary} onClick={this.testWeb}>Test</Button>
                </Grid.Column>
                <Grid.Column width={2}>
                  <Button fluid={true} disabled={toaTesting} loading={toaTesting} color={getTheme().primary} onClick={this.testTOA}>Test</Button>
                </Grid.Column>
                <Grid.Column width={2}>
                  <Button fluid={true} disabled={audTesting} loading={audTesting} color={getTheme().primary} onClick={this.testAudience}>Test</Button>
                </Grid.Column>
                <Grid.Column width={3}/>
              </Grid.Row>
            </Grid>
          </Card.Content>
        </Card>
      </div>
    );
  }

  private updateSocketStatus() {
    this.setState({sckConnected: true, sckTested: true, sckTesting: false});
  }

  private updateAudStatus() {
    this.setState({audConnected: true, audTested: true, audTesting: false});
  }

  private testAPI() {
    this.setState({apiTesting: true});
    EMSProvider.ping().then(() => {
      this.setState({apiConnected: true, apiTested: true, apiTesting: false});
    }).catch((error: HttpError) => {
      DialogManager.showErrorBox(error);
      this.setState({apiConnected: false, apiTested: true, apiTesting: false});
    });
  }

  private testSocketIO() {
    this.setState({sckTesting: true});
    SocketProvider.emit("drip");
    setTimeout(() => {
      if (!this.state.sckConnected) {
        this.setState({sckConnected: false, sckTested: true, sckTesting: false});
      }
    }, 2000);
  }

  private testWeb() {
    this.setState({webTesting: true});
    WebProvider.ping().then(() => {
      this.setState({webConnected: true, webTested: true, webTesting: false});
    }).catch((error: HttpError) => {
      DialogManager.showErrorBox(error);
      this.setState({webConnected: false, webTested: false, webTesting: false});
    });
  }

  private testTOA() {
    this.setState({toaTesting: true});
    TOAProvider.ping().then(() => {
      this.setState({toaConnected: true, toaTested: true, toaTesting: false});
    }).catch((error: HttpError) => {
      DialogManager.showErrorBox(error);
      this.setState({toaConnected: false, toaTested: true, toaTesting: false});
    });
  }

  private testAudience() {
    this.setState({audTesting: true});
    SocketProvider.emit("test-audience");
    setTimeout(() => {
      if (!this.state.audConnected) {
        this.setState({audConnected: false, audTested: true, audTesting: false});
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