import * as React from "react";
import {Tab} from "semantic-ui-react";
import NetworkConfig from "./containers/NetworkConfig";
import DataSyncConfig from "./containers/DataSyncConfig";
import EventConfig from "./containers/EventConfig";

class SettingsView extends React.Component {
  public render() {
    return (
      <div className="view">
        <Tab menu={{secondary: true}} defaultActiveIndex={2} panes={ [
          { menuItem: "Network Config", render: () => <NetworkConfig/>},
          { menuItem: "DataSync", render: () => <DataSyncConfig/>},
          { menuItem: "Event", render: () => <EventConfig/>},
          { menuItem: "Security", render: () => <span>Security</span>},
          { menuItem: "Logs", render: () => <span>Logs</span>}
        ]}/>
      </div>
    );
  }
}

export default SettingsView;