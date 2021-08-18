import * as React from "react";
import {Tab, TabProps} from "semantic-ui-react";
import NetworkConfig from "./containers/NetworkConfig";
import DataSyncConfig from "./containers/DataSyncConfig";
import EventConfig from "./containers/EventConfig";
import {IApplicationState} from "../../stores";
import {connect} from "react-redux";
import {SyntheticEvent} from "react";
import FmsConfig from "./containers/FmsConfig";
import SecurityConfig from "./containers/SecurityConfig";

interface IProps {
  navigationDisabled?: boolean
}

interface IState {
  activeIndex: number
}

class SettingsView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      activeIndex: 0
    };

    this.onTabChange = this.onTabChange.bind(this);
  }

  public render() {
    return (
      <div className="view">
        <Tab menu={{secondary: true}} activeIndex={this.state.activeIndex} onTabChange={this.onTabChange} panes={ [
          { menuItem: "Network Config", render: () => <NetworkConfig/>},
          { menuItem: "DataSync", render: () => <DataSyncConfig/>},
          { menuItem: "Event", render: () => <EventConfig/>},
          { menuItem: "Security", render: () => <SecurityConfig />},
          { menuItem: "Logs", render: () => <span>Logs</span>},
          { menuItem: "FMS Setup", render: () => <FmsConfig/>},
        ]}/>
      </div>
    );
  }

  private onTabChange(event: SyntheticEvent, props: TabProps) {
    if (!this.props.navigationDisabled) {
      this.setState({activeIndex: parseInt(props.activeIndex as string, 10)});
    }
  }
}

export function mapStateToProps({internalState}: IApplicationState) {
  return {
    navigationDisabled: internalState.navigationDisabled
  };
}

export default connect(mapStateToProps)(SettingsView);
