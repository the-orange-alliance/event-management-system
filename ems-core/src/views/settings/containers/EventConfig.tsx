import * as React from "react";
import {Card, Divider, Tab} from "semantic-ui-react";
import SettingsSlave from "../../../components/SettingsSlave";
import SettingsPostQual from "../../../components/SettingsPostQual";
import SettingsEvent from "../../../components/SettingsEvent";

class EventConfig extends React.Component {
  public render() {
    return (
      <Tab.Pane className="tab-subview">
        <h3>Event Configuration</h3>
        <Divider />
        <Card.Group itemsPerRow={3}>
          <SettingsEvent/>
          <SettingsPostQual/>
          <SettingsSlave/>
        </Card.Group>
      </Tab.Pane>
    );
  }
}

export default EventConfig;