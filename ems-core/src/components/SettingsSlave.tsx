import * as React from "react";
import {Button, Card, Grid, Input, InputProps, Message} from "semantic-ui-react";
import {getTheme} from "../shared/AppTheme";
import ExplanationIcon from "./ExplanationIcon";
import Event from "../shared/models/Event";
import EventConfiguration from "../shared/models/EventConfiguration";
import {ApplicationActions, IApplicationState} from "../stores";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {SyntheticEvent} from "react";
import EMSProvider from "../shared/providers/EMSProvider";
import {AxiosResponse} from "axios";
import HttpError from "../shared/models/HttpError";
import DialogManager from "../shared/managers/DialogManager";
import * as socket from "socket.io-client";
import {ISetEvent, ISetEventConfiguration, IToggleSlaveMode} from "../stores/config/types";
import {enableSlaveMode, setEvent, setEventConfiguration} from "../stores/config/actions";

interface IProps {
  event?: Event,
  eventConfig?: EventConfiguration,
  slaveMode?: boolean,
  slaveInstanceID?: number,
  masterHost?: string,
  networkHost?: string,
  setEvent: (event: Event) => ISetEvent,
  setEventConfig: (eventConfig: EventConfiguration) => ISetEventConfiguration,
  setSlaveModeEnabled: (enabled: boolean) => IToggleSlaveMode
}

interface IState {
  slaveModeStarted: boolean,
  masterAddress: string,
  masterAddressValid: boolean,
  masterAddressVerified: boolean,
  verifying: boolean,
  masterEvent: Event,
  masterEventConfig: EventConfiguration
}

const ipRegex = /\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\b/;

class SettingsSlave extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      slaveModeStarted: false,
      masterAddress: "",
      masterAddressValid: false,
      masterAddressVerified: false,
      verifying: false,
      masterEvent: undefined,
      masterEventConfig: undefined
    };
    this.startSlaveMode = this.startSlaveMode.bind(this);
    this.disableSlaveMode = this.disableSlaveMode.bind(this);
    this.updateMasterAddress = this.updateMasterAddress.bind(this);
    this.verifyAddress = this.verifyAddress.bind(this);
    this.enableSlaveMode = this.enableSlaveMode.bind(this);
  }

  public render() {
    const {slaveModeStarted, masterAddress, masterAddressValid, masterAddressVerified, verifying} = this.state;
    const {slaveMode} = this.props;
    return (
      <Card fluid={true} color={getTheme().secondary}>
        <Card.Content className="card-header"><h3><ExplanationIcon title={"Slave Configuration"} content={"Only enter this mode if you know what you're doing."}/></h3></Card.Content>
        <Card.Content>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Button fluid={true} disabled={slaveModeStarted || slaveMode || verifying} color={getTheme().secondary} onClick={this.startSlaveMode}>ENABLE SLAVE MODE</Button>
              </Grid.Column>
              <Grid.Column>
                <Button fluid={true} disabled={!slaveModeStarted || verifying} color={getTheme().primary} onClick={this.disableSlaveMode}>DISABLE SLAVE MODE</Button>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Message error={!masterAddressValid || masterAddress.length <= 0} positive={masterAddressValid}>
                  <Input fluid={true} disabled={!slaveModeStarted || slaveMode || verifying} value={masterAddress} onChange={this.updateMasterAddress} label={<Button disabled={!masterAddressValid || verifying} loading={verifying} color={getTheme().secondary} onClick={this.verifyAddress}>Verify IP Address</Button>} labelPosition="right" placeholder="Master EMS IPv4 Address (no port)"/>
                </Message>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Button fluid={true} disabled={!masterAddressVerified || slaveMode} color="red" onClick={this.enableSlaveMode}>ENTER SLAVE MODE</Button>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Button fluid={true} disabled={!slaveMode} color={getTheme().secondary}>Fetch Master Schedule(s)</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    );
  }

  private startSlaveMode() {
    this.setState({slaveModeStarted: true});
  }

  private disableSlaveMode() {
    this.props.setSlaveModeEnabled(false);
    this.setState({slaveModeStarted: false, masterAddressVerified: false});
    // TODO - Set config
  }

  private updateMasterAddress(event: SyntheticEvent, props: InputProps) {
    const validIP = props.value.toString().match(ipRegex) !== null;
    this.setState({masterAddress: props.value, masterAddressValid: validIP});
  }

  private enableSlaveMode() {
    this.props.setSlaveModeEnabled(true);
    this.props.setEvent(this.state.masterEvent);
    this.props.setEventConfig(this.state.masterEventConfig);
    // TODO - Set config
  }

  private verifyAddress() {
    this.setState({verifying: true});
    EMSProvider.initialize(this.state.masterAddress);
    EMSProvider.getEvent().then((response: AxiosResponse) => {
      if (response.data.payload && response.data.payload[0] && response.data.payload[0].event_key) {
        this.requestConfig(this.state.masterAddress).then((config: any) => {
          EMSProvider.initialize(this.props.networkHost);
          this.setState({
            verifying: false,
            masterEvent: new Event().fromJSON(response.data.payload[0]),
            masterEventConfig: new EventConfiguration().fromJSON(config),
            masterAddressVerified: true
          });
        }).catch((error: any) => {
          EMSProvider.initialize(this.props.networkHost);
          DialogManager.showErrorBox(error);
          this.setState({verifying: false});
        });
      } else {
        DialogManager.showInfoBox("Slave Configuration", "The master EMS was found with the IP address, but does not currently have an event configured. Please configure an event before setting up this EMS as a slave instance.");
        this.setState({verifying: false});
      }
    }).catch((error: HttpError) => {
      EMSProvider.initialize(this.props.networkHost);
      DialogManager.showErrorBox(error);
      this.setState({verifying: false});
    });
  }

  private requestConfig(host: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const masterSocket = socket(`http://${host}:${process.env.REACT_APP_EMS_SCK_PORT}/`);
      setTimeout(() => {
        masterSocket.close();
        reject(new HttpError(1500, "ERR_TIMEOUT", "The server didn't send a response in time."));
      }, 3000);
      masterSocket.on("connect", () => {
        masterSocket.emit("identify", ["ems-core-slave", "event"]);
        setTimeout(() => {
          masterSocket.emit("request-config");
        }, 250);
      });
      masterSocket.on("config-receive", (config: any) => {
        resolve(config);
      });
    });
  }

}

export function mapStateToProps({configState}: IApplicationState) {
  return {
    slaveMode: configState.slaveModeEnabled,
    event: configState.event,
    eventConfig: configState.eventConfiguration,
    slaveModeEnabled: configState.slaveModeEnabled,
    slaveInstanceID: configState.slaveInstanceID,
    masterHost: configState.masterHost,
    networkHost: configState.networkHost
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setEvent: (event: Event) => dispatch(setEvent(event)),
    setEventConfig: (eventConfig: EventConfiguration) => dispatch(setEventConfiguration(eventConfig)),
    setSlaveModeEnabled: (enabled: boolean) => dispatch(enableSlaveMode(enabled))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsSlave);