import * as React from "react";
import {Tab} from "semantic-ui-react";
import NetworkConfig from "./containers/NetworkConfig";

class SettingsView extends React.Component {
  public render() {
    return (
      <div className="view">
        <Tab menu={{secondary: true}} defaultActiveIndex={0} panes={ [
          { menuItem: "Network Config", render: () => <NetworkConfig/>},
          { menuItem: "DataSync", render: () => <span>DataSync</span>},
          { menuItem: "Event", render: () => <span>Event</span>},
          { menuItem: "Security", render: () => <span>Security</span>},
          { menuItem: "Logs", render: () => <span>Logs</span>}
        ]}/>
      </div>
    );
  }
}

export default SettingsView;