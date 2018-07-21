import * as React from "react";
import {Button, Tab} from "semantic-ui-react";
import {getTheme} from "../shared/AppTheme";

class SetupRunMatchMaker extends React.Component {
  public render() {
    return (
      <Tab.Pane className="step-view-tab">
        <Button color={getTheme().primary}>Run Match Maker</Button>
      </Tab.Pane>
    );
  }
}

export default SetupRunMatchMaker;